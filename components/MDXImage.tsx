import Image from "next/image";
import { smallText, enlarged, image } from "./MDXImage.module.scss";
export type Props = {
    src: string;
    alt: string;
    width?: number;
    height?: number;
}


export default function MDXImage({ ...props }: Props) {
    return <>
        <div onClick={e => {
            e.currentTarget.classList.toggle(enlarged);
        }}><Image {...props} className={image} onClick={e => {
            e.currentTarget.height = e.currentTarget.height === props.height ? props.height! * 2 : props.height!;
            e.currentTarget.width = e.currentTarget.width === props.width ? props.width! * 2 : props.width!;

        }} /></div>
        <small className={smallText}>{props.alt}</small>
    </>;
}