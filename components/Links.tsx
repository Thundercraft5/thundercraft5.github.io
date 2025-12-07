import { plainlist } from './Links.module.scss'
import { DiscordLink } from './links/DiscordLink'
import { FandomLink } from './links/FandomLink'
import { GithubLink } from './links/GithubLink'
import { LichessLink } from './links/LichessLink'
import { NpmLink } from './links/NpmLink'
import { StackOverflowLink } from './links/StackOverflowLink'
import { WikipediaLink } from './links/WikipediaLink'

export default function Links() {
    return <ul className={plainlist}>
        <li><GithubLink /></li>
        <li><NpmLink /></li>
        <li><StackOverflowLink /></li>
        {/* <li><DiscordLink /></li> */}
        <li><WikipediaLink /></li>
        <li><FandomLink /></li>
        <li><LichessLink /></li>
    </ul>
}