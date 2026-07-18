import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Catches rendering errors anywhere in the child tree and shows a fallback UI
 * instead of a white screen.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            gap: '1rem',
            padding: '2rem',
            textAlign: 'center',
            background: 'var(--canvas, #060908)',
            color: 'var(--ink, #f3f6f4)',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>
            应用遇到了错误
          </p>
          <p
            style={{
              fontSize: '0.85rem',
              color: 'var(--mute, #7d8a83)',
              maxWidth: '28rem',
              wordBreak: 'break-all',
            }}
          >
            {this.state.error?.message ?? '未知错误'}
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            style={{
              marginTop: '0.5rem',
              padding: '0.5rem 1.5rem',
              borderRadius: '0.5rem',
              border: '1px solid var(--green, #5fad7a)',
              background: 'transparent',
              color: 'var(--green, #5fad7a)',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            重新加载
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
