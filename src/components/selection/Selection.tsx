import { useEffect, useState } from "react";
import { Position } from "../../utils/types";
import { getMousePos } from "../../utils/util-functions";

export const Selection = () => {
    const [dimensions, setDimensions] = useState<{
        width: number;
        height: number;
    }>({ width: 0, height: 0 });
    const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

    useEffect(() => {
        const handleResize = (e: MouseEvent) => {
            if (!(e.metaKey || e.ctrlKey)) return;

            let startPos = getMousePos(e);

            const mouseMove = (e: MouseEvent) => {
                let currentPos = getMousePos(e);
                let width = Math.abs(currentPos.x - startPos.x);
                let height = Math.abs(currentPos.y - startPos.y);

                setDimensions({
                    width,
                    height,
                });

                // Set position according to the top-left corner of the rectangle
                setPosition({
                    x: Math.min(startPos.x, currentPos.x),
                    y: Math.min(startPos.y, currentPos.y),
                });
            };

            window.addEventListener("mousemove", mouseMove);
            window.addEventListener(
                "mouseup",
                () => {
                    setDimensions({ width: 0, height: 0 });
                    window.removeEventListener("mousemove", mouseMove);
                },
                { once: true }
            );
        };

        window.addEventListener("mousedown", handleResize);

        return () => window.removeEventListener("mousedown", handleResize);
    }, []);

    return (
        <div
            style={{
                width: dimensions.width,
                height: dimensions.height,
                left: position.x,
                top: position.y,
                outline:
                    dimensions.width == 0 && dimensions.height == 0
                        ? "none"
                        : "1px solid black",
            }}
            className="bg-opacity-40 bg-orange-500 absolute z-40"
        ></div>
    );
};
