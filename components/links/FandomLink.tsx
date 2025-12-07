import React from 'react'
import { FandomIcon } from '../icons'

export function FandomLink({ className = 'bold lightLink' }: { className?: string }) {
    return (
        <a href="https://community.fandom.com/wiki/User:Thundercraft5" className={className} target="_blank" rel="noopener noreferrer">
            <span className="flex-center"><FandomIcon size={16} />&nbsp;FANDOM (retired, 2019-2022)</span>
        </a>
    )
}
