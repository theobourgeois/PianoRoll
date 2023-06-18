import { useContext, useEffect, useRef, useState } from "react";
import {
    NOTE_COLOR,
    NOTE_HEIGHT,
    NOTE_STROKE_COLOR,
    NOTE_WIDTH,
    PIANO_WIDTH,
    SELECTED_NOTE_COLOR,
} from "../../utils/constants";
import { NotesContext, ProgressContext } from "../../utils/context";
import { allNotes, PIANO_ROLL_HEIGHT } from "../../utils/globals";
import { NoteData } from "../../utils/types";
import { ProgressSelector } from "../progress-selector/ProgressSelector";

interface GridProps {
    handleMouseDownOnGrid: (e: React.MouseEvent<HTMLCanvasElement>) => void;
    handleMouseMoveOnGrid: (e: React.MouseEvent<HTMLCanvasElement>) => void;
}

export const Grid = ({
    handleMouseDownOnGrid,
    handleMouseMoveOnGrid,
}: GridProps): JSX.Element => {
    const gridRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [context, setContext] = useState<CanvasRenderingContext2D | null>(
        null
    );
    const [gridWidth, setGridWidth] = useState<number>(window.innerWidth);

    const { notes } = useContext(NotesContext);

    useEffect(() => {
        const canvas = canvasRef.current as HTMLCanvasElement;
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        setContext(ctx);
    }, []);

    const placeNote = (note: NoteData) => {
        if (!context) return;
        const x = note.column * NOTE_WIDTH;
        const y = (allNotes.length - 1 - note.row) * NOTE_HEIGHT;
        const height = NOTE_HEIGHT;
        const width = NOTE_WIDTH * note.units;

        context.fillStyle = note.selected ? SELECTED_NOTE_COLOR : NOTE_COLOR;
        context.fillRect(x, y, width, height);
        context.strokeStyle = NOTE_STROKE_COLOR;
        context.strokeRect(x, y, width, height);
        context.fillStyle = "black";
        context.font = "16px sans-serif";
        context.fillText(note.note, x + 5, y + 21);
    };

    const handleRightClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };
    useEffect(() => {
        const handleResize = () => {
            if (!canvasRef.current) return;
            const gridWidth = window.scrollX + window.innerWidth;
            setGridWidth(gridWidth);
        };

        handleResize();
        window.addEventListener("scroll", handleResize);
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("scroll", handleResize);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const drawNotes = () => {
        if (!context) return;
        context.clearRect(0, 0, gridWidth, PIANO_ROLL_HEIGHT);
        for (let i = 0; i < notes.length; i++) {
            const note = notes[i];
            placeNote(note);
        }
    };

    useEffect(() => {
        drawNotes();
    }, [notes, context, gridWidth]);

    return (
        <>
            <ProgressSelector />

            <div
                onContextMenu={handleRightClick}
                ref={gridRef}
                className="bg-slate-700 z-10 absolute w-full h-full origin-top-left"
                style={{
                    backgroundRepeat: "repeat",
                    backgroundImage: 'url("assets/grid-01.svg")',
                    left: PIANO_WIDTH,
                    height: PIANO_ROLL_HEIGHT + "px",
                    width: gridWidth + "px",
                }}
            >
                <canvas
                    className=" absolute"
                    onMouseDown={handleMouseDownOnGrid}
                    onMouseMove={handleMouseMoveOnGrid}
                    height={PIANO_ROLL_HEIGHT}
                    width={gridWidth}
                    ref={canvasRef}
                ></canvas>
            </div>
        </>
    );
};
