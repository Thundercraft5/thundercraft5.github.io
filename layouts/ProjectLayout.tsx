import { Component } from "react";
import { TopNav } from "../components/TopNav";
import { mainContent } from "../pages/_app.module.scss";
import Footer from "../components/Footer";
import Head from "next/head";
import { Router } from "next/router";
import { ImageModalProvider } from "@/components";
import Breadcrumbs from "../components/Breadcrumbs";

export interface Frontmatter {
    title?: string;
    created?: string;
    "last-updated"?: string;
    [key: string]: any;
}

export default function DefaultLayout({ children, title, frontmatter, router, isIndex }: { children: React.ReactNode, title: string, frontmatter: Frontmatter, router: Router, isIndex?: boolean }) {
    return (<>
        <ImageModalProvider>
            <TopNav />

            {/* ✅ 3. Use the styles object */}
            <main className={mainContent}>
                <Breadcrumbs />
                <h1>{isIndex ? "Project - " : ""}{title}</h1>
                {children}
            </main>
            <Footer created={frontmatter.created} date={frontmatter["last-updated"]} />
        </ImageModalProvider>
    </>)
}