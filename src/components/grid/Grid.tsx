import { useContext, useEffect, useRef } from "react";
import { NoteData } from "../../utils/types";
import { NOTE_WIDTH, PIANO_WIDTH, RIGHT_CLICK } from "../../utils/constants";
import {
    NoteLengthContext,
    NotesContext,
    PlayingContext,
    ProgressContext,
    SnapValueContext,
} from "../../utils/context";
import {
    getNoteCoordsFromMousePosition,
    handleNoteMouseEvents,
    makeNewNote,
    playNote,
    snapColumn,
} from "../../utils/util-functions";
import { ProgressSelector } from "../progress-selector/ProgressSelector";

interface GridProps {
    handleAddNote: (note: NoteData) => void;
    handleChangeNotes: (note: NoteData) => void;
    handleDeselectAllNotes: () => void;
    handleSelectNote: (note: NoteData) => void;
    handleDeleteMultipleNotes: (notes: NoteData[]) => void;
}

export const Grid = ({
    handleAddNote,
    handleDeselectAllNotes,
    handleSelectNote,
    handleDeleteMultipleNotes,
}: GridProps): JSX.Element => {
    const { snapValue } = useContext(SnapValueContext);
    const { noteLength } = useContext(NoteLengthContext);
    const { progress } = useContext(ProgressContext);
    const { notes } = useContext(NotesContext);
    const { playing } = useContext(PlayingContext);

    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!gridRef.current) return;
            const scroll = window.scrollX;
            const gridWidth = scroll + window.innerWidth;
            gridRef.current.style.width = gridWidth + "px";
        };

        handleScroll();
        document.addEventListener("scroll", handleScroll);
        document.addEventListener("resize", handleScroll);

        return () => {
            document.removeEventListener("scroll", handleScroll);
            document.removeEventListener("resize", handleScroll);
        };
    }, []);

    const handleRightClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleSelectNotesInBox = (e: React.MouseEvent<HTMLDivElement>) => {
        const startPos = getNoteCoordsFromMousePosition(e);
        let currentPos = startPos;
        let selectedNotes = new Set();

        handleNoteMouseEvents((row, col) => {
            const minRow = Math.min(startPos.row, currentPos.row);
            const maxRow = Math.max(startPos.row, currentPos.row);
            const minCol = Math.min(startPos.col, currentPos.col);
            const maxCol = Math.max(startPos.col, currentPos.col);

            const notesInBox = notes.filter((note: NoteData) => {
                const noteRow = note.row;
                const noteStartCol = note.column;
                const noteEndCol = note.column + note.units;

                return (
                    minRow <= noteRow &&
                    noteRow <= maxRow &&
                    ((minCol <= noteStartCol && noteStartCol <= maxCol) ||
                        (minCol <= noteEndCol && noteEndCol <= maxCol) ||
                        (noteStartCol <= minCol && maxCol <= noteEndCol))
                );
            });

            notesInBox.forEach((note: NoteData) => {
                if (!selectedNotes.has(note.id)) {
                    handleSelectNote(note);
                    selectedNotes.add(note.id);
                }
            });

            currentPos = { row, col };
        });
    };

    const handleDeleteNotes = () => {
        handleNoteMouseEvents((row, col) => {
            const deletableNotes = notes.filter((note: NoteData) => {
                return (
                    note.column < col &&
                    note.column + note.units > col &&
                    note.row === row
                );
            });
            if (deletableNotes.length > 0)
                handleDeleteMultipleNotes(deletableNotes);
        });
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.metaKey || e.ctrlKey) return handleSelectNotesInBox(e);
        if (e.button === RIGHT_CLICK) return handleDeleteNotes();
        handleDeselectAllNotes();
        const { row, col } = getNoteCoordsFromMousePosition(e);
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
    };

    return (
        <>
            <div
                className="fixed h-screen bg-black z-40"
                style={{
                    left: PIANO_WIDTH + progress * NOTE_WIDTH,
                    display: progress == 0 ? "none" : "",
                    transition: "100ms",
                    width: "1px",
                }}
            ></div>
            <ProgressSelector />
            <div
                onMouseDown={handleMouseDown}
                onContextMenu={handleRightClick}
                ref={gridRef}
                className="bg-slate-700 absolute w-full h-full origin-top-left"
                style={{
                    backgroundRepeat: "repeat",
                    backgroundImage: 'url("assets/grid-01.svg")',
                    left: PIANO_WIDTH,
                    height: "3840px",
                }}
            ></div>
        </>
    );
};
