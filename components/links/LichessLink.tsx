import React from 'react'
import { LichessIcon } from '../icons'
import { lightLink, bold } from '../TopNav.module.scss'
import { links } from '../../src/data';

export function LichessLink({ className = `${bold} ${lightLink}`, url = links.lichess }: { className?: string, url?: string }) {
    return (
        <a href={url} className={className} target="_blank" rel="noopener noreferrer">
            <span className="flex-center"><LichessIcon size={16} />&nbsp;Lichess</span>
        </a>
    )
}
