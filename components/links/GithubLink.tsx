import React from 'react'
import { GithubIcon } from '../icons'

export function GithubLink({ className = 'bold lightLink' }: { className?: string }) {
    return (
        <a href="https://github.com/Thundercraft5" className={className} target="_blank" rel="noopener noreferrer">
            <span className="flex-center"><GithubIcon size={16} />&nbsp;Github</span>
        </a>
    )
}
