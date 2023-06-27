import React, { useContext, useEffect, useRef, useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { SIDEBAR_WIDTH, LAYER_HEIGHT } from "../../utils/constants";
import { LayersContext, NotesContext } from "../../utils/context";
import { Layer } from "../../utils/types";
import { CanvasLayerImage } from "./CanvasLayerImage";
import { AiOutlineCheck } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";

interface LayerProps {
    layer: Layer;
}
export const LayerCard = ({ layer }: LayerProps) => {
    const { setNotes } = useContext(NotesContext);
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
        const newLayers = layers.filter((l: Layer) => l.id !== layer.id);
        setLayers(newLayers);
        setNotes({ ...newLayers[0] });
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
            className="group flex flex-col items-center mb-4 "
        >
            <div>
                <div
                    onClick={handleToggleEditingLayerName}
                    style={{
                        display: editingLayer ? "none" : "flex",
                    }}
                    className="items-center justify-center group-hover:text-blue-600 group cursor-pointer"
                >
                    <p className="mb-1 peer ">{layer.name}</p>
                    <FiEdit2 className="group-hover:block hidden" />
                </div>
                <div
                    style={{ display: editingLayer ? "flex" : "none" }}
                    className="w-1/4 items-center justify-center mb-2 mx-auto"
                >
                    <input
                        ref={inputRef}
                        onKeyDown={handleSubmitLayerName}
                        className="w-28 rounded-md h-6 text-center bg-slate-300 px-2"
                        type="text"
                    ></input>
                    <div
                        onClick={handleSubmitLayerName}
                        className="pointer-cursor flex justify-center items-center ml-2 w-4 h-4 hover:bg-green-500 rounded-full"
                    >
                        <AiOutlineCheck />
                    </div>
                </div>
            </div>
            <div
                style={{
                    width: SIDEBAR_WIDTH * 0.75 + "px",
                    height: LAYER_HEIGHT + "px",
                }}
                className="cursor-pointer outline outline-slate-400 rounded-md relative hover:drop-shadow-lg group-hover:outline-blue-600"
            >
                <MdDelete
                    onClick={() => handleDeleteLayer(layer)}
                    title="delete layer"
                    className="absolute ml-4 bottom-0 right-0 m-1 mt-2 group-hover:block hidden w-6 h-6 text-blue-500"
                />

                <CanvasLayerImage layer={layer} />
            </div>
        </div>
    );
};
