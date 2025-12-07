import React from 'react'

type Props = {
    size?: number
    className?: string
    alt?: string
}

export default function TypescriptIcon({ size = 16, className, alt = 'TypeScript' }: Props) {
    const width = size
    const height = size
    return (
        // use a plain img to avoid Next image config in library code
        <img className={className} src="/icons/Typescript_logo_2020.svg" alt={alt} width={width} height={height} />
    )
}
