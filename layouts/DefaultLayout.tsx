import { Component } from "react";
import { TopNav } from "../components/TopNav";
import { mainContent } from "../pages/_app.module.scss";
import Footer from "../components/Footer";
import Head from "next/head";
import { Router } from "next/router";
import { ImageModalProvider } from "@/components";

export interface Frontmatter {
    title?: string;
    created?: string;
    "last-updated"?: string;
    [key: string]: any;
}

export default function DefaultLayout({ children, title, frontmatter, router }: { children: React.ReactNode, title: string, frontmatter: Frontmatter, router: Router }) {
    return (<>
        <ImageModalProvider>
            <TopNav />

            {/* ✅ 3. Use the styles object */}
            <main className={mainContent}>
                {children}
            </main>
            <Footer created={frontmatter.created} date={frontmatter["last-updated"]} />
        </ImageModalProvider>
    </>)
}