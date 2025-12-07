import CopyrightNotice from "./CopyrightNotice";
import Links from "./Links";
import { footer } from './Footer.module.scss'

export default function Footer() {
    return <footer className={footer}>
        <CopyrightNotice />
        <Links />
    </footer>
}