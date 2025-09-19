import clsx from 'clsx';
import React from 'react';
import styles from './input.module.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'error' | 'success' | 'warning';
}

const Input = ({
  type = 'text',
  variant = 'default',
  className,
  ...props
}: React.ComponentProps<'input'> & InputProps) => {
  const inputClassName = clsx(
    styles.input,
    styles[`input--type-${type}`],
    styles[`input--${variant}`],
    className,
  );

  return <input className={inputClassName} {...props} />;
};

export default Input;
