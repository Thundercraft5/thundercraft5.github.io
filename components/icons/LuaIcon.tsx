import React from 'react'

type Props = {
    size?: number
    className?: string
    alt?: string
}

export default function LuaIcon({ size = 16, className, alt = 'Lua' }: Props) {
    const width = size
    const height = size
    return <img className={className} src="/icons/Lua-Logo.svg" alt={alt} width={width} height={height} />
}
