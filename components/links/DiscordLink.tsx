import React from 'react'
import { DiscordIcon } from '../icons'
import { bold } from 'colors'
import { links } from '../../pages/data'
import { lightLink } from '../TopNav.module.scss'

export function DiscordLink({ className = `${bold} ${lightLink}`, url = links.discord }: { className?: string, url?: string }) {
    return (
        <a href={url} className={className} target="_blank" rel="noopener noreferrer">
            <span className="flex-center"><DiscordIcon size={16} />&nbsp;Discord</span>
        </a>
    )
}
