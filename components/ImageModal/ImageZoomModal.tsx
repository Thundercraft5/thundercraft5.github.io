import { useState } from "react";
import styles from "./ImageZoomModal.module.scss";
import { useEscapeEffect } from "../hooks/useEscapeEffect";
import Image from "next/image";
import shareUrl from "../../src/util/shareUrl";


export const ImageZoomModal = ({ src, alt, onClose }: { src: string; alt: string; onClose?: () => void }) => {
    const [scale, setScale] = useState(1);

    useEscapeEffect(() => onClose?.());


    const handleZoomIn = (e: React.MouseEvent) => { e.stopPropagation(); setScale(s => s + 0.2); };
    const handleZoomOut = (e: React.MouseEvent) => { e.stopPropagation(); setScale(s => Math.max(1, s - 0.2)); };
    return (<div className={styles.modalOverlay} onClick={e => { onClose?.(); }}>
        <div className={styles.modalContent} onClick={e => onClose?.()}>
            <div className={styles.imageCaption}>{alt}</div>
            <img src={src} alt={alt} className={styles.image} style={{ transform: `scale(${scale})` }} onClick={e => e.stopPropagation()} />
            <div className={styles.modalControls}>
                <button onClick={onClose}>Close</button>
                <button onClick={() => shareUrl(alt, src)}>Share</button>
            </div>
        </div>
    </div>);
}