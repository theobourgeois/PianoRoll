import { useContext, useMemo, useRef } from "react";
import {
    PianoRollRefContext,
    GridRefContext,
    NotesContext,
    PlayingContext,
    ProgressContext,
} from "../../utils/context";
import { allNotes, idGen } from "../../utils/globals";
import { NoteData } from "../../utils/types";
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
    const { progress } = useContext(ProgressContext);
    const { playing } = useContext(PlayingContext);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        handleNoteMouseEvents({ pianoRollRef, gridRef }, (row) => {
            const note = allNotes[allNotes.length - 1 - row];
            if (currentNote.current !== note) {
                currentNote.current = note;
                playNote(notes.instrument.player, note);
            }
        });
    };

    const playingNotesIds = useMemo(
        () =>
            notes.notes
                .filter((note: NoteData) => {
                    return (
                        note.column < progress &&
                        note.column + note.units > progress
                    );
                })
                .map((note: NoteData) => note.note),
        [progress, notes.notes]
    );

    return (
        <div
            onMouseDown={handleMouseDown}
            className="z-50 flex flex-col select-none"
        >
            {allNotes.map((note) => (
                <PianoNote
                    playing={playing && playingNotesIds.indexOf(note) !== -1}
                    key={getNewID()}
                    note={note}
                />
            ))}
        </div>
    );
};
