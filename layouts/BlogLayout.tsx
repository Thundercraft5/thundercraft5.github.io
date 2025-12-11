import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { TopNav } from "../components/TopNav";
import Footer from "../components/Footer";
import { PageError } from "../src/util/errors";

// You can create a specific SCSS module for blog styles
// import styles from "./BlogLayout.module.scss"; 
// OR reuse the app module if you just want to change logic
import styles from "../pages/_app.module.scss";
import { Frontmatter } from "./DefaultLayout";
import { ImageModalProvider } from "../components/ImageModal/ImageModalProvider";

interface BlogLayoutProps {
    children: React.ReactNode;
    frontmatter?: Frontmatter;
    title: string;
}

export default function BlogLayout({ children, frontmatter }: BlogLayoutProps) {
    const router = useRouter();

    // 1. Specific Validation for Blog Posts
    // Maybe blog posts MUST have an author?
    if (!frontmatter) {
        console.warn(`[BlogLayout] Missing frontmatter for ${router.asPath}`);
    } else if (!frontmatter.title) {
        // Blog specific error
        throw new PageError("BLOG_MISSING_TITLE", router.asPath);
    }

    const pageTitle = frontmatter?.title
        ? `${frontmatter.title} | Thundercraft5 Blog`
        : 'Blog';

    return (
        <ImageModalProvider>
            <Head>
                <meta property="og:image" content={frontmatter?.image?.path || ''} />
            </Head>
            <TopNav />


            {/* A distinctive wrapper for blog content */}
            <div className={styles.blogContainer}>
                {/* Maybe add a Sidebar here? */}
                <aside style={{ display: 'none' }}>Sidebar</aside>

                <main className={styles.mainContent}>
                    {/* Inject Global Blog Header if needed */}
                    {router.pathname === '/blog' ? null : (<>
                        <div className={styles.returnLink}></div>
                        <div className="post-header">
                            <h1>{frontmatter?.title}</h1>
                            <small>{frontmatter?.created ? 'Created - ' + new Date(frontmatter.created).toLocaleDateString() : ''}{
                                frontmatter?.['last-updated'] ? ' | Edited - ' + new Date(frontmatter['last-updated']).toLocaleDateString() : ''
                            }</small>
                        </div>
                    </>)}
                    {children}
                </main>
            </div>

            <Footer
                date={frontmatter?.['last-updated']}
                created={frontmatter?.['created']}
            />
        </ImageModalProvider>
    );
}