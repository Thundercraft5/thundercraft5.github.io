import { Component } from "react";
import { TopNav } from "../components/TopNav";
import { mainContent } from "../pages/_app.module.scss";
import Footer from "../components/Footer";
import Head from "next/head";

export interface Frontmatter {
    title?: string;
    created?: string;
    "last-updated"?: string;
    [key: string]: any;
}

export default function DefaultLayout({ children, title, frontmatter }: { children: React.ReactNode, title: string, frontmatter: Frontmatter }) {
    return (<>
        <Head>
            <link rel="icon" href="/favicon.ico" type="image/x-icon" />
            {/* ✅ Next.js automatically injects the compiled CSS here. Do not add <link rel="stylesheet"> manually. */}
            <title>{title}</title>
            <meta name="google-site-verification" content="6uW4e_9-NPFLASD-TLV4cjbbNOb9lptKjdJB8ibxsmg" />
        </Head>
        <TopNav />

        {/* ✅ 3. Use the styles object */}
        <main className={mainContent}>
            {children}
        </main>
        <Footer created={frontmatter.created} date={frontmatter["last-updated"]} />
    </>)
}