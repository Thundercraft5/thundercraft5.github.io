import React from 'react'
import { StackOverflowIcon } from '../icons'
import { lightLink, bold } from '../TopNav.module.scss'
import { links } from '../../pages/data'

export function StackOverflowLink({ className = `${bold} ${lightLink}`, url = links.stackoverflow }: { className?: string, url?: string }) {
    return (
        <a href={url} className={className} target="_blank" rel="noopener noreferrer">
            <span className="flex-center"><StackOverflowIcon size={16} />&nbsp;Stack Overflow</span>
        </a>
    )
}
