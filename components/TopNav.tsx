import { headerTextContainer, topnavWrapper, topnav, headerText, logo, topNavMenu, noarrow, headerImage, codeList, topNavMenuSecondLevel, topNavMenuDropdown, blackLink, navMenu } from './TopNav.module.scss';
import { packages, projects } from '../src/data';
import { getIcon } from './getIcon';
import type { JSX } from 'react';
import { TopNavError } from '../src/util/errors';

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
                        <span><a className={blackLink} href="/projects">Projects</a></span>
                        <ul className={topNavMenuDropdown}>{
                            Object.entries(projects).map(([group, members]) => {
                                let dropdown: JSX.Element;

                                switch (group) {
                                    case "Local":
                                        dropdown = members[1].map(project => <li key={project}>{getIcon(group, { size: 16 })}<a className={blackLink} href={`/projects/${project}`}>{project}</a></li>);
                                        break;
                                    case "GitHub":
                                        dropdown = members[1].map(project => <li key={project}>{getIcon(group, { size: 16 })}<a className={blackLink} href={`${members[0]}/{${project}`}>{project}</a></li>);

                                        break;
                                    default: throw new TopNavError("INVALID_GROUP", group);
                                }

                                return <li>{getIcon(group, { size: 16 })}<a href={members[0]}>{group}</a>
                                    <ul className={`${topNavMenuSecondLevel} ${topNavMenuDropdown} ${codeList}`}>{
                                        dropdown
                                    }</ul></li>
                            })
                        }</ul>
                    </div>
                    <div className={topNavMenu}>
                        <span><a className={blackLink} href="/packages">Packages</a></span>

                        <ul className={`${topNavMenuDropdown} ${codeList}`}>{
                            Object.keys(packages).map(pkg => <li key={pkg}>{getIcon(packages[pkg][0], { size: 16 })}<a className={blackLink} href={packages[pkg][1]}>{pkg}</a></li>)
                        }</ul>
                    </div>
                    <div className={topNavMenu}>
                        <span><a className={blackLink} href="/work">Work</a></span>
                    </div>
                    <div className={`${topNavMenu} ${noarrow}`}>
                        <span><a className={blackLink} href="/farming">Farming</a></span>
                    </div>
                    <div className={`${topNavMenu} ${noarrow}`}>
                        <span><a className={blackLink} href="/about">About</a></span>
                    </div>
                    <div className={`${topNavMenu} ${noarrow}`}>
                        <span><a className={blackLink} href="/philosophy">Philosophy</a></span>
                    </div>

                    <div className={`${topNavMenu} ${noarrow}`}>
                        <span><a className={blackLink} href="/blog">Blog</a></span>
                    </div>
                </div>
            </nav >
        </div>
    );
}