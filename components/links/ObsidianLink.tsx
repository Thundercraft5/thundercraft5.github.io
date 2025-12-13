import React from 'react'
import { NpmIcon, ObsidianIcon } from '../icons'
import { lightLink, bold } from '../TopNav.module.scss'
import { links } from '../../src/data';

export function ObsidianLink({ className = `${bold} ${lightLink}` }: { className?: string }) {
    return (
        <a href={links.obsidian} className={className} target="_blank" rel="noopener noreferrer">
            <span className="flex-center"><ObsidianIcon size={16} />&nbsp;Obsidian</span>
        </a>
    )
}
