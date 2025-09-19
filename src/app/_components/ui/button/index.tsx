import clsx from 'clsx';
import React from 'react';
import styles from './button.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'link'
    | 'ghost'
    | 'success'
    | 'warning'
    | 'danger';
  size?: 'xs' | 'sm' | 'regular' | 'md' | 'lg' | 'xl';
  loading?: boolean;
}

const Button = ({
  children,
  variant = 'default',
  size = 'regular',
  className,
  loading = false,
  disabled,
  ...props
}: React.ComponentProps<'button'> & ButtonProps) => {
  const buttonClassName = clsx(
    styles.button,
    styles[`button--${variant}`],
    styles[`button--${size}`],
    className,
  );

  return (
    <button
      type='button'
      className={buttonClassName}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className={styles['button__spinner']}>
          <svg
            className={styles['button__spinner__svg']}
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <circle
              className={styles['button__spinner__circle']}
              cx='12'
              cy='12'
              r='10'
              stroke='currentColor'
              strokeWidth='4'
            />
          </svg>
        </span>
      )}
      {children}
    </button>
  );
};

export default Button;
