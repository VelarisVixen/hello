import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
  message?: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(error: any): State {
    return { hasError: true, message: error?.message || "Render error" };
  }
  componentDidCatch(error: any, info: any) {
    console.error("UI error:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[40vh] container py-16">
          <h1 className="text-2xl font-semibold mb-2">Something went wrong</h1>
          <p className="text-foreground/70">{this.state.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}
