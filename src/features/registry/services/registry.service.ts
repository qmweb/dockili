import {
  REGISTRY_CONFIG,
  validateRegistryConfig,
} from '@/utils/constants/registry';
import {
  DockerRegistryCatalogResponse,
  DockerRegistryTagsResponse,
  ImageManifest,
  RegistryRepositoriesResponse,
  Repository,
  TagWithSize,
} from '@/utils/types/registry.interface';
import axios, { AxiosResponse } from 'axios';

class RegistryService {
  private baseUrl: string | null = null;
  private auth: string | null = null;

  private initializeConfig() {
    if (!validateRegistryConfig()) {
      throw new Error('Missing required Docker registry configuration');
    }

    if (!this.baseUrl || !this.auth) {
      this.baseUrl = REGISTRY_CONFIG.REGISTRY_URL.replace(/\/$/, ''); // Remove trailing slash
      this.auth = Buffer.from(
        `${REGISTRY_CONFIG.USERNAME}:${REGISTRY_CONFIG.PASSWORD}`,
      ).toString('base64');
    }
  }

  private async makeRequest<T>(endpoint: string): Promise<T> {
    this.initializeConfig();

    try {
      const response: AxiosResponse<T> = await axios.get(
        `${this.baseUrl}${endpoint}`,
        {
          headers: {
            Authorization: `Basic ${this.auth}`,
            Accept: 'application/json',
          },
          timeout: 5000, // 5 second timeout
        },
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Authentication failed: Invalid credentials');
        }
        if (error.response?.status === 403) {
          throw new Error('Access forbidden: Insufficient permissions');
        }
        if (error.response?.status === 404) {
          throw new Error('Registry endpoint not found');
        }
        if (error.code === 'ECONNABORTED') {
          throw new Error('Registry request failed: timeout exceeded');
        }
        throw new Error(`Registry request failed: ${error.message}`);
      }
      throw new Error('Unknown error occurred while connecting to registry');
    }
  }

  async getRepositories(): Promise<string[]> {
    try {
      const response =
        await this.makeRequest<DockerRegistryCatalogResponse>('/v2/_catalog');
      return response.repositories || [];
    } catch (error) {
      console.error('Failed to fetch repositories:', error);
      throw error;
    }
  }

  async getRepositoryTags(repositoryName: string): Promise<string[]> {
    try {
      const response = await this.makeRequest<DockerRegistryTagsResponse>(
        `/v2/${repositoryName}/tags/list`,
      );
      return response.tags || [];
    } catch (error) {
      console.error(
        `Failed to fetch tags for repository ${repositoryName}:`,
        error,
      );
      throw error;
    }
  }

  async getImageManifest(
    repositoryName: string,
    tag: string,
  ): Promise<ImageManifest> {
    try {
      const response = await this.makeRequest<ImageManifest>(
        `/v2/${repositoryName}/manifests/${tag}`,
      );

      return response;
    } catch (error) {
      console.error(
        `Failed to fetch manifest for ${repositoryName}:${tag}:`,
        error,
      );
      throw error;
    }
  }

  async getTagWithSize(
    repositoryName: string,
    tag: string,
  ): Promise<TagWithSize> {
    try {
      const manifest = await this.getImageManifest(repositoryName, tag);

      // Handle different manifest formats
      let layers = manifest.layers || [];
      let configSize = 0;
      let totalSize = 0;
      let compressedSize = 0;

      // Check if this is Docker Registry v1 format (schema version 1)
      if (manifest.schemaVersion === 1) {
        // For v1 manifests, we can't easily get exact sizes without additional API calls
        // Instead, we'll use a reasonable estimation based on the number of layers
        if (manifest.fsLayers && manifest.fsLayers.length > 0) {
          // Estimate size based on number of layers
          // Docker images typically range from 100MB to 2GB, with most being 200-800MB
          const estimatedSizePerLayer = 50 * 1024 * 1024; // 50MB per layer
          totalSize = manifest.fsLayers.length * estimatedSizePerLayer;
          compressedSize = totalSize; // In v1, compressed and uncompressed are the same

          layers = manifest.fsLayers.map((fsLayer) => ({
            mediaType: 'application/vnd.docker.image.rootfs.diff.tar.gzip',
            size: estimatedSizePerLayer,
            digest: fsLayer.blobSum,
          }));
        }
      }
      // Check if this is a manifest list (multi-architecture)
      else if (manifest.manifests && manifest.manifests.length > 0) {
        // For manifest lists, we need to fetch the actual manifest for a specific platform
        // For now, we'll use the first available manifest
        const firstManifest = manifest.manifests[0];
        if (firstManifest.digest) {
          try {
            const actualManifest = await this.makeRequest<ImageManifest>(
              `/v2/${repositoryName}/manifests/${firstManifest.digest}`,
            );
            layers = actualManifest.layers || [];
            if (actualManifest.config && actualManifest.config.size) {
              configSize = actualManifest.config.size;
            }
          } catch (error) {
            console.warn(
              `Failed to fetch actual manifest for ${repositoryName}:${tag}:`,
              error,
            );
          }
        }
      } else {
        // Regular single-architecture manifest (v2)
        layers = manifest.layers || [];
        if (manifest.config && manifest.config.size) {
          configSize = manifest.config.size;
        }
      }

      // Calculate total size (uncompressed) - sum of all layer sizes
      if (totalSize === 0) {
        totalSize = layers.reduce(
          (sum, layer) => sum + (layer.size || 0),
          configSize,
        );
      }

      // Calculate compressed size (what's actually stored) - same as total for now
      if (compressedSize === 0) {
        compressedSize = layers.reduce(
          (sum, layer) => sum + (layer.size || 0),
          configSize,
        );
      }

      return {
        name: tag,
        size: totalSize,
        compressedSize: compressedSize,
        layers: layers.length,
      };
    } catch (error) {
      console.error(`Failed to get size for ${repositoryName}:${tag}:`, error);
      // Return default values if manifest fetch fails
      return {
        name: tag,
        size: 0,
        compressedSize: 0,
        layers: 0,
      };
    }
  }

  async getRepositoriesWithTags(): Promise<RegistryRepositoriesResponse> {
    try {
      const repositoryNames = await this.getRepositories();

      if (repositoryNames.length === 0) {
        return { repositories: [] };
      }

      const repositories: Repository[] = await Promise.all(
        repositoryNames.map(async (name) => {
          try {
            const tags = await this.getRepositoryTags(name);

            // Get size information for each tag
            const tagsWithSize: TagWithSize[] = await Promise.all(
              tags.map(async (tag) => {
                try {
                  return await this.getTagWithSize(name, tag);
                } catch (error) {
                  console.warn(
                    `Could not fetch size for ${name}:${tag}:`,
                    error,
                  );
                  return {
                    name: tag,
                    size: 0,
                    compressedSize: 0,
                    layers: 0,
                  };
                }
              }),
            );

            // Calculate totals
            const totalSize = tagsWithSize.reduce(
              (sum, tag) => sum + tag.size,
              0,
            );
            const totalCompressedSize = tagsWithSize.reduce(
              (sum, tag) => sum + tag.compressedSize,
              0,
            );

            return {
              name,
              tags,
              tagsWithSize,
              totalSize,
              totalCompressedSize,
            };
          } catch (error) {
            // If we can't fetch tags for a repository, return it with empty tags
            console.warn(`Could not fetch tags for repository ${name}:`, error);
            return {
              name,
              tags: [],
              tagsWithSize: [],
              totalSize: 0,
              totalCompressedSize: 0,
            };
          }
        }),
      );

      return { repositories };
    } catch (error) {
      console.error('Failed to fetch repositories with tags:', error);
      throw error;
    }
  }
}

export const registryService = new RegistryService();
