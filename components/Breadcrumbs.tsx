import { useRouter, type NextRouter, type Router } from "next/router";
import { resolve } from "styled-jsx/css";
import { resolvePathParts } from "../src";
import path from 'path';
import { routesManifest } from "../src/data";

export default function BreadCrumbs() {
    const router = useRouter();
    const pathParts = routesManifest[router.pathname as keyof typeof routesManifest].breadcrumbs

    return <nav aria-label="breadcrumb" style={{ margin: '16px 0' }}>
        {pathParts.map(([segment, title], index) => {

            return <><a key={segment} href={segment}>{title}</a>{(index + 1) === pathParts.length ? "" : " / "}</>
        })}
    </nav>;
}