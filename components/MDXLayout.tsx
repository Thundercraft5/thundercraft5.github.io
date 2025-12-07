import React from 'react';
import Head from 'next/head';

export default function MDXLayout({
    children,
    frontmatter
}: {
    children: React.ReactNode;
    frontmatter?: { title?: string;[key: string]: any };
}) {
    console.warn("Testing MDXLayout frontmatter:", frontmatter);
    return (
        <>
            <Head>
                <title>{frontmatter?.title || 'Thundercraft5'}</title>
            </Head>
            {children}
        </>
    );
}

console.warn("Testing MDXLayout module loaded");