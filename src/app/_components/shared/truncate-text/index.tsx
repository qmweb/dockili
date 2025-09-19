'use client';

import { Truncate } from '@re-dev/react-truncate';
import clsx from 'clsx';
import React, { useState } from 'react';
import styles from './truncate-text.module.scss';

interface TruncateTextProps {
  children: React.ReactNode;
  lines: number;
  variant?: 'default' | 'compact' | 'expanded';
  className?: string;
}

const TruncateText = ({
  children,
  lines,
  variant = 'default',
  className,
  ...props
}: TruncateTextProps) => {
  const [isTruncated, setIsTruncated] = useState(false);

  const containerClassName = clsx(
    styles.truncateText,
    styles[`truncateText--${variant}`],
    className,
  );

  return (
    <div className={containerClassName}>
      <Truncate
        lines={lines}
        onTruncate={(truncated) => {
          setIsTruncated(truncated);
        }}
        className={styles.content}
        {...props}
      >
        <div
          className={styles.truncatedContent}
          style={{ display: isTruncated ? 'block' : 'none' }}
        >
          {children}
        </div>
      </Truncate>
    </div>
  );
};

export default TruncateText;
