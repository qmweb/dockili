import clsx from 'clsx';
import React from 'react';
import './badge.scss';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'success'
    | 'warning'
    | 'danger';
  size?: 'xs' | 'sm' | 'regular' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Badge = ({
  children,
  variant = 'default',
  size = 'regular',
  className,
  ...props
}: BadgeProps) => {
  const badgeClassName = clsx(
    'badge',
    `badge--${variant}`,
    `badge--${size}`,
    className,
  );

  return (
    <span className={badgeClassName} {...props}>
      {children}
    </span>
  );
};

export default Badge;
