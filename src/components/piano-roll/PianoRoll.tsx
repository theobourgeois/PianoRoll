import { useContext, useEffect, useRef, useState } from "react";
import { NoteData } from "../../utils/types";
import { NoteLengthContext, NotesContext } from "../../utils/context";
import { allNotes, idGen, PIANO_ROLL_HEIGHT } from "../../utils/globals";
import { Grid } from "../grid/Grid";
import { Note } from "../note/Note";
import { Piano } from "../piano/Piano";
import { Selection } from "../selection/Selection";
import { usePianoRoll } from "./usePianoRoll";
import {
    DEFAULT_NOTE_LENGTH,
    NOTE_COLOR,
    NOTE_HEIGHT,
    NOTE_STROKE_COLOR,
    NOTE_WIDTH,
    PIANO_WIDTH,
    SELECTED_NOTE_COLOR,
} from "../../utils/constants";
import {
    getNoteCoordsFromMousePosition,
    makeNewNote,
} from "../../utils/util-functions";
import { ProgressSelector } from "../progress-selector/ProgressSelector";

export const PianoRoll = (): JSX.Element => {
    const [noteLength, setNoteLength] = useState<number>(DEFAULT_NOTE_LENGTH);
    const { notes } = useContext(NotesContext);
    const { handleMouseMoveOnGrid, handleMouseDownOnGrid } = usePianoRoll(
        noteLength,
        setNoteLength
    );

    return (
        <div className="flex">
            <Selection />
            <Piano />

            <Grid
                handleMouseMoveOnGrid={handleMouseMoveOnGrid}
                handleMouseDownOnGrid={handleMouseDownOnGrid}
            />
        </div>
    );
};
