import { Component } from 'react';

export class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed)
      return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-canvas p-6 text-center">
          <h1 className="text-2xl font-semibold">This view needs a fresh start.</h1>
          <p className="mt-3 text-sm text-muted">
            Reload the workspace, then import your CSV again.
          </p>
          <button className="button button-primary mt-6" onClick={() => window.location.reload()}>
            Reload workspace
          </button>
        </main>
      );
    return this.props.children;
  }
}
