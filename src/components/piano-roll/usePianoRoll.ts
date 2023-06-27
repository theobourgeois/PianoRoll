import React, { useCallback, useContext } from "react";
import { PIANO_WIDTH, NOTE_WIDTH, RIGHT_CLICK } from "../../utils/constants";
import {
    NotesContext,
    SnapValueContext,
    PlayingContext,
    PianoRollRefContext,
    GridRefContext,
} from "../../utils/context";
import { allNotes, idGen } from "../../utils/globals";
import { Layer, NoteData } from "../../utils/types";
import {
    snapColumn,
    getMousePos,
    playNote,
    handleNoteMouseEvents,
    getNoteCoordsFromMousePosition,
    makeNewNote,
    getNewID,
} from "../../utils/util-functions";

export const usePianoRoll = (
    noteLength: number,
    setNoteLength: (length: number) => void
) => {
    const { notes, setNotes } = useContext(NotesContext);
    const { snapValue } = useContext(SnapValueContext);
    const { playing } = useContext(PlayingContext);
    const pianoRollRef = useContext(PianoRollRefContext)
    const gridRef = useContext(GridRefContext)

    const handleChangeNote = (note: NoteData) => {
        const newSelectedLayer: Layer = { ...notes };
        const index = newSelectedLayer.notes.findIndex((n: NoteData) => n.id === note.id);

        if (index > -1) {
            newSelectedLayer.notes[index] = note;
            setNotes(newSelectedLayer);
        }
    };

    const handleResizeSelectedNotes = useCallback(
        (col: number, note: NoteData) => {
            const newSelectedLayer = { ...notes };
            const updatedNotes = newSelectedLayer.notes.map((n: NoteData) => {
                if (!n.selected) return n;
                let newUnits = Math.max(
                    snapColumn(
                        n.units + col - note.units - note.column,
                        snapValue
                    ),
                    snapValue
                );
                return { ...n, units: newUnits };
            });
            newSelectedLayer.notes = updatedNotes;
            setNotes(newSelectedLayer);
        },
        [notes, snapValue]
    );

    const handleChangeNotesWhenNoteSelected = useCallback(
        (note: NoteData, row: number, col: number, e: React.MouseEvent) => {
            if (!note.selected) return;

            const offset = e
                ? Math.max(
                    Math.round(
                        (getMousePos(e, { pianoRollRef, gridRef }).x - PIANO_WIDTH) / NOTE_WIDTH
                    ) - note.column,
                    0
                )
                : 0;

            const rowsMoved = note.row - row;
            const colsMoved = note.column - col;

            const newNotes = [...notes.notes];
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
                if (e.shiftKey) {
                    const index = newNotes.findIndex(
                        (note: NoteData) => note.id === n.id
                    );
                    newNotes[index] = { ...n, selected: false };
                    newNotes.push({ ...newNote })

                }
                else {
                    const index = newNotes.findIndex(
                        (note: NoteData) => note.id === n.id
                    );
                    newNotes[index] = newNote;
                }
            }
            setNotes({ ...notes, notes: newNotes });
        },
        [notes, snapValue]

    );

    const handleAddNote = (note: NoteData) => {
        const newSelectedLayer = { ...notes };
        newSelectedLayer.notes.push(note);
        setNotes(newSelectedLayer);
    };

    const handleDeleteNote = useCallback(
        (note: NoteData) => {
            const newSelectedLayer = { ...notes };
            const index = newSelectedLayer.notes.findIndex((n: NoteData) => n.id === note.id);
            newSelectedLayer.notes.splice(index, 1);
            setNotes(newSelectedLayer);
        },
        [notes, setNotes]
    );

    const handleSelectNote = (note: NoteData) => {
        const newSelectedLayer = { ...notes };
        const index = newSelectedLayer.notes.findIndex((n: NoteData) => n.id === note.id);
        newSelectedLayer.notes[index].selected = !note.selected;
        setNotes(newSelectedLayer);
    };

    const handleDeselectAllNotes = () => {
        const newSelectedLayer = { ...notes };
        for (const n of newSelectedLayer.notes) n.selected = false;
        setNotes(newSelectedLayer);
    };

    const handleDeleteMultipleNotes = (notes: NoteData[]) => {
        setNotes((prevActiveLayer: Layer) => {
            return {
                ...prevActiveLayer,
                notes: prevActiveLayer.notes.filter(
                    (note) => !notes.some((n) => n.id === note.id)
                ),
            }
        });
    };

    const handleMoveNote = useCallback(
        (e: React.MouseEvent, note: NoteData) => {
            if (e.button === RIGHT_CLICK) return handleDeleteNote(note);
            if ((e.metaKey || e.ctrlKey) && e.shiftKey) return;
            if (e.metaKey || e.ctrlKey) return handleSelectNote(note);

            const clickedPositionX = getMousePos(e, { pianoRollRef, gridRef }).x;
            const offset = Math.max(
                Math.round((clickedPositionX - PIANO_WIDTH) / NOTE_WIDTH) -
                note.column,
                0
            );

            if (!playing) playNote(notes.instrument.player, note.note);
            let currentNote = note;
            setNoteLength(note.units);
            handleNoteMouseEvents({ pianoRollRef, gridRef }, (row: number, col: number) => {
                if (note.selected)
                    return handleChangeNotesWhenNoteSelected(note, row, col, e);

                handleDeselectAllNotes();
                const newColumn = Math.max(col - offset, 0);

                const newNote = {
                    ...note,
                    row,
                    column: snapColumn(newColumn, snapValue),
                    note: allNotes[allNotes.length - 1 - row],
                };

                if (e.shiftKey)
                    handleAddNote({
                        ...newNote,
                        id: getNewID(),
                    });
                else handleChangeNote(newNote);

                if (currentNote.note !== newNote.note && !playing)
                    playNote(notes.instrument.player, newNote.note);
                currentNote = newNote;
            });
        },
        [playing, snapValue, handleChangeNote]
    );

    const handleResize = useCallback(
        (note: NoteData) => {
            handleNoteMouseEvents({ pianoRollRef, gridRef }, (_, col) => {
                if (note.selected) return handleResizeSelectedNotes(col, note);

                handleDeselectAllNotes();

                let newUnits = Math.max(
                    snapColumn(col - note.column, snapValue),
                    snapValue
                );
                const newNote = { ...note, units: newUnits };
                setNoteLength(newUnits);
                handleChangeNote(newNote);
            });
        },
        [snapValue, handleChangeNote]
    );

    const handleSelectNotesInBox = useCallback(
        (e: React.MouseEvent, shiftKey: boolean) => {
            const startPos = getNoteCoordsFromMousePosition(e, { pianoRollRef, gridRef });
            let currentPos = startPos;

            handleNoteMouseEvents({ pianoRollRef, gridRef }, (row, col) => {
                const minRow = Math.min(startPos.row, currentPos.row);
                const maxRow = Math.max(startPos.row, currentPos.row);
                const minCol = Math.min(startPos.col, currentPos.col);
                const maxCol = Math.max(startPos.col, currentPos.col);

                const newNotes = [];
                for (let i = 0; i < notes.notes.length; i++) {
                    const note = notes.notes[i];
                    const noteRow = note.row;
                    const noteStartCol = note.column;
                    const noteEndCol = note.column + note.units;
                    const inBox =
                        minRow <= noteRow &&
                        noteRow <= maxRow &&
                        ((minCol <= noteStartCol && noteStartCol <= maxCol) ||
                            (minCol <= noteEndCol && noteEndCol <= maxCol) ||
                            (noteStartCol <= minCol && maxCol <= noteEndCol));

                    newNotes.push({
                        ...note,
                        selected: shiftKey ? note.selected || inBox : inBox,
                    });
                }
                setNotes({ ...notes, notes: newNotes });

                currentPos = { row, col };
            });
        },
        [notes, setNotes]
    );

    const handleDeleteNotesGrid = useCallback(
        (e: React.MouseEvent) => {
            const { row, col } = getNoteCoordsFromMousePosition(e, { pianoRollRef, gridRef });
            const note = notes.notes.find((note: NoteData) =>
                noteOnGrid(note, row, col)
            );
            if (note) handleDeleteNote(note as NoteData);

            handleNoteMouseEvents({ pianoRollRef, gridRef }, (row, col) => {
                const deletableNotes = notes.notes.filter((note: NoteData) =>
                    noteOnGrid(note, row, col)
                );
                if (deletableNotes.length > 0)
                    handleDeleteMultipleNotes(deletableNotes);
            });
        },
        [notes, handleDeleteMultipleNotes]
    );

    const noteOnGrid = (note: NoteData, row: number, col: number) => {
        return (
            note.column <= col &&
            note.column + note.units > col &&
            note.row === row
        );
    };

    const handleMouseDownOnGrid = useCallback(
        (e: React.MouseEvent) => {
            const { row, col } = getNoteCoordsFromMousePosition(e, { pianoRollRef, gridRef });
            const note = notes.notes.find((note: NoteData) =>
                noteOnGrid(note, row, col)
            );
            const resizing = note && col === note.column + note.units - 1;
            if (resizing) return handleResize(note)
            if (note) return handleMoveNote(e, note);

            if (e.metaKey || e.ctrlKey)
                return handleSelectNotesInBox(e, e.shiftKey);
            if (e.button === RIGHT_CLICK) return handleDeleteNotesGrid(e);
            handleDeselectAllNotes();

            const newNote = makeNewNote(
                row,
                snapColumn(col, snapValue),
                noteLength
            );
            handleAddNote(newNote);
            if (!playing) playNote(notes.instrument.player, newNote.note);

            let currentNote = newNote;
            handleNoteMouseEvents({ pianoRollRef, gridRef }, (row, col) => {
                const newNote = makeNewNote(
                    row,
                    snapColumn(col, snapValue),
                    noteLength
                );
                if (currentNote.note !== newNote.note && !playing) {
                    playNote(notes.instrument.player, newNote.note);
                }
                // remove old note and add updated note
                handleDeleteNote(currentNote);
                handleAddNote(newNote);
                currentNote = newNote;
            });
        },
        [noteLength, snapValue, playing, notes]
    );

    const handleMouseMoveOnGrid = (e: React.MouseEvent) => {
        const { row, col } = getNoteCoordsFromMousePosition(e, { pianoRollRef, gridRef });
        const note = notes.notes.find((note: NoteData) => noteOnGrid(note, row, col));
        const resizing = note && col === note.column + note.units - 1;
        const cursor = resizing ? "ew-resize" : note ? "all-scroll" : "default";
        document.body.style.cursor = cursor

    }

    return {
        handleMouseMoveOnGrid,
        handleMouseDownOnGrid,
    };
};
