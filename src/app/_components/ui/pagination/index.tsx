import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import Button from '../button';
import styles from './pagination.module.scss';

interface PaginationProps extends React.ComponentProps<'nav'> {
  className?: string;
}

function Pagination({ className, ...props }: PaginationProps) {
  return (
    <nav
      role='navigation'
      aria-label='pagination'
      data-slot='pagination'
      className={clsx(styles.pagination, className)}
      {...props}
    />
  );
}

interface PaginationContentProps extends React.ComponentProps<'ul'> {
  className?: string;
}

function PaginationContent({ className, ...props }: PaginationContentProps) {
  return (
    <ul
      data-slot='pagination-content'
      className={clsx(styles.pagination__content, className)}
      {...props}
    />
  );
}

interface PaginationItemProps extends React.ComponentProps<'li'> {
  className?: string;
  isActive?: boolean;
  variant?: 'ghost' | 'primary';
  disabled?: boolean;
}

function PaginationItem({
  className,
  isActive = false,
  variant = 'ghost',
  disabled = false,
  ...props
}: PaginationItemProps) {
  return (
    <li
      data-slot='pagination-item'
      data-active={isActive}
      aria-current={isActive ? 'page' : undefined}
      className={clsx(styles.pagination__item, className)}
      {...props}
    >
      <Button
        variant={isActive ? 'primary' : variant}
        className={styles.pagination__item__button}
        disabled={disabled}
      >
        {props.children}
      </Button>
    </li>
  );
}

interface PaginationLinkProps extends React.ComponentProps<typeof Link> {
  className?: string;
}

function PaginationLink({ className, ...props }: PaginationLinkProps) {
  return (
    <Link
      data-slot='pagination-link'
      className={clsx(styles.pagination__link, className)}
      {...props}
    />
  );
}

interface PaginationPreviousProps
  extends React.ComponentProps<typeof PaginationLink> {
  className?: string;
}

function PaginationPrevious({ className, ...props }: PaginationPreviousProps) {
  return (
    <>
      <ChevronLeft size={16} />
      <PaginationLink
        aria-label='Page précédente'
        className={clsx(styles.pagination__previous, className)}
        {...props}
      >
        <span className={styles.pagination__previous__text}>Précédent</span>
      </PaginationLink>
    </>
  );
}

interface PaginationNextProps
  extends React.ComponentProps<typeof PaginationLink> {
  className?: string;
}

function PaginationNext({ className, ...props }: PaginationNextProps) {
  return (
    <>
      <PaginationLink
        aria-label='Page suivante'
        className={clsx(styles.pagination__next, className)}
        {...props}
      >
        <span className={styles.pagination__next__text}>Suivant</span>
      </PaginationLink>
      <ChevronRight size={16} />
    </>
  );
}

interface PaginationEllipsisProps extends React.ComponentProps<'span'> {
  className?: string;
}

function PaginationEllipsis({ className, ...props }: PaginationEllipsisProps) {
  return (
    <span
      aria-hidden
      data-slot='pagination-ellipsis'
      className={clsx(styles.pagination__ellipsis, className)}
      {...props}
    >
      <span className={styles.pagination__ellipsis__icon}>⋯</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
