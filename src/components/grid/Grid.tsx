import { useContext, useEffect, useRef, useState } from "react";
import {
    NOTE_COLOR,
    NOTE_HEIGHT,
    NOTE_STROKE_COLOR,
    NOTE_WIDTH,
    PIANO_WIDTH,
    SELECTED_NOTE_COLOR,
} from "../../utils/constants";
import {
    GridRefContext,
    NotesContext,
    PianoRollRefContext,
    ProgressContext,
} from "../../utils/context";
import { allNotes, PIANO_ROLL_HEIGHT } from "../../utils/globals";
import { NoteData } from "../../utils/types";
import { ellipsized, getNearestBar } from "../../utils/util-functions";
import { ProgressSelector } from "../progress-selector/ProgressSelector";

interface GridProps {
    handleMouseDownOnGrid: (e: React.MouseEvent<HTMLCanvasElement>) => void;
    handleMouseMoveOnGrid: (e: React.MouseEvent<HTMLCanvasElement>) => void;
}

export const Grid = ({
    handleMouseDownOnGrid,
    handleMouseMoveOnGrid,
}: GridProps): JSX.Element => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [context, setContext] = useState<CanvasRenderingContext2D | null>(
        null
    );
    const [gridWidth, setGridWidth] = useState<number>(window.innerWidth);

    const { notes } = useContext(NotesContext);
    const gridRef = useContext(GridRefContext);
    const pianoRollRef = useContext(PianoRollRefContext);
    const gridImgRef = useRef<HTMLDivElement>(null);
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

        let maxLength = 3;
        switch (note.units) {
            case 1:
                maxLength = -1;
                break;
            case 2:
                maxLength = 0;
                break;
            case 3:
                maxLength = 1;
        }
        context.fillText(ellipsized(note.note, maxLength), x + 2, y + 21);
    };

    const handleRightClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    useEffect(() => {
        pianoRollRef.current?.scrollTo(0, 1000); // scroll to c5
    }, []);

    useEffect(() => {
        if (!context) return;

        // Calculate the width even if no notes are present
        const farthestCol =
            notes.notes.length > 0 ? getNearestBar(notes.notes) : 0;
        const gridWidth = (farthestCol + 1) * NOTE_WIDTH + 3000;

        // Set gridImgRef current's style minWidth if gridImgRef current is not null
        if (gridImgRef.current) {
            gridImgRef.current.style.minWidth = gridWidth + "px";
        }
        //setGridWidth(gridWidth);

        context.clearRect(0, 0, gridWidth, PIANO_ROLL_HEIGHT);

        // Draw the notes only if notes are present
        if (notes.notes.length > 0) {
            for (let i = 0; i < notes.notes.length; i++) {
                const note = notes.notes[i];
                placeNote(note);
            }
        }
    }, [notes, context, gridWidth]);

    return (
        <>
            <ProgressSelector />
            <div
                className="w-full flex-shrink-0 overflow-x-auto overflow-y-hidden relative"
                onContextMenu={handleRightClick}
                ref={gridRef}
                style={{
                    height: PIANO_ROLL_HEIGHT + "px",
                    transform: `translateX(-12px)`,
                }}
            >
                <div
                    className=""
                    ref={gridImgRef}
                    style={{
                        height: PIANO_ROLL_HEIGHT + "px",
                        //minWidth: gridWidth + 3000 + "px",
                        backgroundRepeat: "repeat",
                        backgroundImage: 'url("assets/grid-01.svg")',
                    }}
                >
                    <canvas
                        className="absolute"
                        onMouseDown={handleMouseDownOnGrid}
                        onMouseMove={handleMouseMoveOnGrid}
                        height={PIANO_ROLL_HEIGHT}
                        width={gridWidth}
                        ref={canvasRef}
                    ></canvas>
                </div>
            </div>
        </>
    );
};
