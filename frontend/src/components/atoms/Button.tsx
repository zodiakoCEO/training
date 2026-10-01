import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'quiet';
}

export const Button = ({
  children,
  className = '',
  variant = 'primary',
  ...props
}: ButtonProps) => (
  <button className={`button button--${variant} ${className}`.trim()} {...props}>
    {children}
  </button>
);