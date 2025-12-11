import { createContext, useCallback, useContext, useState } from "react";
import { ComponentError } from "../../src/util/errors";
import { ImageZoomModal } from "./ImageZoomModal";

export type ModalContextType = {
    showModal: (imageSrc: string, altText?: string) => void;
    hideModal: () => void;
}

export type ModalState = {
    src: string;
    alt: string;
    closed: boolean;
}

const ModalContext = createContext<ModalContextType>({
    showModal() { throw new ComponentError("CALLBACK_NOT_IMPLEMENTED", "show") },
    hideModal() { throw new ComponentError("CALLBACK_NOT_IMPLEMENTED", "hide") },
});

export function ImageModalProvider({ children }: { children: React.ReactNode }) {
    const [modalProps, setModalProps] = useState<ModalState | null>(null);

    // The function you call from your components
    const showModal = useCallback((src, alt = "Zoomed Image") => {
        console.log("Showing modal for", src, alt);
        setModalProps({ src, alt, closed: false });
    }, []);

    console.warn("Modal Props:", modalProps);

    const hideModal = useCallback(() => {
        setModalProps(null);
    }, []);


    return (
        <ModalContext.Provider value={{ showModal, hideModal }}>
            {children}
            {modalProps && (
                <ImageZoomModal
                    src={modalProps.src}
                    alt={modalProps.alt}
                    onClose={hideModal}
                />
            )}
        </ModalContext.Provider>
    );
}

export const useImageModal = () => useContext(ModalContext);
