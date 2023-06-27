import { useContext, useEffect, useRef } from "react";
import { LAYER_HEIGHT, NOTE_COLOR, SIDEBAR_WIDTH } from "../../utils/constants";
import { LayersContext } from "../../utils/context";
import { allNotes } from "../../utils/globals";
import { Layer } from "../../utils/types";
import { getNearestBar } from "../../utils/util-functions";

interface CanvasLayerImageProps {
    layer: Layer;
}

export const CanvasLayerImage = ({ layer }: CanvasLayerImageProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { layers } = useContext(LayersContext);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");
        if (context && canvas) {
            const farthestCol = getNearestBar(layer.notes);
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = NOTE_COLOR;
            for (const note of layer.notes) {
                const x = Math.round(
                    (note.column / farthestCol) * canvas.width
                );
                const y = Math.round(
                    ((allNotes.length - 1 - note.row) / allNotes.length) *
                        canvas.height
                );
                const w = Math.round((note.units / farthestCol) * canvas.width);
                const h = Math.round(canvas.height / allNotes.length);
                context.fillRect(x, y, w, h);
            }
        }
    }, [layers]);

    return (
        <canvas
            ref={canvasRef}
            width={SIDEBAR_WIDTH * 0.75}
            height={LAYER_HEIGHT}
        />
    );
};
