import React from 'react'
import { LichessIcon } from '../icons'

export function LichessLink({ className = 'bold lightLink' }: { className?: string }) {
    return (
        <a href="https://lichess.org/@/nkgplays" className={className} target="_blank" rel="noopener noreferrer">
            <span className="flex-center"><LichessIcon size={16} />&nbsp;Lichess</span>
        </a>
    )
}
