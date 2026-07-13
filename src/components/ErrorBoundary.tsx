import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public props: Props;
  public state: State;

  constructor(props: Props) {
    super(props);
    this.props = props;
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught React error caught by boundary:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '40px', 
          fontFamily: 'sans-serif', 
          background: '#F7F4EC', 
          color: '#12213A', 
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '24px', marginBottom: '16px', fontWeight: 'bold' }}>Application Error Captured</h1>
          <p style={{ marginBottom: '20px', color: '#3B4B63', maxWidth: '500px' }}>
            A client-side runtime error has occurred. You can reset your cached settings to restore the default professional view.
          </p>
          <pre style={{ 
            background: '#EFEADC', 
            padding: '20px', 
            borderRadius: '4px', 
            overflowX: 'auto', 
            maxWidth: '90%',
            textAlign: 'left',
            fontSize: '13px',
            fontFamily: 'monospace',
            border: '1px solid rgba(18, 33, 58, 0.12)'
          }}>
            {this.state.error?.toString()}
            {"\n"}
            {this.state.error?.stack}
          </pre>
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button 
              onClick={() => {
                localStorage.removeItem('rahul_goyal_personal_info');
                localStorage.removeItem('rahul_goyal_projects');
                window.location.reload();
              }}
              style={{ 
                padding: '12px 24px', 
                background: '#A9803F', 
                color: '#F7F4EC', 
                border: 'none', 
                borderRadius: '2px', 
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Reset to Defaults & Reload
            </button>
            <button 
              onClick={() => {
                window.location.reload();
              }}
              style={{ 
                padding: '12px 24px', 
                background: '#12213A', 
                color: '#F7F4EC', 
                border: 'none', 
                borderRadius: '2px', 
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Just Retry Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
