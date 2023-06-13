import { useEffect, useRef } from "react";
export const useMouseDown = (code: number) => {
    const mouseDown = useRef(false);

    useEffect(() => {
        const handleMouseDown = (e: MouseEvent) => {
            if (e.button === code) {
                mouseDown.current = true;
            }
        };

        const handleMouseUp = (e: MouseEvent) => {
            if (e.button === code) {
                mouseDown.current = false;
            }
        };

        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [code]);

    return () => mouseDown.current;
};