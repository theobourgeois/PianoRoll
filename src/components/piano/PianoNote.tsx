import React, { useContext, useState } from "react";
import {
    LEFT_CLICK,
    NOTE_COLOR,
    NOTE_HEIGHT,
    PIANO_WIDTH,
} from "../../utils/constants";
import { NotesContext } from "../../utils/context";
import { playNote } from "../../utils/util-functions";

const getKeyColour = (key: string) => {
    if (key.indexOf("#") == -1) return "white";
    return "black";
};

interface PianoNoteProps {
    note: string;
    playing: boolean;
}

export const PianoNote = ({ note, playing }: PianoNoteProps) => {
    const { notes } = useContext(NotesContext);
    const [playingNote, setPlayingNote] = useState<boolean>(false);
    const isC =
        note.at(0)?.toLowerCase() === "c" && note.at(1)?.toLowerCase() !== "#";

    const handlePlayNote = () => {
        playNote(notes.instrument.player, note);
        setPlayingNote(true);
    };

    const handleMouseEnter = (e: React.MouseEvent) => {
        if (e.buttons == LEFT_CLICK) {
            playNote(notes.instrument.player, note);
            setPlayingNote(true);
        }
    };

    return (
        <div
            style={{
                backgroundColor:
                    note.at(0)?.toLowerCase() === "c" &&
                    note.at(1)?.toLowerCase() !== "#"
                        ? "rgb(203 213 225)"
                        : "white",
            }}
            onMouseDown={handlePlayNote}
            onMouseUp={() => setPlayingNote(false)}
            onMouseLeave={() => setPlayingNote(false)}
            onMouseEnter={handleMouseEnter}
        >
            <div
                style={{
                    width:
                        getKeyColour(note) === "white"
                            ? PIANO_WIDTH + "px"
                            : PIANO_WIDTH / 1.5 + "px",
                }}
                className="w-12 bg-white cursor-pointer"
            >
                <p
                    style={{
                        backgroundColor:
                            playing || playingNote
                                ? NOTE_COLOR
                                : isC
                                ? "rgb(241 245 249)"
                                : getKeyColour(note),
                        height: NOTE_HEIGHT,
                        color:
                            getKeyColour(note) === "white" ? "black" : "white",
                    }}
                    className="pl-2"
                >
                    {note}
                </p>
            </div>
        </div>
    );
};
