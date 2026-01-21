import { useState, useEffect, useMemo } from "react";
import { graphData } from "../src/data";
import styles from "./IconizedLink.module.scss"; // Import as 'styles' for better safety

export default function IconizedLink({
    titled,
    className,
    children,
    href,
    ...props
}: React.ComponentProps<'a'> & { titled?: boolean }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isInternalLink = href && (href.startsWith('/') || href.startsWith('#'));

    const found = useMemo(() => {
        if (!href) return undefined;
        return graphData.nodes.find(node => node.id === href);
    }, [href]);

    // Construct class names safely to avoid 'null' vs 'undefined' mismatches
    const combinedClassName = [
        styles.iconizedLink, // The class from your SCSS module
        className,           // Any classes passed down from MDX or parent
        isInternalLink ? styles.internal : styles.external
    ].filter(Boolean).join(' ');

    const resolvedTitle = props.title || (mounted ? (found?.toTitle || found?.name || found?.title) : "") || "";

    // FALLBACK ICON logic
    const iconSrc = found?.icon || (href && !isInternalLink
        ? `https://www.google.com/s2/favicons?domain=${new URL(href).hostname}&sz=16`
        : undefined);

    return (
        <a
            className={combinedClassName}
            href={href}
            {...props}
            title={resolvedTitle}
            // Add this to prevent React from screaming about minor icon mismatches
            suppressHydrationWarning={true}
        >
            {/* 
               Only render the icon if mounted to prevent SSR mismatch.
               standard <img> is safer than Next.js <Image> for tiny icons.
            */}
            {mounted && !isInternalLink && iconSrc ? (
                <img
                    src={iconSrc}
                    alt=""
                    width={16}
                    height={16}
                    className={styles.linkIcon}
                    style={{ marginRight: '6px', verticalAlign: 'middle' }}
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                />
            ) : null}


            {titled ? (found?.toTitle || found?.name || children) : children}

        </a>
    );
}