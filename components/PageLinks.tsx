import { useRouter } from "next/router";
import { graphData } from "../src/data";
import { whiteHeader, backlinksList, noBacklinks } from "./PageLinks.module.scss";

export type PageLink = {
    external: boolean;
    title: string;
    url: string;
}
export function LinksToHere() {
    const { route, pathname } = useRouter();
    const links = graphData.links.filter(link => link.target === route || (link.target + "/") === route)
    console.error(route, pathname, graphData.links)

    console.log(graphData.links.filter(link => link.target === route || (link.target + "/") === route))

    return (<>
        <h3 className={whiteHeader}>Backlinks</h3>
        <ul className={backlinksList}>
            {links.length ? links.map((link, index) => (
                <li key={index}>
                    <a href={link.source}>{link.title}</a>
                </li>
            )) : <div className={noBacklinks}>No backlinks found</div>}
        </ul>
    </>)
}