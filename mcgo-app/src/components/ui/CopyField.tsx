import { memo } from 'react';
import { Check, Copy } from 'lucide-react';
import { useCopy } from '../../hooks/useCopy';
import { useI18n } from '../../i18n';
import { cn } from '../../lib/cn';

export const CopyField = memo(function CopyField({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const { copied, copy } = useCopy();
  const { t } = useI18n();
  return (
    <div
      className={cn('flex items-center gap-2 rounded-lg border p-1 pl-3', className)}
      style={{
        borderColor: 'var(--line)',
        background: 'var(--field-bg)',
      }}
    >
      <code
        className="mono min-w-0 flex-1 truncate"
        style={{ color: 'var(--ink)' }}
        title={value}
      >
        {value}
      </code>
      <button
        type="button"
        onClick={() => copy(value)}
        className="rounded-md p-2 transition-colors"
        style={{ color: copied ? 'var(--green)' : 'var(--mute)' }}
        aria-label={copied ? t('a11y.copied') : t('a11y.copy')}
      >
        {copied ? <Check size={15} /> : <Copy size={15} />}
      </button>
    </div>
  );
});
