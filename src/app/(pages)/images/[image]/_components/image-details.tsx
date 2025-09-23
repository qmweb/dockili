'use client';

import { Badge } from '@/app/_components/ui';
import { Repository } from '@/utils/types/registry.interface';
import { HardDrive, Tag } from 'lucide-react';
import { notFound } from 'next/navigation';
import { useCallback } from 'react';
import { toast } from 'sonner';
import './image-details.scss';
import ImageTagsTable from './image-tags-table';

interface ImageDetailsProps {
  repository: Repository | undefined;
  error: string | null;
  imageName: string;
  onRefresh?: () => void;
}

// Utility function to format file sizes
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export default function ImageDetails({
  repository,
  imageName,
  onRefresh,
}: ImageDetailsProps) {
  const handleTagSelection = useCallback((selectedTags: string[]) => {
    console.log('Selected tags:', selectedTags);
  }, []);

  const handleDeleteTags = useCallback(
    async (tags: string[]) => {
      try {
        console.log('Deleting tags:', tags);

        const response = await fetch(
          `/api/registry/repositories/${imageName}/tags`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tags }),
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || `HTTP error! status: ${response.status}`,
          );
        }

        const result = await response.json();
        console.log('Deletion result:', result);

        // Show success message
        if (result.summary.successful > 0) {
          toast.success(
            `Successfully deleted ${result.summary.successful} tag(s)`,
            {
              description: result.deleted.join(', '),
              duration: 4000,
            },
          );
        }

        // Show error messages for failed deletions
        if (result.summary.failed > 0) {
          result.failed.forEach((failure: { tag: string; error: string }) => {
            toast.error(`Failed to delete tag: ${failure.tag}`, {
              description: failure.error,
              duration: 6000,
            });
          });
        }

        // Show warning if some deletions failed
        if (result.summary.failed > 0 && result.summary.successful > 0) {
          toast.warning(`Partial deletion completed`, {
            description: `${result.summary.successful} succeeded, ${result.summary.failed} failed`,
            duration: 5000,
          });
        }
      } catch (error) {
        console.error('Failed to delete tags:', error);
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error occurred';

        toast.error('Failed to delete tags', {
          description: errorMessage,
          duration: 6000,
        });

        throw error; // Re-throw to let the action bar handle the error state
      }
    },
    [imageName],
  );

  if (!repository) {
    notFound();
  }

  return (
    <div className='imageDetails'>
      <div className='imageDetails__header'>
        <div className='imageDetails__header__info'>
          <h1 className='imageDetails__title'>{repository.name}</h1>
          <div className='imageDetails__stats'>
            <Badge>
              <Tag className='imageDetails__stats__icon' size={16} />
              {repository.tags.length} Tag
              {repository.tags.length !== 1 ? 's' : ''}
            </Badge>
            <Badge>
              <HardDrive className='imageDetails__stats__icon' size={16} />
              {formatFileSize(repository.totalSize || 0)}
            </Badge>
          </div>
        </div>
      </div>

      <ImageTagsTable
        repository={repository}
        onSelectionChange={handleTagSelection}
        onDeleteTags={handleDeleteTags}
        onRefresh={onRefresh}
      />
    </div>
  );
}
