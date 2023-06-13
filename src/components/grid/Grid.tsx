import { useContext, useEffect, useRef } from "react";
import { NOTE_WIDTH, PIANO_WIDTH } from "../../utils/constants";
import { ProgressContext } from "../../utils/context";
import { ProgressSelector } from "../progress-selector/ProgressSelector";

interface GridProps {
    handleMouseDownOnGrid: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const Grid = ({ handleMouseDownOnGrid }: GridProps): JSX.Element => {
    const { progress } = useContext(ProgressContext);
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
                onMouseDown={handleMouseDownOnGrid}
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
