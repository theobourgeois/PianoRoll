import { useContext } from "react";
import { NOTE_WIDTH, PIANO_WIDTH } from "../../utils/constants";
import { ProgressContext, SnapValueContext } from "../../utils/context";
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
        <div
            onMouseDown={handleMouseDown}
            style={{ left: PIANO_WIDTH, top: 0 }}
            className="fixed h-4 w-screen bg-slate-400 z-40 overflow-hidden"
        >
            <div className="relative">
                <div className="w-16 overflow-hidden inline-block">
                    <div
                        style={{
                            left: progress * NOTE_WIDTH - 8,
                            top: 0,
                            transition: "100ms",
                        }}
                        className="h-3 w-3 z-50 absolute rounded-sm bg-orange-400 -rotate-45 transform origin-top-left"
                    ></div>
                </div>
            </div>
        </div>
    );
};
