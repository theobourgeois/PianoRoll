import React, { FC, useRef, useEffect } from "react";

interface RangeSliderProps {
    min: number;
    max: number;
    step: number;
    value: number;
    onChange?: (value: number) => void;
}

function roundToStep(number: number, step: number) {
    return Math.round(number / step) * step;
}
let mouseDown = false;
const RangeSlider: FC<RangeSliderProps> = (props) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const knobRef = useRef<HTMLDivElement>(null);

    function handleMouseDown() {
        mouseDown = true;
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    }

    function handleMouseUp() {
        mouseDown = false;
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
    }

    function handleMouseMove(e: React.MouseEvent | MouseEvent) {
        if (!mouseDown && e.type === "mousemove") return;
        if (!containerRef.current) return;
        const knobWidth = 12;
        const targetRect = containerRef.current.getBoundingClientRect();
        const width = targetRect.width - knobWidth;
        let x: number = e.clientX - targetRect.left;

        // Clamp x value within the bounds
        x = Math.max(0, Math.min(x, width));

        if (!knobRef.current) return;
        knobRef.current.style.left = x + "px";
        const ratio = x / width;
        let value = roundToStep(ratio * props.max, props.step);
        if (value == 0 && props.min > 0) value = 1;
        if (!props.onChange) return;
        props.onChange(value);
    }

    useEffect(() => {
        if (!containerRef.current || !knobRef.current) return;
        const x =
            (containerRef.current.getBoundingClientRect().width / props.max) *
            props.value;
        knobRef.current.style.left = x + "px";
    }, [props.value]);

    return (
        <div
            ref={containerRef}
            onClick={handleMouseMove}
            onMouseDown={handleMouseDown}
            className="w-full h-full flex justify-center items-center flex-col relative"
        >
            <div
                ref={knobRef}
                className="cursor-pointer absolute w-3 h-5 outline outline-gray-400 rounded-sm bg-white"
            ></div>
            <div className="h-2 w-full bg-gray-300 rounded-sm"></div>
        </div>
    );
};

export default RangeSlider;
