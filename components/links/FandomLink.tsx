import React from 'react'
import { FandomIcon } from '../icons'
import { lightLink, bold } from '../TopNav.module.scss'
import { links } from '../../pages/data'

export function FandomLink({ className = `${bold} ${lightLink}`, url = links.fandom }: { className?: string, url?: string }) {
    return (
        <a href={url} className={className} target="_blank" rel="noopener noreferrer">
            <span className="flex-center"><FandomIcon size={16} />&nbsp;FANDOM (retired, 2019-2022)</span>
        </a>
    )
}
