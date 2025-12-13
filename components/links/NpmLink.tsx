import React from 'react'
import { NpmIcon } from '../icons'
import { lightLink, bold } from '../TopNav.module.scss'
import { links } from '../../src/data';

export function NpmLink({ className = `${bold} ${lightLink}`, url = links.npm }: { className?: string, url?: string }) {
    return (
        <a href={url} className={className} target="_blank" rel="noopener noreferrer">
            <span className="flex-center"><NpmIcon size={16} />&nbsp;NPM</span>
        </a>
    )
}
