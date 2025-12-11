import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

/**
 * Wraps a component to ensure it only renders on the client.
 * Useful for components that depend on browser APIs, Workers, Canvas, etc.
 * Sitewide utility to suppress SSR for browser-only components.
 */
export function clientOnly<P extends object>(
    Component: ComponentType<P>,
    fallback?: ComponentType<P>,
): ComponentType<P> {
    return dynamic(() => Promise.resolve(Component), {
        ssr: false,
        loading: fallback,
    }) as ComponentType<P>;
}

export default clientOnly;
