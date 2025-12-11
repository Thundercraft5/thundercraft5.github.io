import { useEffect } from "react";

interface UseCloseMenuOnEscapeArgs {
    isMenuOpen: boolean;
    toggleMenu: () => void;
}

export function useEscapeEffect(callback: () => void) {
    useEffect(() => {
        function keyDownHandler(e: globalThis.KeyboardEvent) {
            if (e.key === "Escape") {
                e.preventDefault();
                callback();
            }
        }

        document.addEventListener("keydown", keyDownHandler);

        return () => {
            document.removeEventListener("keydown", keyDownHandler);
        };
    })
}