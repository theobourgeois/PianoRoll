import { useContext, useEffect, useRef, useState } from "react";
import { NoteData } from "../../utils/types";
import { NoteLengthContext, NotesContext } from "../../utils/context";
import { allNotes, idGen, PIANO_ROLL_HEIGHT } from "../../utils/globals";
import { Grid } from "../grid/Grid";
import { Note } from "../note/Note";
import { Piano } from "../piano/Piano";
import { Selection } from "../selection/Selection";
import { usePianoRoll } from "./usePianoRoll";
import {
    DEFAULT_NOTE_LENGTH,
    NOTE_COLOR,
    NOTE_HEIGHT,
    NOTE_STROKE_COLOR,
    NOTE_WIDTH,
    PIANO_WIDTH,
    SELECTED_NOTE_COLOR,
} from "../../utils/constants";
import {
    getNoteCoordsFromMousePosition,
    makeNewNote,
} from "../../utils/util-functions";
import { ProgressSelector } from "../progress-selector/ProgressSelector";

export const PianoRoll = (): JSX.Element => {
    const [noteLength, setNoteLength] = useState<number>(DEFAULT_NOTE_LENGTH);
    const { notes } = useContext(NotesContext);
    const {
        handleDeleteNote,
        handleMoveNote,
        handleResize,
        handleMouseDownOnGrid,
    } = usePianoRoll(noteLength, setNoteLength);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [context, setContext] = useState<CanvasRenderingContext2D | null>(
        null
    );

    // useEffect(() => {
    //     const handleScroll = () => {
    //         if (!canvasRef.current) return;
    //         const scroll = window.scrollX;
    //         const gridWidth = scroll + window.innerWidth;
    //         canvasRef.current.style.width = gridWidth + "px";
    //     };

    //     handleScroll();
    //     document.addEventListener("scroll", handleScroll);
    //     window.addEventListener("resize", handleScroll);

    //     return () => {
    //         document.removeEventListener("scroll", handleScroll);
    //         window.removeEventListener("resize", handleScroll);
    //     };
    // }, []);

    useEffect(() => {
        const canvas = canvasRef.current as HTMLCanvasElement;
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        setContext(ctx);
    }, []);

    useEffect(() => {
        if (!context) return;
        context.clearRect(0, 0, window.innerWidth, PIANO_ROLL_HEIGHT);
        const draw = () => {
            for (let i = 0; i < notes.length; i++) {
                const note = notes[i];
                placeNote(note);
            }
        };
        draw();
    }, [notes, context]);

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

    const preventDefault = (e: React.MouseEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <div className="flex">
            <Selection />
            <Piano />
            <canvas
                className="z-20 absolute"
                onMouseDown={handleMouseDownOnGrid}
                style={{
                    left: PIANO_WIDTH,
                }}
                height={PIANO_ROLL_HEIGHT}
                width={window.innerWidth}
                ref={canvasRef}
                onContextMenu={preventDefault}
            ></canvas>
            <Grid />
            {/* <NoteLengthContext.Provider value={{ noteLength, setNoteLength }}>
                
                <div className="flex w-full">
                    <Piano />
                    <Grid handleMouseDownOnGrid={handleMouseDownOnGrid} />
                </div>
                {notes.map((note: NoteData) => (
                    <Note
                        key={idGen.next().value as number}
                        note={note}
                        handleDeleteNote={handleDeleteNote}
                        handleMoveNote={handleMoveNote}
                        handleResize={handleResize}
                    />
                ))}
            </NoteLengthContext.Provider> */}
        </div>
    );
};
