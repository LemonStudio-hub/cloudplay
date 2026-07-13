import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string | null;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, label, hint, error, id, name, ...props },
  ref,
) {
  const inputId = id || name;
  return (
    <div>
      {label && (
        <label htmlFor={inputId} className="label">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        name={name}
        aria-invalid={!!error}
        className={cn('field', className)}
        style={
          error
            ? { borderColor: 'color-mix(in srgb, var(--danger) 50%, var(--line))' }
            : undefined
        }
        {...props}
      />
      {error ? (
        <p className="hint" style={{ color: 'var(--danger)' }} role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="hint">{hint}</p>
      ) : null}
    </div>
  );
});
