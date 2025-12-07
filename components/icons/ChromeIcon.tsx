import React from 'react'

type Props = {
    size?: number
    className?: string
    alt?: string
}

export default function ChromeIcon({ size = 16, className, alt = 'Chrome' }: Props) {
    const width = size
    const height = size
    return <img className={className} src="/icons/Google_Chrome_icon_(February_2022).svg" alt={alt} width={width} height={height} />
}
