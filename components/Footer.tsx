import CopyrightNotice from "./CopyrightNotice";
import Links from "./Links";
import { footer, lastUpdated, flexRow, disclaimer } from './Footer.module.scss'
import { plainlist } from "./Links.module.scss";
import Tools from "./Tools";
import { LinksToHere, Outlinks } from "./PageLinks";

export default function Footer({ date, created }: { date?: string, created?: string }) {
    return <footer className={footer}>
        <ul className={plainlist}>
            {date && <li><span className={lastUpdated}>🖋 This page was last updated on <b>{date}</b></span></li>}
            {created && <li><span className={lastUpdated}>🖋 This page was created on <b>{created}</b></span></li>}
            <li><LinksToHere /></li>
            <li><Outlinks /></li>
            <li><div className={disclaimer}><i>All opinions expressed and work on this website are my own unless explicitly stated otherwise.</i></div></li>
            <li><CopyrightNotice /></li>
            <li className={flexRow}><Links /><Tools /></li>
        </ul>
    </footer>
}