import React from 'react'
import { DiscordIcon } from '../icons'

export function DiscordLink({ className = 'bold lightLink' }: { className?: string }) {
    return (
        <a href="https://www.npmjs.com/~thundercraft5" className={className} target="_blank" rel="noopener noreferrer">
            <span className="flex-center"><DiscordIcon size={16} />&nbsp;Discord</span>
        </a>
    )
}
