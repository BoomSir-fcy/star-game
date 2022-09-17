import React, { SuspenseProps } from 'react';
interface State {
    hasError: boolean;
}
declare class SuspenseWithChunkError extends React.Component<SuspenseProps, State> {
    constructor(props: any);
    static getDerivedStateFromError(): {
        hasError: boolean;
    };
    componentDidCatch(error: any): void;
    render(): React.ReactNode;
}
export default SuspenseWithChunkError;
