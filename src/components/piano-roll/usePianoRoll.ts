import React, { useCallback, useContext } from "react";
import { PIANO_WIDTH, NOTE_WIDTH, RIGHT_CLICK } from "../../utils/constants";
import { NotesContext, SnapValueContext, PlayingContext } from "../../utils/context";
import { allNotes, idGen } from "../../utils/globals";
import { NoteData } from "../../utils/types";
import { snapColumn, getMousePos, playNote, handleNoteMouseEvents, getNoteCoordsFromMousePosition, makeNewNote } from "../../utils/util-functions";

export const usePianoRoll = (noteLength: number, setNoteLength: (length: number) => void) => {
    const { notes, setNotes } = useContext(NotesContext);
    const { snapValue } = useContext(SnapValueContext);
    const { playing } = useContext(PlayingContext);

    const handleChangeNote = (note: NoteData) => {
        const newNotes = [...notes];
        const index = newNotes.findIndex((n: NoteData) => n.id === note.id);

        if (index > -1) {
            newNotes[index] = note;
            setNotes(newNotes);
        }
    }

    const handleResizeSelectedNotes = useCallback((col: number, note: NoteData) => {
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
    }, [notes, snapValue])

    const handleChangeNotesWhenNoteSelected = useCallback((
        note: NoteData,
        row: number,
        col: number,
        e: React.MouseEvent
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
    }, [notes, snapValue])

    const handleAddNote = (note: NoteData) => {
        const newNotes = [...notes];
        newNotes.push(note);
        setNotes(newNotes);
    };

    const handleDeleteNote = useCallback((note: NoteData) => {
        const newNotes = [...notes];
        const index = newNotes.findIndex((n) => n.id === note.id);
        newNotes.splice(index, 1);
        setNotes(newNotes);
    }, [notes, setNotes])

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

    const handleMoveNote = useCallback((
        e: React.MouseEvent,
        note: NoteData
    ) => {
        if (e.button === RIGHT_CLICK) return handleDeleteNote(note);
        if ((e.metaKey || e.ctrlKey) && e.shiftKey) return;
        if (e.metaKey || e.ctrlKey) return handleSelectNote(note);

        const clickedPositionX = getMousePos(e).x;
        const offset = Math.max(
            Math.round((clickedPositionX - PIANO_WIDTH) / NOTE_WIDTH) -
            note.column,
            0
        );

        if (!playing) playNote(note.note);
        let currentNote = note;
        setNoteLength(note.units);
        handleNoteMouseEvents((row: number, col: number) => {
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
                    id: idGen.next().value as number,
                });
            else handleChangeNote(newNote);

            if (currentNote.note !== newNote.note && !playing)
                playNote(newNote.note);
            currentNote = newNote;
        });
    }, [playing, snapValue, handleChangeNote])

    const handleResize = useCallback((
        e: React.MouseEvent<HTMLDivElement>,
        note: NoteData
    ) => {
        handleNoteMouseEvents((_, col) => {
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
    }, [snapValue, handleChangeNote])

    const handleSelectNotesInBox = useCallback((e: React.MouseEvent, shiftKey: boolean) => {
        const startPos = getNoteCoordsFromMousePosition(e);
        let currentPos = startPos;

        handleNoteMouseEvents((row, col) => {

            const minRow = Math.min(startPos.row, currentPos.row);
            const maxRow = Math.max(startPos.row, currentPos.row);
            const minCol = Math.min(startPos.col, currentPos.col);
            const maxCol = Math.max(startPos.col, currentPos.col);

            const newNotes = [];
            for (let i = 0; i < notes.length; i++) {
                const note = notes[i]
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
            setNotes(newNotes);

            currentPos = { row, col };

        });
    }, [notes, setNotes]);


    const handleDeleteNotesGrid = useCallback((e: React.MouseEvent) => {
        const { row, col } = getNoteCoordsFromMousePosition(e);
        const note = notes.find((note: NoteData) => noteOnGrid(note, row, col))
        if (note) handleDeleteNote(note as NoteData);

        handleNoteMouseEvents((row, col) => {
            const deletableNotes = notes.filter((note: NoteData) => noteOnGrid(note, row, col));
            if (deletableNotes.length > 0)
                handleDeleteMultipleNotes(deletableNotes);
        });
    }, [notes, handleDeleteMultipleNotes])

    const noteOnGrid = (note: NoteData, row: number, col: number) => {
        return (
            note.column <= col &&
            note.column + note.units > col &&
            note.row === row
        );
    }

    const handleMouseDownOnGrid = useCallback((e: React.MouseEvent) => {
        const { row, col } = getNoteCoordsFromMousePosition(e);
        const note = notes.find((note: NoteData) => noteOnGrid(note, row, col))
        if (note) return handleMoveNote(e, note)


        if (e.metaKey || e.ctrlKey) return handleSelectNotesInBox(e, e.shiftKey);
        if (e.button === RIGHT_CLICK) return handleDeleteNotesGrid(e);
        handleDeselectAllNotes();

        const newNote = makeNewNote(
            row,
            snapColumn(col, snapValue),
            noteLength
        );
        handleAddNote(newNote);
        if (!playing) playNote(newNote.note);

        let currentNote = newNote;
        //handles moving note after it's been created
        handleNoteMouseEvents((row, col) => {
            const newNote = makeNewNote(
                row,
                snapColumn(col, snapValue),
                noteLength
            );
            if (currentNote.note !== newNote.note && !playing) {
                playNote(newNote.note);
            }
            handleAddNote(newNote);
            currentNote = newNote;
        });
    }, [noteLength, snapValue, playing, notes])


    return {
        handleDeleteNote,
        handleMoveNote,
        handleResize,
        handleMouseDownOnGrid
    }



}