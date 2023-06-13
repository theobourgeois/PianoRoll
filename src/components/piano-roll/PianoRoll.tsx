import { useContext, useEffect, useState } from "react";
import { NoteData } from "../../utils/types";
import { NoteLengthContext, NotesContext } from "../../utils/context";
import { allNotes, idGen } from "../../utils/globals";
import { Grid } from "../grid/Grid";
import { Note } from "../note/Note";
import { Piano } from "../piano/Piano";
import {
    getMousePos,
    getNoteCoordsFromMousePosition,
    handleNoteMouseEvents,
    makeNewNote,
    playNote,
    snapColumn,
} from "../../utils/util-functions";
import { Selection } from "../selection/Selection";
import { usePianoRoll } from "./usePianoRoll";
import { DEFAULT_NOTE_LENGTH } from "../../utils/constants";

export const PianoRoll = (): JSX.Element => {
    const [noteLength, setNoteLength] = useState<number>(DEFAULT_NOTE_LENGTH);
    const { notes } = useContext(NotesContext);
    const {
        handleDeleteNote,
        handleMoveNote,
        handleResize,
        handleMouseDownOnGrid,
    } = usePianoRoll(noteLength, setNoteLength);

    useEffect(() => {
        console.log(notes);
    }, [notes]);
    return (
        <>
            <NoteLengthContext.Provider value={{ noteLength, setNoteLength }}>
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
            </NoteLengthContext.Provider>
        </>
    );
};
