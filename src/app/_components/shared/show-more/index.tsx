'use client';

import { ShowMore as ShowMoreReactTruncate } from '@re-dev/react-truncate';
import clsx from 'clsx';
import React from 'react';
import { useMediaQuery } from 'react-responsive';
import styles from './show-more.module.scss';

interface ShowMoreProps {
  children: React.ReactNode;
  lines?: number;
  className?: string;
  mediaQuery?: number;
  variant?: 'default' | 'compact' | 'expanded';
}

const ShowMore = ({
  children,
  lines = 3,
  className,
  mediaQuery,
  variant = 'default',
  ...props
}: ShowMoreProps) => {
  const isUnderMediaQuery = useMediaQuery({
    maxWidth: mediaQuery ?? 0,
  });

  const containerClassName = clsx(
    styles.showMore,
    styles[`showMore--${variant}`],
    className,
  );

  return (
    <div className={containerClassName}>
      <ShowMoreReactTruncate
        lines={mediaQuery ? (isUnderMediaQuery ? lines : 0) : lines}
        className={styles.content}
        {...props}
      >
        {children}
      </ShowMoreReactTruncate>
    </div>
  );
};

export default ShowMore;
