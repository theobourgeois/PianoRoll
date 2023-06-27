import { useState } from "react";
import { Grid } from "../grid/Grid";
import { Piano } from "../piano/Piano";
import { Selection } from "../selection/Selection";
import { usePianoRoll } from "./usePianoRoll";
import { DEFAULT_NOTE_LENGTH } from "../../utils/constants";

export const PianoRoll = (): JSX.Element => {
    const [noteLength, setNoteLength] = useState<number>(DEFAULT_NOTE_LENGTH);
    const { handleMouseMoveOnGrid, handleMouseDownOnGrid } = usePianoRoll(
        noteLength,
        setNoteLength
    );

    return (
        <>
            <Selection />
            <Piano />
            <Grid
                handleMouseMoveOnGrid={handleMouseMoveOnGrid}
                handleMouseDownOnGrid={handleMouseDownOnGrid}
            />
        </>
    );
};
