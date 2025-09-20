'use client';

import { Badge, Button } from '@/app/_components/ui';
import { Repository } from '@/utils/types/registry.interface';
import {
  AlertTriangle,
  ArrowUpDown,
  CheckCircle,
  HardDrive,
  Package,
  RotateCcw,
  Search,
  Shuffle,
  Tag,
  XCircle,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import './image-details.scss';

interface ImageDetailsProps {
  repository: Repository | undefined;
  error: string | null;
  imageName: string;
}

interface TagWithDate {
  name: string;
  date: Date;
  isLatest: boolean;
}

interface TagWithDateAndSize extends TagWithDate {
  size: number;
  compressedSize: number;
  layers: number;
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
  error,
  imageName,
}: ImageDetailsProps) {
  const [sortBy, setSortBy] = useState<'name' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Process tags with date and size information
  const processedTags = useMemo((): TagWithDateAndSize[] => {
    if (!repository?.tags || !repository?.tagsWithSize) return [];

    return repository.tags.map((tag) => {
      // Try to extract date from tag name (common patterns)
      let date = new Date();

      // Pattern 1: YYYY-MM-DD or YYYYMMDD
      const dateMatch = tag.match(/(\d{4})-?(\d{2})-?(\d{2})/);
      if (dateMatch) {
        const [, year, month, day] = dateMatch;
        date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      }
      // Pattern 2: v1.2.3-20240101 or similar
      else {
        const versionDateMatch = tag.match(/(\d{8})/);
        if (versionDateMatch) {
          const dateStr = versionDateMatch[1];
          const year = dateStr.substring(0, 4);
          const month = dateStr.substring(4, 6);
          const day = dateStr.substring(6, 8);
          date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        }
      }

      // Find size information for this tag
      const tagWithSize = repository.tagsWithSize?.find((t) => t.name === tag);
      const size = tagWithSize?.size || 0;
      const compressedSize = tagWithSize?.compressedSize || 0;
      const layers = tagWithSize?.layers || 0;

      return {
        name: tag,
        date,
        isLatest: tag === 'latest',
        size,
        compressedSize,
        layers,
      };
    });
  }, [repository?.tags, repository?.tagsWithSize]);

  // Sort tags based on current sort settings
  const sortedTags = useMemo(() => {
    const sorted = [...processedTags].sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc'
          ? a.date.getTime() - b.date.getTime()
          : b.date.getTime() - a.date.getTime();
      } else {
        return sortOrder === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
    });

    // Always put 'latest' first if it exists
    const latestTag = sorted.find((tag) => tag.isLatest);
    if (latestTag) {
      const otherTags = sorted.filter((tag) => !tag.isLatest);
      return [latestTag, ...otherTags];
    }

    return sorted;
  }, [processedTags, sortBy, sortOrder]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTagVariant = (tag: TagWithDateAndSize) => {
    if (tag.isLatest) return 'primary';
    if (tag.name.includes('dev') || tag.name.includes('test')) return 'warning';
    if (tag.name.includes('prod') || tag.name.includes('stable'))
      return 'success';
    return 'default';
  };

  if (error) {
    return (
      <div className='imageDetails__error'>
        <div className='imageDetails__error__content'>
          <h1 className='imageDetails__error__title'>
            <AlertTriangle className='imageDetails__error__icon' size={24} />
            Error Loading Image
          </h1>
          <p className='imageDetails__error__message'>{error}</p>
          <Button variant='primary' onClick={() => window.location.reload()}>
            <RotateCcw className='imageDetails__error__retry__icon' size={16} />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!repository) {
    return (
      <div className='imageDetails__notFound'>
        <div className='imageDetails__notFound__content'>
          <h1 className='imageDetails__notFound__title'>
            <Search className='imageDetails__notFound__icon' size={24} />
            Image Not Found
          </h1>
          <p className='imageDetails__notFound__message'>
            The image "{imageName}" was not found in the registry.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='imageDetails'>
      {/* Header */}
      <div className='imageDetails__header'>
        <div className='imageDetails__header__info'>
          <h1 className='imageDetails__title'>{repository.name}</h1>
          <div className='imageDetails__stats'>
            <Badge variant='primary' size='lg'>
              <Tag className='imageDetails__stats__icon' size={16} />
              {repository.tags.length} Tag
              {repository.tags.length !== 1 ? 's' : ''}
            </Badge>
            <Badge variant='secondary' size='md'>
              {repository.tags.filter((tag) => tag === 'latest').length > 0 ? (
                <CheckCircle className='imageDetails__stats__icon' size={16} />
              ) : (
                <XCircle className='imageDetails__stats__icon' size={16} />
              )}
              {repository.tags.filter((tag) => tag === 'latest').length > 0
                ? 'Has Latest'
                : 'No Latest'}
            </Badge>
            <Badge variant='tertiary' size='md'>
              <HardDrive className='imageDetails__stats__icon' size={16} />
              {formatFileSize(repository.totalSize || 0)}
            </Badge>
          </div>
        </div>
      </div>

      <div className='imageDetails__tags'>
        <div className='imageDetails__tags__header'>
          <h3 className='imageDetails__tags__title'>
            <Package className='imageDetails__tags__title__icon' size={20} />
            Tags
          </h3>
          <div className='imageDetails__tags__controls'>
            <div className='imageDetails__tags__sort'>
              <label className='imageDetails__tags__label'>
                <Shuffle
                  className='imageDetails__tags__label__icon'
                  size={14}
                />
                Sort by:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'date')}
                className='imageDetails__tags__select'
              >
                <option value='date'>📅 Date</option>
                <option value='name'>🏷️ Name</option>
              </select>
            </div>
            <div className='imageDetails__tags__order'>
              <label className='imageDetails__tags__label'>
                <ArrowUpDown
                  className='imageDetails__tags__label__icon'
                  size={14}
                />
                Order:
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                className='imageDetails__tags__select'
              >
                <option value='desc'>⬇️ Newest First</option>
                <option value='asc'>⬆️ Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {sortedTags.length === 0 ? (
          <div className='imageDetails__tags__empty'>
            <p>No tags available for this repository</p>
          </div>
        ) : (
          <div className='imageDetails__tags__list'>
            {sortedTags.map((tag) => (
              <div key={tag.name} className='imageDetails__tags__item'>
                <div className='imageDetails__tags__item__content'>
                  <div className='imageDetails__tags__item__info'>
                    <Badge
                      variant={getTagVariant(tag)}
                      size='md'
                      className='imageDetails__tags__item__badge'
                    >
                      {tag.name}
                    </Badge>
                    <span className='imageDetails__tags__item__date'>
                      {formatDate(tag.date)}
                    </span>
                  </div>
                  <div className='imageDetails__tags__item__size'>
                    <span className='imageDetails__tags__item__size__value'>
                      <HardDrive
                        className='imageDetails__tags__item__size__icon'
                        size={12}
                      />
                      {formatFileSize(tag.size)}
                    </span>
                    <span className='imageDetails__tags__item__layers'>
                      <Package
                        className='imageDetails__tags__item__layers__icon'
                        size={12}
                      />
                      {tag.layers} layer{tag.layers !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
