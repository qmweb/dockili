import clsx from 'clsx';
import React from 'react';
import './separator.scss';

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

const Separator = ({
  orientation = 'horizontal',
  className,
  ...props
}: SeparatorProps) => {
  return (
    <div
      className={clsx('separator', `separator--${orientation}`, className)}
      data-orientation={orientation}
      {...props}
    />
  );
};

export { Separator };
