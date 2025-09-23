'use client';

import { Badge, Button, Checkbox, Table } from '@/app/_components/ui';
import { Repository } from '@/utils/types/registry.interface';
import { ColumnDef } from '@tanstack/react-table';
import {
  ArrowUpDown,
  CalendarDays,
  HardDrive,
  Package,
  Tag,
} from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import './image-tags-table.scss';
import TagsActionBar from './tags-action-bar';

interface TagWithDateAndSize {
  name: string;
  date: Date;
  isLatest: boolean;
  size: number;
  layers: number;
}

interface ImageTagsTableProps {
  repository: Repository | undefined;
  onSelectionChange?: (selectedTags: string[]) => void;
  onDeleteTags?: (tags: string[]) => Promise<void>;
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
    return 'primary';
  return 'default';
};

export default function ImageTagsTable({
  repository,
  onSelectionChange,
  onDeleteTags,
  onRefresh,
}: ImageTagsTableProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
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
      const layers = tagWithSize?.layers || 0;

      return {
        name: tag,
        date,
        isLatest: tag === 'latest',
        size,
        layers,
      };
    });
  }, [repository?.tags, repository?.tagsWithSize]);

  const handleSelectionChange = useCallback(
    (selectedRows: TagWithDateAndSize[]) => {
      console.log('Selection changed:', selectedRows);
      const tagNames = selectedRows.map((row) => row.name);
      setSelectedTags(tagNames);
      onSelectionChange?.(tagNames);
    },
    [onSelectionChange],
  );

  const handleClearSelection = useCallback(() => {
    setSelectedTags([]);
    onSelectionChange?.([]);
  }, [onSelectionChange]);

  const handleDeleteTags = useCallback(
    async (tags: string[]) => {
      if (!onDeleteTags) return;

      setIsDeleting(true);
      try {
        await onDeleteTags(tags);
        // Remove deleted tags from selection
        setSelectedTags((prev) => prev.filter((tag) => !tags.includes(tag)));
        onSelectionChange?.(selectedTags.filter((tag) => !tags.includes(tag)));

        // Refresh the table data after successful deletion
        if (onRefresh) {
          onRefresh();
        }
      } catch (error) {
        console.error('Failed to delete tags:', error);
        // You could add a toast notification here
      } finally {
        setIsDeleting(false);
      }
    },
    [onDeleteTags, selectedTags, onSelectionChange, onRefresh],
  );

  const columns: ColumnDef<TagWithDateAndSize>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected()
              ? true
              : table.getIsSomePageRowsSelected()
                ? 'indeterminate'
                : false
          }
          onCheckedChange={(value) => {
            console.log('Header checkbox clicked:', value);
            table.toggleAllPageRowsSelected(!!value);
          }}
          aria-label='Select all'
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            console.log(
              'Row checkbox clicked:',
              value,
              'for row:',
              row.original.name,
            );
            row.toggleSelected(!!value);
          }}
          aria-label='Select row'
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='image-tags-table__sort-button'
        >
          <Tag className='image-tags-table__header__icon' size={16} />
          Tag Name
          <ArrowUpDown className='image-tags-table__sort-icon' size={14} />
        </Button>
      ),
      cell: ({ row }) => (
        <div className='image-tags-table__tag-cell'>
          <Badge
            variant={getTagVariant(row.original)}
            className='image-tags-table__tag-badge'
          >
            {row.getValue('name')}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: 'date',
      header: ({ column }) => (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='image-tags-table__sort-button'
        >
          <CalendarDays className='image-tags-table__header__icon' size={16} />
          Date
          <ArrowUpDown className='image-tags-table__sort-icon' size={14} />
        </Button>
      ),
      cell: ({ row }) => (
        <span className='image-tags-table__date'>
          {formatDate(row.getValue('date'))}
        </span>
      ),
    },
    {
      accessorKey: 'size',
      header: ({ column }) => (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='image-tags-table__sort-button'
        >
          <HardDrive className='image-tags-table__header__icon' size={16} />
          Size
          <ArrowUpDown className='image-tags-table__sort-icon' size={14} />
        </Button>
      ),
      cell: ({ row }) => <div>{formatFileSize(row.getValue('size'))}</div>,
    },
    {
      accessorKey: 'layers',
      header: ({ column }) => (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='image-tags-table__sort-button'
        >
          <Package className='image-tags-table__header__icon' size={16} />
          Layers
          <ArrowUpDown className='image-tags-table__sort-icon' size={14} />
        </Button>
      ),
      cell: ({ row }) => (
        <span className='image-tags-table__layers'>
          {row.getValue('layers')} layer
          {(row.getValue('layers') as number) !== 1 ? 's' : ''}
        </span>
      ),
    },
  ];

  if (!repository) {
    return null;
  }

  return (
    <div className='image-tags-table'>
      <TagsActionBar
        selectedTags={selectedTags}
        onClearSelection={handleClearSelection}
        onDeleteTags={handleDeleteTags}
        isDeleting={isDeleting}
      />
      <div className='image-tags-table__table-wrapper'>
        <Table
          columns={columns}
          data={processedTags}
          enableSelection={true}
          onSelectionChange={handleSelectionChange}
          className='image-tags-table__table'
        />
      </div>
    </div>
  );
}
