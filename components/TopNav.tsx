import { headerTextContainer, topnavWrapper, topnav, headerText, logo, topNavMenu, topNavMenuDropdown, blackLink, navMenu } from './TopNav.module.scss';

export function TopNav() {
    return (
        <div className={topnavWrapper}>
            <nav className={topnav}>
                <div className={logo}>
                    <a href="/">
                        <img src="/resources/images/Logo.png" width="40" height="40" />
                    </a>
                    <div className={headerTextContainer}>
                        <div className={headerText}><a href="/" className={blackLink}><code>thundercraft5.github.io</code></a></div>
                    </div>
                </div>
                <div className={navMenu}>
                    <div className={topNavMenu}>
                        <span><a className={blackLink} href="/projects/">Projects</a></span>
                        <ul className={topNavMenuDropdown}></ul>
                    </div>
                </div>
            </nav >
        </div>
    );
}