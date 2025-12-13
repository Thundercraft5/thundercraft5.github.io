import { Component } from "react";
import { TopNav } from "../components/TopNav";
import { mainContent } from "../pages/_app.module.scss";
import Footer from "../components/Footer";
import Head from "next/head";
import { Router, useRouter } from "next/router";
import { ImageModalProvider } from "@/components";
import BreadCrumbs from "../components/Breadcrumbs";

export interface Frontmatter {
    title?: string;
    created?: string;
    "last-updated"?: string;
    [key: string]: any;
}

export default function DefaultLayout({ children, title, frontmatter }: { children: React.ReactNode, title: string, frontmatter: Frontmatter }) {
    const router = useRouter();
    return (<>
        <ImageModalProvider>
            <TopNav />

            {/* ✅ 3. Use the styles object */}
            <main className={mainContent}>
                {router.pathname === "/" ? "" : <BreadCrumbs />}
                {children}
            </main>
            <Footer created={frontmatter.created} date={frontmatter["last-updated"]} />
        </ImageModalProvider>
    </>)
}