import React from 'react'
import { NpmIcon } from '../icons'

export function NpmLink({ className = 'bold lightLink' }: { className?: string }) {
    return (
        <a href="https://www.npmjs.com/~thundercraft5" className={className} target="_blank" rel="noopener noreferrer">
            <span className="flex-center"><NpmIcon size={16} />&nbsp;NPM</span>
        </a>
    )
}
