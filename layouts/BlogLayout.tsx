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
import { ImageModalProvider } from "../components";
import BreadCrumbs from "../components/Breadcrumbs";
import MDXImage from "../components/MDXImage";
import Sidebar from "../components/sidebar/Sidebar";

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

                <main className={styles.mainContent}>
                    {/* Inject Global Blog Header if needed */}
                    <div className={styles.mainContentContainer}>
                        <BreadCrumbs router={router} />

                        {router.pathname === '/blog' ? null : (<>
                            <div className={styles.returnLink}></div>
                            <div className="post-header">
                                <div className={styles.postImage}>
                                    <span><MDXImage loading="eager" src={frontmatter?.image?.path || ''} alt={frontmatter?.image?.caption || 'Blog Post Image'} width={frontmatter?.image?.width || 800} height={frontmatter?.image?.height || 400} /></span>
                                </div>
                                <h1>{frontmatter?.title}</h1>
                                <small><i>{frontmatter?.created ? 'Created - ' + new Date(frontmatter.created).toLocaleDateString() : ''}</i>{
                                    frontmatter?.['last-updated'] ? <b> | </b> : ""
                                }<i>{
                                    frontmatter?.['last-updated'] ? `Edited - ` : ""
                                }{
                                            new Date(frontmatter['last-updated']).toLocaleDateString()
                                        }</i></small>
                                <hr />
                            </div>
                        </>)}
                        {children}
                    </div>
                    <Sidebar />
                </main>
            </div>

            <Footer
                date={new Date(frontmatter?.['last-updated']!).toLocaleDateString()}
                created={new Date(frontmatter?.['created']!).toLocaleDateString()}
            />
        </ImageModalProvider>
    );
}