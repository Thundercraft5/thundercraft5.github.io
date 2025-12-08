import { copyrightNotice, copyrightImage } from './CopyrightNotice.module.scss'
import { blueLink, lightLink } from './TopNav.module.scss'

export default function CopyrightNotice() {
    return <div id="copyright-notice" className={copyrightNotice}>
        <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/" className={`${copyrightImage} ${blueLink}`}>
            <img alt="Creative Commons License" src="https://licensebuttons.net/l/by-sa/4.0/88x31.png" />
        </a>
        All content on this page unless otherwise noted is released under the <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/" className={blueLink}>CC-BY-SA 4.0</a> license, meaning as long as you attribute this site with a proper link and re-distribute it under the same license, you are free to use this content in any way.

        <br />The license for the code in this site is located <a href="https://github.com/Thundercraft5/thundercraft5.github.io/blob/main/LICENSE" className={blueLink}>here</a>.
    </div>
}