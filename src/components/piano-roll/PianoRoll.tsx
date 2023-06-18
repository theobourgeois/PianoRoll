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
    NOTE_HEIGHT,
    NOTE_WIDTH,
    PIANO_WIDTH,
} from "../../utils/constants";
import {
    getNoteCoordsFromMousePosition,
    makeNewNote,
} from "../../utils/util-functions";

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
        const gridImg = new Image();
        gridImg.src = "assets/grid-01.svg";
        gridImg.onload = () => {
            const gridPattern = ctx.createPattern(gridImg, "repeat");
            ctx.rect(0, 0, 0, PIANO_ROLL_HEIGHT);
            //@ts-ignore
            ctx.fillStyle = gridPattern;
            ctx.fill();
        };
    }, []);

    useEffect(() => {
        if (!context) return;
        notes.forEach((note: NoteData) => {
            placeNote(note);
        });
    }, [notes]);

    const placeNote = (note: NoteData) => {
        if (!context) return;
        const x = note.column * NOTE_WIDTH;
        const y = (allNotes.length - 1 - note.row) * NOTE_HEIGHT;
        context.fillStyle = "red";
        context.fillRect(x, y, note.units * NOTE_WIDTH, NOTE_HEIGHT);
    };

    const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const { row, col } = getNoteCoordsFromMousePosition(e);
        const note = makeNewNote(row, col, noteLength);
        placeNote(note);
    };

    return (
        <div className="flex">
            <Piano />
            <canvas
                onMouseDown={handleMouseDownOnGrid}
                height={PIANO_ROLL_HEIGHT}
                ref={canvasRef}
            ></canvas>
            {/* <NoteLengthContext.Provider value={{ noteLength, setNoteLength }}>
                <Selection />
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
