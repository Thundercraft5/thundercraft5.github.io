import React from 'react'
import { WikipediaIcon } from '../icons'

export function WikipediaLink({ className = 'bold lightLink' }: { className?: string }) {
    return (
        <a href="https://wikipedia.org/wiki/User:Thundercraft5" className={className} target="_blank" rel="noopener noreferrer">
            <span className="flex-center"><WikipediaIcon size={16} />&nbsp;Wikipedia</span>
        </a>
    )
}
