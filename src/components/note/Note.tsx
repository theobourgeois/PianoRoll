import React, { memo, useContext, useRef } from "react";
import {
    LEFT_CLICK,
    NOTE_COLOR,
    NOTE_HEIGHT,
    NOTE_WIDTH,
    PIANO_WIDTH,
    RIGHT_CLICK,
    SELECTED_NOTE_COLOR,
} from "../../utils/constants";
import {
    NoteLengthContext,
    NotesContext,
    PlayingContext,
    SnapValueContext,
} from "../../utils/context";
import { useMouseDown } from "../../hooks/useMouseDown";
import { NoteData } from "../../utils/types";
import { allNotes, idGen } from "../../utils/globals";
import {
    handleNoteMouseEvents,
    getPos,
    playNote,
    snapColumn,
    getMousePos,
} from "../../utils/util-functions";

interface NoteProps {
    note: NoteData;
    handleChangeNote: (note: NoteData) => void;
    handleDeleteNote: (note: NoteData) => void;
    handleSelectNote: (note: NoteData) => void;
    handleChangeNotesWhenNoteSelected: (
        note: NoteData,
        row: number,
        col: number,
        e: React.MouseEvent<HTMLDivElement>
    ) => void;
    handleResizeSelectedNotes: (col: number, note: NoteData) => void;
    handleAddNote: (note: NoteData) => void;
    handleDeselectAllNotes: () => void;
}

export const Note = memo(
    ({
        note,
        handleChangeNote,
        handleDeleteNote,
        handleSelectNote,
        handleChangeNotesWhenNoteSelected,
        handleResizeSelectedNotes,
        handleAddNote,
        handleDeselectAllNotes,
    }: NoteProps) => {
        const { snapValue } = useContext(SnapValueContext);
        const { setNoteLength } = useContext(NoteLengthContext);
        const { playing } = useContext(PlayingContext);

        const handleRightClick = (e: React.MouseEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            handleDeleteNote(note);
        };

        const handleMoveNote = (e: React.MouseEvent<HTMLDivElement>) => {
            if (e.button === RIGHT_CLICK) return;
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
        };

        const handleResize = (e: React.MouseEvent<HTMLDivElement>) => {
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
        };

        return (
            <div
                className="absolute flex"
                style={{
                    left: getPos(note).x,
                    top: getPos(note).y,
                }}
                onContextMenu={handleRightClick}
            >
                <div
                    onMouseDown={handleMoveNote}
                    style={{
                        width: NOTE_WIDTH * note.units + "px",
                        height: NOTE_HEIGHT,
                        backgroundColor: note.selected
                            ? SELECTED_NOTE_COLOR
                            : NOTE_COLOR,
                    }}
                    className="cursor-pointer outline outline-1 -outline-offset-1 outline-blue-800 h-8 z-20"
                >
                    {note.units > 4 ? note.note : ""}
                </div>

                <div className="relative" onMouseDown={handleResize}>
                    <div
                        className="cursor-ew-resize w-2 z-30 absolute"
                        style={{
                            height: NOTE_HEIGHT,
                            transform: note.units > 1 ? `translateX(-8px)` : "",
                        }}
                    ></div>
                </div>
            </div>
        );
    }
);
