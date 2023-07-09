import { useContext, useState } from "react";
import { HEADER_HEIGHT, NOTE_WIDTH } from "../../utils/constants";
import {
    GridRefContext,
    PianoRollRefContext,
    ProgressContext,
    SnapValueContext,
} from "../../utils/context";
import { PIANO_ROLL_HEIGHT } from "../../utils/globals";
import {
    getNoteCoordsFromMousePosition,
    handleNoteMouseEvents,
    snapColumn,
} from "../../utils/util-functions";

export const ProgressSelector = () => {
    const { progress, setProgress } = useContext(ProgressContext);
    const { snapValue } = useContext(SnapValueContext);
    const pianoRollRef = useContext(PianoRollRefContext);
    const gridRef = useContext(GridRefContext);
    const [moving, setMoving] = useState<boolean>(false);

    const handleMouseDown = (e: React.MouseEvent) => {
        const { col } = getNoteCoordsFromMousePosition(e, {
            pianoRollRef,
            gridRef,
        });
        setProgress(snapColumn(col, snapValue));
        handleNoteMouseEvents({ pianoRollRef, gridRef }, (_, col) => {
            setProgress(snapColumn(col, snapValue));
        });
        setMoving(true);
    };

    return (
        <>
            {/* Line */}
            <div
                className="relative z-40 h-screen"
                style={{
                    left: progress * NOTE_WIDTH,
                    transition: moving ? "" : "100ms left",
                    top: 0,
                    height: PIANO_ROLL_HEIGHT + "px",
                }}
            >
                <div
                    className="absolute z-40 h-screen bg-black"
                    style={{
                        display: progress == 0 ? "none" : "",
                        width: "1px",
                        height: PIANO_ROLL_HEIGHT + "px",
                    }}
                ></div>
            </div>

            {/* Knob */}
            <div
                className="relative z-40 h-screen"
                style={{
                    left: progress * NOTE_WIDTH - 8,
                    transition: moving ? "" : "100ms left",
                    top: 0,
                    height: PIANO_ROLL_HEIGHT + "px",
                }}
            >
                <div className="sticky top-0 z-40 w-3 h-3 origin-top-left transform -rotate-45 bg-blue-500 rounded-sm"></div>
            </div>

            {/* Background */}
            <div
                onMouseDown={handleMouseDown}
                onMouseUp={() => setMoving(false)}
                className="fixed left-0 z-30 w-screen h-4 overflow-hidden bg-slate-400 dark:bg-slate-800"
            >
                <div className="relative">
                    <div className="inline-block w-16 overflow-hidden"></div>
                </div>
            </div>
        </>
    );
};
