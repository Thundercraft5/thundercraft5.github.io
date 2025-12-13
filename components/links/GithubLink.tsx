import React from 'react'
import { GithubIcon } from '../icons'
import { lightLink, bold } from '../TopNav.module.scss'
import { links } from '../../src/data';

export function GithubLink({ className = `${bold} ${lightLink}`, url = links.github }: { className?: string, url?: string }) {
    return (
        <a href={url} className={className} target="_blank" rel="noopener noreferrer">
            <span className="flex-center"><GithubIcon size={16} />&nbsp;Github</span>
        </a>
    )
}
