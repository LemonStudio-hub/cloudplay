import { memo, useCallback } from 'react';
import { WindowControls } from './WindowControls';
import { useI18n } from '../i18n';
import { isTauri } from '../lib/tauri';

/**
 * Full-width transparent title strip, flush with window controls.
 * Drag to move; double-click to maximize / restore.
 */
export const TitleBar = memo(function TitleBar() {
  const { t } = useI18n();
  const onDoubleClick = useCallback(async () => {
    if (!isTauri()) return;
    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window');
      await getCurrentWindow().toggleMaximize();
    } catch {
      /* browser / no window API */
    }
  }, []);

  return (
    <header className="titlebar" aria-label={t('a11y.titlebar')}>
      <div
        className="titlebar__drag"
        data-tauri-drag-region
        onDoubleClick={onDoubleClick}
        title={t('a11y.dragHint')}
      />
      <WindowControls />
    </header>
  );
});
