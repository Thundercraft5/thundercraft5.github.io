import React from 'react'
import { StackOverflowIcon } from '../icons'

export function StackOverflowLink({ className = 'bold lightLink' }: { className?: string }) {
    return (
        <a href="https://stackoverflow.com/users/16423247/thundercraft5" className={className} target="_blank" rel="noopener noreferrer">
            <span className="flex-center"><StackOverflowIcon size={16} />&nbsp;Stack Overflow</span>
        </a>
    )
}
