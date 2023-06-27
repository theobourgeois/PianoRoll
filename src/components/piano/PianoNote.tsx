import { useContext } from "react";
import { NOTE_HEIGHT, PIANO_WIDTH } from "../../utils/constants";
import { NotesContext } from "../../utils/context";
import { playNote } from "../../utils/util-functions";

const getKeyColour = (key: string) => {
    if (key.indexOf("#") == -1) return "white";
    return "black";
};

interface PianoNoteProps {
    note: string;
}

export const PianoNote = ({ note }: PianoNoteProps) => {
    const { notes } = useContext(NotesContext);
    return (
        <div
            className="bg-white"
            onClick={() => playNote(notes.instrument.player, note)}
        >
            <div
                style={{
                    width:
                        getKeyColour(note) === "white"
                            ? PIANO_WIDTH + "px"
                            : PIANO_WIDTH / 1.5 + "px",
                }}
                className="w-12 bg-slate-200 cursor-pointer"
            >
                <p
                    style={{
                        backgroundColor: getKeyColour(note),
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
