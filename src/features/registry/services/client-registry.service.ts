import {
  SidebarImage,
  SidebarMenuData,
  SidebarMenuItem,
} from '@/utils/types/registry.interface';

class ClientRegistryService {
  private async fetchFromAPI<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(endpoint);

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          // If response is not JSON, try to get text
          try {
            const textResponse = await response.text();
            console.error(
              'ClientRegistryService: Non-JSON response:',
              textResponse.substring(0, 200),
            );
            errorMessage = `Server returned HTML instead of JSON. Status: ${response.status}`;
          } catch (textError) {
            console.error(
              'ClientRegistryService: Could not parse response as text:',
              textError,
            );
          }
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async getSidebarMenuData(): Promise<SidebarMenuData> {
    try {
      // Get repositories with their tags from API
      const { repositories } = await this.fetchFromAPI<{
        repositories: Array<{ name: string; tags: string[] }>;
      }>('/api/registry/repositories');

      // Create the Images menu item with dynamic data
      const imagesMenuItem: SidebarMenuItem = {
        title: 'Images',
        url: '#',
        isActive: false,
        icon: 'Package',
        items: repositories.map(
          (repo): SidebarImage => ({
            title: repo.name,
            url: `/images/${encodeURIComponent(repo.name)}`,
            isActive: false,
            icon: 'Package',
          }),
        ),
      };

      // Create the complete menu structure
      const menuData: SidebarMenuData = {
        navMain: [imagesMenuItem],
      };

      return menuData;
    } catch (error) {
      console.error('Failed to generate sidebar menu data:', error);

      // Return fallback menu structure in case of error
      return {
        navMain: [
          {
            title: 'Dashboard',
            url: '#/dashboard',
            isActive: true,
            icon: 'LayoutDashboard',
          },
          {
            title: 'Images',
            url: '#/images',
            isActive: false,
            icon: 'Package',
            items: [
              {
                title: 'Error loading images',
                url: '#',
                isActive: false,
                icon: 'AlertCircle',
              },
            ],
          },
        ],
      };
    }
  }
}

export const clientRegistryService = new ClientRegistryService();
