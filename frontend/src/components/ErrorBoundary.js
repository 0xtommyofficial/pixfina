import React from "react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // log the error
        console.log(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // render any custom fallback UI
            return (
                <React.Fragment>
                    <h1>Something went wrong.</h1>
                    <button onClick={() => window.location.reload()}>Go back</button>
                </React.Fragment>
            );
        }

        return this.props.children;
    }
}