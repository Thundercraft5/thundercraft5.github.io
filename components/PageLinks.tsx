import { useRouter } from "next/router";
import { graphData } from "../src/data";
import { whiteHeader, backlinksList, noBacklinks } from "./PageLinks.module.scss";
import IconizedLink from "./IconizedLink";

export type PageLink = {
    external: boolean;
    title: string;
    url: string;
}
export function LinksToHere() {
    const { route, pathname } = useRouter();
    const links = graphData.links.filter(link => link.target === route || (link.target + "/") === route)

    return (<>
        <h3 className={whiteHeader}>Backlinks</h3>
        <ul className={backlinksList}>
            {links.length ? links.map((link, index) => (
                <li key={index}>
                    <IconizedLink href={link.source} title={link.title}>{link.title}</IconizedLink>
                </li>
            )) : <div className={noBacklinks}>No backlinks found</div>}
        </ul>
    </>)
}

export function Outlinks() {
    const { route, pathname } = useRouter();
    const links = graphData.links.filter(link => link.source === route || (link.source + "/") === route)

    return (<>
        <h3 className={whiteHeader}>Outlinks</h3>
        <ul className={backlinksList}>
            {links.length ? links.map((link, index) => (
                <li key={index}>
                    <IconizedLink href={link.target} title={link.toTitle}>{link.toTitle}</IconizedLink>
                </li>
            )) : <div className={noBacklinks}>No outlinks found</div>}
        </ul>
    </>)
}

