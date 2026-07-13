import { memo, useCallback, useEffect, useState } from 'react';
import { Logo } from './Logo';

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

export const TitleBar = memo(function TitleBar() {
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
        // browser preview
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
    <header className="titlebar">
      {/* Drag region — exclude window buttons */}
      <div className="titlebar__drag" data-tauri-drag-region onDoubleClick={toggleMax}>
        <div className="titlebar__brand" data-tauri-drag-region>
          <Logo size={18} />
          <span className="titlebar__name" data-tauri-drag-region>
            CloudPlay
          </span>
          <span className="titlebar__sub" data-tauri-drag-region>
            云玩
          </span>
        </div>
      </div>

      <div className="titlebar__controls">
        <button
          type="button"
          className="titlebar__btn"
          onClick={minimize}
          aria-label="最小化"
          tabIndex={-1}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
            <path d="M1 5h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </button>
        <button
          type="button"
          className="titlebar__btn"
          onClick={toggleMax}
          aria-label={maximized ? '还原' : '最大化'}
          tabIndex={-1}
        >
          {maximized ? (
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
              <path
                d="M3 2.5h4.5V7H3V2.5zM2.5 3.5H2v4.5h4.5v-.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.1"
              />
            </svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
              <rect
                x="1.5"
                y="1.5"
                width="7"
                height="7"
                rx="0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.1"
              />
            </svg>
          )}
        </button>
        <button
          type="button"
          className="titlebar__btn titlebar__btn--close"
          onClick={close}
          aria-label="关闭"
          tabIndex={-1}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
            <path
              d="M2 2l6 6M8 2L2 8"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </header>
  );
});
