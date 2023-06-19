import React, { useState, useRef, useEffect } from "react";
import ClickAwayListener from "react-click-away-listener";

interface DraggableNumInputProps {
    value: number;
    onChange: (value: number) => void;
    max?: number;
    min?: number;
}

export const DraggableNumInput = ({
    value,
    onChange,
    max = 100,
    min = 0,
}: DraggableNumInputProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const valueRef = useRef<number>(value);
    const draggableNumInputRef = useRef<HTMLDivElement>(null);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        valueRef.current = value;
    }, [value]);

    const handleMouseDown = (e: React.MouseEvent) => {
        const threshold = 5;
        let currThreshold = 0;
        let prevY = e.pageY;
        const handleMouseMove = (e: MouseEvent) => {
            let diff = prevY - e.pageY;
            console.log(diff);
            if (diff === 0) currThreshold++;
            else currThreshold = 0;
            if (currThreshold > threshold) diff = 1;
            const newValue = Math.max(
                Math.min(valueRef.current + diff, max),
                min
            );
            onChange(newValue);
            prevY = e.pageY;
        };

        const handleMouseUp = () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    };

    function handleEnter(e: React.KeyboardEvent<HTMLInputElement>) {
        if (inputRef.current && inputRef.current.value === "") onChange(min);
        if (e.key === "Enter") setEditing(false);
    }

    function handleDoubleClick() {
        setEditing(true);
    }

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = !isNaN(Number(e.target.value))
            ? parseInt(e.target.value)
            : "";
        if (value > max) return onChange(max);
        if (value < min) return onChange(min);
        onChange(Number(value));
    };

    useEffect(() => {
        if (editing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [editing]);

    useEffect(() => {
        if (draggableNumInputRef.current) {
            const deltaYThreshold = 30;
            const preventScroll = (e: WheelEvent) => {
                e.preventDefault();
                let threshold = 1;
                if (e.deltaY > deltaYThreshold || e.deltaY < -deltaYThreshold)
                    threshold = 5;
                let newValue =
                    -Math.sign(e.deltaY) * threshold + valueRef.current;
                newValue = Math.max(Math.min(newValue, max), min);
                onChange(newValue);
            };

            draggableNumInputRef.current.addEventListener(
                "wheel",
                preventScroll,
                {
                    passive: false,
                }
            );
            return () => {
                if (draggableNumInputRef.current)
                    draggableNumInputRef.current.removeEventListener(
                        "wheel",
                        preventScroll
                    );
            };
        }
    }, []);

    return (
        <ClickAwayListener onClickAway={() => setEditing(false)}>
            <div
                ref={draggableNumInputRef}
                onKeyDown={handleEnter}
                onMouseDown={handleMouseDown}
            >
                <div
                    style={{ display: editing ? "none" : "flex" }}
                    onDoubleClick={handleDoubleClick}
                    className="flex justify-center items-center w-12 select-none cursor-ns-resize border bg-slate-100 py-1 px-2 rounded-md"
                >
                    <p>{value}</p>
                </div>
                <input
                    ref={inputRef}
                    onClick={handleDoubleClick}
                    className="w-12"
                    style={{ display: editing ? "block" : "none" }}
                    type="number"
                    value={value}
                    onChange={handleChangeInput}
                ></input>
            </div>
        </ClickAwayListener>
    );
};

export default DraggableNumInput;
