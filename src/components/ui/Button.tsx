'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'text-white hover:opacity-90 active:scale-[0.98]',
        secondary: 'text-[var(--color-text)] bg-[var(--color-surface-muted)] hover:bg-[var(--color-border)]',
        outline: 'border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface-muted)]',
        ghost: 'text-[var(--color-text)] hover:bg-[var(--color-surface-muted)]',
        danger: 'text-white hover:opacity-90',
        success: 'text-white hover:opacity-90',
      },
      size: {
        sm: 'h-8 px-3 text-sm rounded-[var(--radius-md)]',
        md: 'h-10 px-4 text-sm rounded-[var(--radius-lg)]',
        lg: 'h-12 px-6 text-base rounded-[var(--radius-lg)]',
        xl: 'h-14 px-8 text-lg rounded-[var(--radius-xl)]',
        icon: 'h-10 w-10 rounded-[var(--radius-lg)]',
        'icon-sm': 'h-8 w-8 rounded-[var(--radius-md)]',
        'icon-lg': 'h-12 w-12 rounded-[var(--radius-xl)]',
        full: 'w-full h-12 text-base rounded-[var(--radius-lg)]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(
          buttonVariants({ variant, size, className }),
          variant === 'primary' && 'shadow-sm',
          variant === 'danger' && 'bg-[var(--color-error)]',
          variant === 'success' && 'bg-[var(--color-success)]'
        )}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : leftIcon ? (
          <span className="shrink-0">{leftIcon}</span>
        ) : null}
        {children}
        {rightIcon && !isLoading && (
          <span className="shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
