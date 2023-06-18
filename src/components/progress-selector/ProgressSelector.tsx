import { useContext } from "react";
import { NOTE_WIDTH } from "../../utils/constants";
import { ProgressContext, SnapValueContext } from "../../utils/context";
import { PIANO_ROLL_HEIGHT } from "../../utils/globals";
import {
    getNoteCoordsFromMousePosition,
    handleNoteMouseEvents,
    snapColumn,
} from "../../utils/util-functions";

export const ProgressSelector = () => {
    const { progress, setProgress } = useContext(ProgressContext);
    const { snapValue } = useContext(SnapValueContext);

    const handleMouseDown = (e: React.MouseEvent) => {
        const { col } = getNoteCoordsFromMousePosition(e);
        setProgress(snapColumn(col, snapValue));
        handleNoteMouseEvents((_, col) => {
            setProgress(snapColumn(col, snapValue));
        });
    };

    return (
        <>
            <div
                className="relative h-screen z-40"
                style={{
                    left: progress * NOTE_WIDTH,
                    transition: "100ms left",
                    top: 0,
                    height: PIANO_ROLL_HEIGHT + "px",
                }}
            >
                <div
                    className="absolute h-screen bg-black z-40"
                    style={{
                        display: progress == 0 ? "none" : "",
                        width: "1px",
                        height: PIANO_ROLL_HEIGHT + "px",
                    }}
                ></div>
            </div>

            <div
                className="relative h-screen z-40"
                style={{
                    left: progress * NOTE_WIDTH - 8,
                    transition: "100ms left",
                    top: 0,
                    height: PIANO_ROLL_HEIGHT + "px",
                }}
            >
                <div className="sticky h-3 w-3 z-40 top-0 rounded-sm bg-blue-500 -rotate-45 transform origin-top-left"></div>
            </div>

            <div
                onMouseDown={handleMouseDown}
                className="fixed h-4 w-screen bg-slate-400 z-30 overflow-hidden"
            >
                <div className="relative">
                    <div className="w-16 overflow-hidden inline-block"></div>
                </div>
            </div>
        </>
    );
};
