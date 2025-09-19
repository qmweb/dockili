import clsx from 'clsx';
import React from 'react';
import styles from './badge.module.scss';

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
    styles.badge,
    styles[`badge--${variant}`],
    styles[`badge--${size}`],
    className,
  );

  return (
    <span className={badgeClassName} {...props}>
      {children}
    </span>
  );
};

export default Badge;
