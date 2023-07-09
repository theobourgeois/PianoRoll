import { useEffect, useState } from "react";
import { PIANO_WIDTH } from "../../utils/constants";

export const SCROLLBAR_SIZE = 24;

const scrollBarStyle = (horizontal: ScrollBarProps["horizontal"]) => {
    if (horizontal)
        return {
            width: "100%",
            height: SCROLLBAR_SIZE + "px",
            bottom: 0,
            left: PIANO_WIDTH + "px",
        };
    return {
        width: SCROLLBAR_SIZE + "px",
        height: "100%",
    };
};

const knobStyle = (
    horizontal: ScrollBarProps["horizontal"],
    distance: ScrollBarProps["distance"],
    knobSize: number
) => {
    if (horizontal)
        return {
            height: SCROLLBAR_SIZE + "px",
            left: distance + "px",
            width: knobSize + "px",
        };
    return {
        width: SCROLLBAR_SIZE + "px",
        height: SCROLLBAR_SIZE + "px",
        top: distance + "px",
    };
};

interface ScrollBarProps {
    horizontal?: boolean;
    distance: number;
    onChange?: (distance: number, rect: DOMRect) => void;
    knobSize: number;
}

export const ScrollBar = ({
    horizontal,
    onChange,
    distance,
    knobSize,
}: ScrollBarProps): JSX.Element => {
    const [mouseDown, setMouseDown] = useState<boolean>(false);
    const [scrollbarRect, setScrollbarRect] = useState<DOMRect | null>(null);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        setMouseDown(true);
        if (!horizontal) return;
        const { clientX } = e;
        const { left } = e.currentTarget.getBoundingClientRect();
        setScrollbarRect(e.currentTarget.getBoundingClientRect());
        const distance = clientX - left;
        if (onChange)
            onChange(distance, e.currentTarget.getBoundingClientRect());
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!horizontal || !mouseDown) return;
        const { clientX } = e;
        const { left } = scrollbarRect as DOMRect;
        const distance = clientX - left;
        if (onChange) onChange(distance, scrollbarRect as DOMRect);
    };

    const handleMouseUp = () => {
        setMouseDown(false);
    };

    useEffect(() => {
        if (mouseDown) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        } else {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [mouseDown]);

    return (
        <div
            onMouseDown={handleMouseDown}
            style={scrollBarStyle(horizontal)}
            className="absolute rounded-md bg-slate-300 dark:bg-slate-700 z-[99]"
        >
            <div className="relative">
                <div
                    style={knobStyle(horizontal, distance, knobSize)}
                    className="absolute bg-slate-400 dark:bg-slate-500"
                ></div>
            </div>
        </div>
    );
};
