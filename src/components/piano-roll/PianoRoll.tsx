import { useContext, useState } from "react";
import { NoteData } from "../../utils/types";
import {
    DEFAULT_NOTE_LENGTH,
    NOTE_WIDTH,
    PIANO_WIDTH,
} from "../../utils/constants";
import {
    InstrumentContext,
    NoteLengthContext,
    NotesContext,
    SnapValueContext,
} from "../../utils/context";
import { allNotes, idGen } from "../../utils/globals";
import { Grid } from "../grid/Grid";
import { Note } from "../note/Note";
import { Piano } from "../piano/Piano";
import { getMousePos, snapColumn } from "../../utils/util-functions";
import { Selection } from "../selection/Selection";

export const PianoRoll = (): JSX.Element => {
    const { notes, setNotes } = useContext(NotesContext);
    const { snapValue } = useContext(SnapValueContext);
    const { instrument } = useContext(InstrumentContext);
    const [noteLength, setNoteLength] = useState<number>(DEFAULT_NOTE_LENGTH);

    const handleChangeNote = (note: NoteData) => {
        const newNotes = [...notes];
        const index = notes.findIndex((n: NoteData) => n.id === note.id);

        newNotes[index] = note;
        setNotes(newNotes);
    };

    const handleResizeSelectedNotes = (col: number, note: NoteData) => {
        const newNotes = [...notes];
        for (const n of notes) {
            if (!n.selected) continue;
            let newUnits = Math.max(
                snapColumn(n.units + col - note.units - note.column, snapValue),
                snapValue
            );

            const newNote = { ...n, units: newUnits };
            const index = newNotes.findIndex((note) => n.id === note.id);
            newNotes[index] = newNote;
            if (newUnits <= snapValue) return setNotes(newNotes);
        }
        setNotes(newNotes);
    };

    const handleChangeNotesWhenNoteSelected = (
        note: NoteData,
        row: number,
        col: number,
        e: React.MouseEvent<HTMLDivElement>
    ) => {
        if (!note.selected) return;

        const offset = e
            ? Math.max(
                  Math.round((getMousePos(e).x - PIANO_WIDTH) / NOTE_WIDTH) -
                      note.column,
                  0
              )
            : 0;

        const rowsMoved = note.row - row;
        const colsMoved = note.column - col;

        const newNotes = [...notes];
        const selectedNotes = newNotes.filter((n: NoteData) => n.selected);

        for (const n of selectedNotes) {
            let newRow = n.row - rowsMoved;
            newRow = Math.max(0, Math.min(newRow, allNotes.length - 1));
            let newColumn = n.column - colsMoved - offset;
            let newUnits = n.units;
            if (newUnits < 1 || newColumn < 0) return;

            const newNote = {
                ...n,
                row: newRow,
                column: snapColumn(newColumn, snapValue),
                units: newUnits,
                note: allNotes[allNotes.length - 1 - newRow],
                id: e.shiftKey ? idGen.next().value : n.id,
            };
            if (e.shiftKey) newNotes.push(newNote);
            else {
                const index = newNotes.findIndex(
                    (note: NoteData) => note.id === n.id
                );
                newNotes[index] = newNote;
            }
        }
        setNotes(newNotes);
    };

    const handleAddNote = (note: NoteData) => {
        const newNotes = [...notes];
        newNotes.push(note);
        setNotes(newNotes);
    };

    const handleDeleteNote = (note: NoteData) => {
        const newNotes = [...notes];
        const index = newNotes.findIndex((n) => n.id === note.id);
        newNotes.splice(index, 1);
        setNotes(newNotes);
    };

    const handleSelectNote = (note: NoteData) => {
        const newNotes = [...notes];
        const index = newNotes.findIndex((n) => n.id === note.id);
        newNotes[index].selected = !note.selected;
        setNotes(newNotes);
    };

    const handleDeselectAllNotes = () => {
        const newNotes = [...notes];
        for (const n of newNotes) n.selected = false;
        setNotes(newNotes);
    };

    const handleDeleteMultipleNotes = (notes: NoteData[]) => {
        setNotes((prevNotes: NoteData[]) => {
            return prevNotes.filter(
                (note) => !notes.some((n) => n.id === note.id)
            );
        });
    };

    return (
        <>
            <NoteLengthContext.Provider value={{ noteLength, setNoteLength }}>
                <Selection />
                <div className="flex w-full">
                    <Piano />
                    <Grid
                        handleAddNote={handleAddNote}
                        handleChangeNotes={handleChangeNote}
                        handleDeselectAllNotes={handleDeselectAllNotes}
                        handleSelectNote={handleSelectNote}
                        handleDeleteMultipleNotes={handleDeleteMultipleNotes}
                    />
                </div>
                {notes.map((note: NoteData) => (
                    <Note
                        key={idGen.next().value as number}
                        note={note}
                        handleDeselectAllNotes={handleDeselectAllNotes}
                        handleSelectNote={handleSelectNote}
                        handleDeleteNote={handleDeleteNote}
                        handleChangeNote={handleChangeNote}
                        handleChangeNotesWhenNoteSelected={
                            handleChangeNotesWhenNoteSelected
                        }
                        handleResizeSelectedNotes={handleResizeSelectedNotes}
                        handleAddNote={handleAddNote}
                    />
                ))}
            </NoteLengthContext.Provider>
        </>
    );
};
