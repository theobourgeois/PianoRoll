import { useContext, useRef } from "react";
import {
    PianoRollRefContext,
    GridRefContext,
    NotesContext,
} from "../../utils/context";
import { allNotes, idGen } from "../../utils/globals";
import {
    getNewID,
    handleNoteMouseEvents,
    playNote,
} from "../../utils/util-functions";
import { PianoNote } from "./PianoNote";

export const Piano = (): JSX.Element => {
    const currentNote = useRef<string>("");
    const pianoRollRef = useContext(PianoRollRefContext);
    const gridRef = useContext(GridRefContext);
    const { notes } = useContext(NotesContext);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        handleNoteMouseEvents({ pianoRollRef, gridRef }, (row) => {
            const note = allNotes[allNotes.length - 1 - row];
            if (currentNote.current !== note) {
                currentNote.current = note;
                playNote(notes.instrument.player, note);
            }
        });
    };

    return (
        <div
            onMouseDown={handleMouseDown}
            className="select-none flex flex-col z-50"
        >
            {allNotes.map((note) => (
                <PianoNote key={getNewID()} note={note} />
            ))}
        </div>
    );
};
