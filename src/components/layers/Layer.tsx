import React, { useContext, useEffect, useRef, useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { SIDEBAR_WIDTH, LAYER_HEIGHT } from "../../utils/constants";
import { LayersContext, NotesContext } from "../../utils/context";
import { Layer } from "../../utils/types";
import { CanvasLayerImage } from "./CanvasLayerImage";
import { AiOutlineCheck } from "react-icons/ai";

interface LayerProps {
    layer: Layer;
}
export const LayerCard = ({ layer }: LayerProps) => {
    const { notes, setNotes } = useContext(NotesContext);
    const { layers, setLayers } = useContext(LayersContext);
    const [editingLayer, setEditingLayer] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editingLayer && inputRef.current) {
            inputRef.current.value = layer.name;
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [editingLayer]);

    const handleLayerChange = (layer: Layer) => {
        setNotes(layer);
    };

    const handleDeleteLayer = (layer: Layer) => {
        if (layers.length === 1) return;
        setLayers((prevLayers: Layer[]) => {
            const newLayers = prevLayers.filter(
                (l: Layer) => l.id !== layer.id
            );
            setNotes({ ...newLayers[0] });
            return newLayers;
        });
    };

    const handleToggleEditingLayerName = (e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingLayer(!editingLayer);
    };

    const handleLayerTextChange = (name: string) => {
        const newLayers = [...layers];
        const index = newLayers.findIndex((l: Layer) => l.id === layer.id);
        newLayers[index].name = name;
        setLayers(newLayers);
    };

    const handleSubmitLayerName = (
        e: React.KeyboardEvent | React.MouseEvent
    ) => {
        e.stopPropagation();
        if (!inputRef.current) return;
        if ("key" in e) {
            if (e.key === "Enter") {
                setEditingLayer(false);
                handleLayerTextChange(inputRef.current.value);
                return;
            }
            return;
        }
        setEditingLayer(false);
        handleLayerTextChange(inputRef.current.value);
    };

    return (
        <div
            onClick={() => handleLayerChange(layer)}
            className="flex flex-col items-center mb-4 group"
        >
            <div>
                <div
                    onClick={handleToggleEditingLayerName}
                    style={{
                        display: editingLayer ? "none" : "flex",
                    }}
                    className="items-center justify-center cursor-pointer group-hover:text-blue-600 group dark:group-hover:text-blue-300"
                >
                    <p className="mb-1 font-semibold peer dark:text-slate-200 text-slate-700">
                        {layer.name}
                    </p>
                    <FiEdit2 className="hidden group-hover:block" />
                </div>
                <div
                    style={{ display: editingLayer ? "flex" : "none" }}
                    className="items-center justify-center w-1/4 mx-auto mb-2"
                >
                    <input
                        ref={inputRef}
                        onKeyDown={handleSubmitLayerName}
                        className="h-6 px-2 text-center rounded-md w-28 bg-slate-300 dark:bg-slate-700 dark:text-white"
                        type="text"
                    ></input>
                    <div
                        onClick={handleSubmitLayerName}
                        className="flex items-center justify-center w-4 h-4 ml-2 rounded-full cursor-pointer pointer-cursor text-slate-400 hover:text-slate-600 dark:text-slate-200 dark:hover:text-white"
                    >
                        <AiOutlineCheck className="w-8 h-8" />
                    </div>
                </div>
            </div>
            <div
                style={{
                    width: SIDEBAR_WIDTH * 0.75 + "px",
                    height: LAYER_HEIGHT + "px",
                }}
                className={
                    "relative bg-white rounded-md cursor-pointer outline outline-4 outline-slate-400 hover:drop-shadow-lg group-hover:outline-blue-600 dark:group-hover:outline-blue-300" +
                    (layer.id === notes.id
                        ? " dark:outline-blue-300 outline-blue-600"
                        : "")
                }
            >
                <MdDelete
                    onClick={() => handleDeleteLayer(layer)}
                    title="delete layer"
                    className="absolute top-0 right-0 hidden w-6 h-6 m-1 ml-4 text-blue-400 hover:text-blue-500 group-hover:block dark:text-blue-300 hover:dark:text-blue-400"
                />

                <CanvasLayerImage layer={layer} />
            </div>
        </div>
    );
};
