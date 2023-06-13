import { useRef } from "react";
import { allNotes, idGen } from "../../utils/globals";
import { handleNoteMouseEvents, playNote } from "../../utils/util-functions";
import { PianoNote } from "./PianoNote";

export const Piano = (): JSX.Element => {
    const currentNote = useRef<string>("");
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        handleNoteMouseEvents((row) => {
            const note = allNotes[allNotes.length - 1 - row];
            if (currentNote.current !== note) {
                currentNote.current = note;
                playNote(note);
            }
        });
    };

    return (
        <div
            onMouseDown={handleMouseDown}
            className="select-none flex flex-col"
        >
            {allNotes.map((note) => (
                <PianoNote key={idGen.next().value as number} note={note} />
            ))}
        </div>
    );
};
