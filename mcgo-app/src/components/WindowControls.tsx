import { memo, useCallback, useEffect, useState } from 'react';
import { Copy, Minus, Square, X } from 'lucide-react';

function isTauri(): boolean {
  return (
    typeof window !== 'undefined' &&
    ('__TAURI_INTERNALS__' in window || '__TAURI__' in window)
  );
}

async function getAppWindow() {
  const { getCurrentWindow } = await import('@tauri-apps/api/window');
  return getCurrentWindow();
}

const iconProps = {
  size: 12,
  strokeWidth: 1.2,
  absoluteStrokeWidth: true,
  'aria-hidden': true as const,
};

/** Minimize / maximize / close — top-right corner (Windows layout). */
export const WindowControls = memo(function WindowControls() {
  const [maximized, setMaximized] = useState(false);
  const tauri = isTauri();

  useEffect(() => {
    if (!tauri) return;
    let unlisten: (() => void) | undefined;

    (async () => {
      try {
        const win = await getAppWindow();
        setMaximized(await win.isMaximized());
        unlisten = await win.onResized(async () => {
          setMaximized(await win.isMaximized());
        });
      } catch {
        /* browser */
      }
    })();

    return () => {
      unlisten?.();
    };
  }, [tauri]);

  const minimize = useCallback(async () => {
    if (!tauri) return;
    try {
      await (await getAppWindow()).minimize();
    } catch {
      /* noop */
    }
  }, [tauri]);

  const toggleMax = useCallback(async () => {
    if (!tauri) return;
    try {
      const win = await getAppWindow();
      await win.toggleMaximize();
      setMaximized(await win.isMaximized());
    } catch {
      /* noop */
    }
  }, [tauri]);

  const close = useCallback(async () => {
    if (!tauri) return;
    try {
      await (await getAppWindow()).close();
    } catch {
      /* noop */
    }
  }, [tauri]);

  return (
    <div className="win-controls" role="toolbar" aria-label="窗口控制">
      <button
        type="button"
        className="win-controls__btn"
        onClick={minimize}
        aria-label="最小化"
        tabIndex={-1}
      >
        <Minus {...iconProps} />
      </button>
      <button
        type="button"
        className="win-controls__btn"
        onClick={toggleMax}
        aria-label={maximized ? '还原' : '最大化'}
        tabIndex={-1}
      >
        {maximized ? <Copy {...iconProps} /> : <Square {...iconProps} />}
      </button>
      <button
        type="button"
        className="win-controls__btn win-controls__btn--close"
        onClick={close}
        aria-label="关闭"
        tabIndex={-1}
      >
        <X {...iconProps} />
      </button>
    </div>
  );
});
