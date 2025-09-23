'use client';

import { registryService } from '@/features/registry';
import { Repository } from '@/utils/types/registry.interface';
import { useState } from 'react';
import ImageDetails from './image-details';

interface ImageDetailsWrapperProps {
  initialRepository: Repository | undefined;
  initialError: string | null;
  imageName: string;
}

export default function ImageDetailsWrapper({
  initialRepository,
  initialError,
  imageName,
}: ImageDetailsWrapperProps) {
  const [repository, setRepository] = useState<Repository | undefined>(
    initialRepository,
  );
  const [error, setError] = useState<string | null>(initialError);

  const refreshData = async () => {
    setError(null);

    try {
      const repositoriesData = await registryService.getRepositoriesWithTags();
      const foundRepository = repositoriesData.repositories.find(
        (repo) => repo.name === imageName,
      );

      if (foundRepository) {
        setRepository(foundRepository);
        setError(null);
      } else {
        setRepository(undefined);
        setError('Repository not found');
      }
    } catch (err) {
      console.error('Failed to refresh registry data:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to refresh registry data',
      );
    }
  };

  return (
    <ImageDetails
      repository={repository}
      error={error}
      imageName={imageName}
      onRefresh={refreshData}
    />
  );
}
