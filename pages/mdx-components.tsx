"use client";
import { useEffect, useState } from 'react';
import { hashHeader, hashLink } from './mdx-components.module.scss'

console.log('hashHeader:', hashHeader);
console.log('hashLink:', hashLink);

export function useMDXComponents(components: Record<string, React.ComponentType<{ children?: React.ReactNode }>>) {
    return {
        h3: ({ ...props }: any) => {
            const [mounted, setMounted] = useState(false);

            useEffect(() => {
                setMounted(true);
            }, []);

            // 1. THE SERVER/FIRST-RENDER PASS
            // This MUST be as simple as possible to match the raw HTML
            if (!mounted) {
                return (
                    <h3
                        id={props.id}
                        className={props.className}
                    >
                        {props.children}
                    </h3>
                );
            }

            const id = props.id;

            // 2. THE CLIENT PASS (After hydration)
            // Now we can safely add our custom IDs, Links, and Classes
            const finalClassName = [props.className, hashHeader].filter(Boolean).join(' ');

            if (id) {
                return (
                    <h3 id={id} className={finalClassName}>
                        <a className={hashLink} href={`#${id}`}>
                            {props.children}
                        </a>
                    </h3>
                );
            }

            return <h3 {...props}>{props.children}</h3>;

        }
    } satisfies Record<string, React.ComponentType<{ children?: React.ReactNode, [key: string]: any }>>;
}