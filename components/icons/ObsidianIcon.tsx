import React from 'react'

type Props = {
    size?: number
    className?: string
    alt?: string
}

export default function ObsidianIcon({ size = 16, className, alt = 'Obsidian' }: Props) {
    const width = size
    const height = size
    return <img className={className} src="/icons/2023_Obsidian_logo.svg" alt={alt} width={width} height={height} />
}
