import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/cn';

type Variant = 'solid' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
  fullWidth?: boolean;
}

const map: Record<Variant, string> = {
  solid: 'btn btn-solid',
  ghost: 'btn btn-ghost',
  danger: 'btn btn-danger',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      className,
      variant = 'solid',
      loading,
      fullWidth,
      disabled,
      children,
      type = 'button',
      ...props
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={cn(map[variant], fullWidth && 'w-full', className)}
        {...props}
      >
        {children}
      </button>
    );
  },
);
