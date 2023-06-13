import React, { memo, useCallback } from "react";
import {
    NOTE_COLOR,
    NOTE_HEIGHT,
    NOTE_WIDTH,
    SELECTED_NOTE_COLOR,
} from "../../utils/constants";
import { NoteData } from "../../utils/types";
import { getPos } from "../../utils/util-functions";

interface NoteProps {
    note: NoteData;
    handleDeleteNote: (note: NoteData) => void;
    handleMoveNote: (
        e: React.MouseEvent<HTMLDivElement>,
        note: NoteData
    ) => void;
    handleResize: (e: React.MouseEvent<HTMLDivElement>, note: NoteData) => void;
}

export const Note = memo(
    ({ note, handleDeleteNote, handleMoveNote, handleResize }: NoteProps) => {
        const handleRightClick = useCallback(
            (e: React.MouseEvent<HTMLDivElement>) => {
                e.preventDefault();
                e.stopPropagation();
                handleDeleteNote(note);
            },
            [handleDeleteNote, note]
        );

        const handleMouseDown = useCallback(
            (e: React.MouseEvent<HTMLDivElement>) => {
                handleMoveNote(e, note);
            },
            [handleMoveNote, note]
        );

        const handleMouseDownResize = useCallback(
            (e: React.MouseEvent<HTMLDivElement>) => {
                handleResize(e, note);
            },
            [handleResize, note]
        );

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
                    onMouseDown={handleMouseDown}
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

                <div className="relative" onMouseDown={handleMouseDownResize}>
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
