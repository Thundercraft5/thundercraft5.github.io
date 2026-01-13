import Image from "next/image";
import { smallText, enlarged, image, imageContainer } from "./MDXImage.module.scss";
import { useEffect } from "react";
import { useImageModal } from "./ImageModal/ImageModalProvider.tsx";
export type Props = {
    src: string;
    alt: string;
    width?: number;
    height?: number;
} & React.ComponentProps<typeof Image>;


export default function MDXImage({ ...props }: Props) {
    const { showModal } = useImageModal();

    return <>
        <div className={imageContainer} onClick={e => showModal(props.src, props.alt)}>
            <Image className={image} {...props} />
        </div>
        <small className={smallText}>{props.alt}</small>
    </>;
}