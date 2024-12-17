"use client"

import { Component, ReactNode } from "react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    render(): ReactNode {
        if (this.state.hasError) {
            return (
                <div className="p-4 bg-red-500 text-white text-center">
                    <h1>Something went wrong.</h1>
                    <p>Please refresh the page or contact support.</p>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
