import { useState, useRef, useEffect, forwardRef } from "react";
import ClickAwayListener from "react-click-away-listener";

const dragImg = new Image(0, 0);
dragImg.src =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
// BS FIX
// FIX THIS

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
    const dragTimeout = useRef<any>(null);
    const [currY, setCurrY] = useState(0);
    const [editing, setEditing] = useState(false);

    function handleDragStart(e: React.DragEvent<HTMLDivElement>) {
        e.dataTransfer.setDragImage(dragImg, 0, 0);
    }

    function handleDrag(e: React.DragEvent<HTMLDivElement>) {
        if (dragTimeout.current) {
            clearTimeout(dragTimeout.current);
        }
        dragTimeout.current = setTimeout(() => {
            setCurrY(e.pageY);
            let diff = currY - e.pageY;
            if (e.pageY === 0) {
                diff = 5;
            }

            // If mouse exits downwards
            if (e.clientY >= window.innerHeight) {
                diff = -5;
            }

            if (
                diff > 10 ||
                diff < -10 ||
                value + diff < min ||
                value + diff > max
            )
                return;
            onChange(value + diff);
        }, 4);
        // delay drag input by 4ms because too many calls
    }

    function handleEnter(e: React.KeyboardEvent<HTMLInputElement>) {
        if (inputRef.current && inputRef.current.value === "") onChange(min);
        if (e.key === "Enter") setEditing(false);
    }

    function handleDoubleClick() {
        setEditing(true);
    }

    function handleChangeInput(e: React.ChangeEvent<HTMLInputElement>) {
        const value = !isNaN(Number(e.target.value))
            ? parseInt(e.target.value)
            : "";
        if (value > max) return onChange(max);
        if (value < min) return onChange(min);
        onChange(Number(value));
    }

    useEffect(() => {
        if (editing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [editing]);

    return (
        <ClickAwayListener onClickAway={() => setEditing(false)}>
            <div onKeyDown={handleEnter}>
                <div
                    style={{ display: editing ? "none" : "flex" }}
                    draggable
                    onDoubleClick={handleDoubleClick}
                    onDragStart={handleDragStart}
                    onDrag={handleDrag}
                    className="flex justify-center items-center w-12 select-none cursor-ns-resize border bg-slate-100 py-1 px-2 rounded-md"
                >
                    <p>{value}</p>
                </div>
                <input
                    ref={inputRef}
                    onClick={handleDoubleClick}
                    className="w-12"
                    style={{ display: editing ? "block" : "none" }}
                    max="1000"
                    type="number"
                    value={value}
                    onChange={handleChangeInput}
                ></input>
            </div>
        </ClickAwayListener>
    );
};

export default DraggableNumInput;
