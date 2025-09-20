'use client';

import { Truncate } from '@re-dev/react-truncate';
import clsx from 'clsx';
import React, { useState } from 'react';
import './truncate-text.scss';

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
    'truncateText',
    `truncateText--${variant}`,
    className,
  );

  return (
    <div className={containerClassName}>
      <Truncate
        lines={lines}
        onTruncate={(truncated) => {
          setIsTruncated(truncated);
        }}
        className='content'
        {...props}
      >
        <div
          className='truncatedContent'
          style={{ display: isTruncated ? 'block' : 'none' }}
        >
          {children}
        </div>
      </Truncate>
    </div>
  );
};

export default TruncateText;
