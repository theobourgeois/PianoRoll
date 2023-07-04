import { useContext, useEffect, useRef, useState } from "react";
import {
    NOTE_COLOR,
    NOTE_HEIGHT,
    NOTE_STROKE_COLOR,
    NOTE_WIDTH,
    SELECTED_NOTE_COLOR,
} from "../../utils/constants";
import {
    DarkModeContext,
    GridRefContext,
    LayersContext,
    NotesContext,
    PianoRollRefContext,
} from "../../utils/context";
import { allNotes, PIANO_ROLL_HEIGHT } from "../../utils/globals";
import { NoteData } from "../../utils/types";
import {
    ellipsized,
    getNearestBar,
    hexToRgb,
} from "../../utils/util-functions";
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
    const { layers } = useContext(LayersContext);
    const [context, setContext] = useState<CanvasRenderingContext2D | null>(
        null
    );
    const [gridWidth, setGridWidth] = useState<number>(window.innerWidth);

    const darkMode = useContext(DarkModeContext);
    const { notes } = useContext(NotesContext);
    const gridRef = useContext(GridRefContext);
    const pianoRollRef = useContext(PianoRollRefContext);
    const gridImgRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current as HTMLCanvasElement;
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        setContext(ctx);
    }, []);

    const placeNote = (note: NoteData, ghost = false) => {
        if (!context) return;
        const x = note.column * NOTE_WIDTH;
        const y = (allNotes.length - 1 - note.row) * NOTE_HEIGHT;
        const height = NOTE_HEIGHT;
        const width = NOTE_WIDTH * note.units;

        const noteColorRGB = hexToRgb(NOTE_COLOR);
        const noteColor = `rgba(${noteColorRGB.r}, ${noteColorRGB.g}, ${
            noteColorRGB.b
        }, ${ghost ? 0.5 : 1})`;

        const selectedNoteColorRGB = hexToRgb(SELECTED_NOTE_COLOR);
        const selectedNoteColor = `rgba(${selectedNoteColorRGB.r}, ${
            selectedNoteColorRGB.g
        }, ${selectedNoteColorRGB.b}, ${ghost ? 0.1 : 1})`;

        context.fillStyle = note.selected ? selectedNoteColor : noteColor;
        context.fillRect(x, y, width, height);
        if (ghost) return;

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

        const farthestCol =
            notes.notes.length > 0 ? getNearestBar(notes.notes) : 0;
        const gridWidth = (farthestCol + 1) * NOTE_WIDTH + 3000;

        if (gridImgRef.current) {
            gridImgRef.current.style.minWidth = gridWidth + "px";
        }
        setGridWidth(gridWidth);

        context.clearRect(0, 0, gridWidth, PIANO_ROLL_HEIGHT);

        if (layers.length > 0) {
            for (let i = 0; i < layers.length; i++) {
                for (let j = 0; j < layers[i].notes.length; j++) {
                    const note = layers[i].notes[j];
                    placeNote(note, layers[i].id !== notes.id);
                }
            }
        }
    }, [notes, context, gridWidth]);
    return (
        <>
            <ProgressSelector />
            <div
                className="relative flex-shrink-0 w-full overflow-x-auto overflow-y-hidden"
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
                        backgroundImage: `url("assets/grid-${
                            darkMode ? "02" : "01"
                        }.svg")`,
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
