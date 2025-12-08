import { headerTextContainer, topnavWrapper, topnav, headerText, logo, topNavMenu, noarrow, headerImage, codeList, topNavMenuDropdown, blackLink, navMenu } from './TopNav.module.scss';
import { packages, projects } from '../pages/data';
import { getIcon } from './getIcon';

export function TopNav() {
    return (
        <div className={topnavWrapper}>
            <nav className={topnav}>
                <div className={logo}>
                    <a href="/">
                        <img src="/resources/images/Logo.png" className={headerImage} />
                    </a>
                    <div className={headerTextContainer}>
                        <div className={headerText}><a href="/" className={blackLink}><code>thundercraft5.github.io</code></a></div>
                    </div>
                </div>
                <div className={navMenu}>
                    <div className={topNavMenu}>
                        <span><a className={blackLink} href="/projects/">Projects</a></span>
                        <ul className={topNavMenuDropdown}>{projects.map(project => <li key={project}><a className={blackLink} href={`/projects/${project}/`}>{project}</a></li>)}</ul>
                    </div>
                    <div className={topNavMenu}>
                        <span><a className={blackLink} href="/packages/">Packages</a></span>
                        <ul className={`${topNavMenuDropdown} ${codeList}`}>{
                            Object.keys(packages).map(pkg => <li key={pkg}>{getIcon(packages[pkg][0], { size: 16 })}<a className={blackLink} href={`/packages/${pkg}/`}>{pkg}</a></li>)
                        }</ul>
                    </div>
                    <div className={topNavMenu}>
                        <span><a className={blackLink} href="/work/">Work</a></span>
                    </div>
                    <div className={`${topNavMenu} ${noarrow}`}>
                        <span><a className={blackLink} href="/about">About</a></span>
                    </div>
                    <div className={`${topNavMenu} ${noarrow}`}>
                        <span><a className={blackLink} href="/philosophy">Philosophy</a></span>
                    </div>
                    <div className={`${topNavMenu} ${noarrow}`}>
                        <span><a className={blackLink} href="/farming">Farming</a></span>
                    </div>                    <div className={`${topNavMenu} ${noarrow}`}>
                        <span><a className={blackLink} href="/blog">Blog</a></span>
                    </div>
                </div>
            </nav >
        </div>
    );
}