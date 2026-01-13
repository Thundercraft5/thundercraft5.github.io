import { useState, useEffect, useMemo } from "react";
import { graphData } from "../src/data";
import Image from "next/image";
import { iconizedLink } from "./IconizedLink.module.scss";

export default function IconizedLink(props: React.ComponentProps<'a'>) {
    const [mounted, setMounted] = useState(false);
    const isInternalLink = props.href && (props.href.startsWith('/') || props.href.startsWith('#'));

    useEffect(() => {
        setMounted(true);
    }, []);

    const found = useMemo(() => graphData.nodes.filter(node => node.external).find(node => node.id === props.href), [props.href]);

    console.log(found);

    return <a
        {...props}
        className={`${iconizedLink}${props.className ? ' ' + props.className : ''}`}
        title={mounted ? found?.name : ""}
    // className={[props.className, isInternalLink ? 'internal-link' : 'external-link'].filter(Boolean).join(' ')}
    >
        {!isInternalLink && mounted ? <Image width={16} height={16} src={found?.icon} /> : ""}
        {props.children}
    </a>;
}