"use client";
import React, { useEffect, useState } from 'react';
import { hashHeader, hashLink } from './mdx-components.module.scss'
import { Enumerate, type Add, type Increment } from "@thundercraft5/type-utils/numbers"
import type { BuildTuple } from '@thundercraft5/type-utils/arrays';
import { graphData } from '../src/data';
import Image from 'next/image';


console.log('hashHeader:', hashHeader);
console.log('hashLink:', hashLink);

type HeaderLevel = `h${Exclude<Enumerate<7>, 0>}`;

type HeaderComponentProps = React.ComponentProps<HeaderLevel>

function headerComponent(Level: HeaderLevel) {
    return function Header(props: { children: React.ReactNode, id?: string, className?: string }) {
        const [mounted, setMounted] = useState(false);
        console.warn("Test")
        useEffect(() => {
            setMounted(true);
        }, []);

        // 1. THE SERVER/FIRST-RENDER PASS
        // This MUST be as simple as possible to match the raw HTML
        if (!mounted) {
            return (
                <Level
                    id={props.id}
                    className={props.className}
                >
                    {props.children}
                </Level>
            );
        }


        const id = props.id;

        // 2. THE CLIENT PASS (After hydration)
        // Now we can safely add our custom IDs, Links, and Classes
        const finalClassName = [props.className, hashHeader].filter(Boolean).join(' ');

        console.log(id, Level)
        if (id) {
            return (
                <Level id={id} className={finalClassName}>
                    <a className={hashLink} href={`#${id} `}>
                        {props.children}
                    </a>
                </Level>
            );
        }

        return <Level {...props}>{props.children}</Level>;
    }
}

export function useMDXComponents(components: Record<string, React.ComponentType<{ children?: React.ReactNode }>>) {
    return {
        ...components,
        a: (props: React.ComponentProps<'a'>) => {
            const [mounted, setMounted] = useState(false);
            const isInternalLink = props.href && (props.href.startsWith('/') || props.href.startsWith('#'));

            useEffect(() => {
                setMounted(true);
            }, []);

            return <a
                {...props}
            // className={[props.className, isInternalLink ? 'internal-link' : 'external-link'].filter(Boolean).join(' ')}
            >
                {!isInternalLink && mounted ? <Image width={16} height={16} src={graphData.nodes.filter(node => node.external).find(node => node.id === props.href)?.icon} /> : ""}
                {props.children}
            </a>;
        },
        ...Object.fromEntries(
            Array(6)
                .fill(null)
                .map((_, i) => `h${i + 1}`)
                .map((level) => [level, headerComponent(level as HeaderLevel)])
        ),
    } satisfies Record<string, React.ComponentType<{ children?: React.ReactNode, [key: string]: any }>>;
}