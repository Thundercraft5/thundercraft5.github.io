import React from 'react'
import { WikipediaIcon } from '../icons'
import { lightLink, bold } from '../TopNav.module.scss'
import { links } from '../../pages/data'

export function WikipediaLink({ className = `${bold} ${lightLink}`, url = links.wikipedia }: { className?: string, url?: string }) {
    return (
        <a href={url} className={className} target="_blank" rel="noopener noreferrer">
            <span className="flex-center"><WikipediaIcon size={16} />&nbsp;Wikipedia</span>
        </a>
    )
}
