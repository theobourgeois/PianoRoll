import { useContext, useEffect } from "react";
import {
    INSTRUMENT_OPTIONS,
    LAYER_HEIGHT,
    SIDEBAR_WIDTH,
} from "../../utils/constants";
import { LayersContext, NotesContext } from "../../utils/context";
import { audioContext, idGen } from "../../utils/globals";
import { Layer } from "../../utils/types";
import { CanvasLayerImage } from "./CanvasLayerImage";
import { BiLayerPlus } from "react-icons/bi";
import { FiEdit2 } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { getNewID } from "../../utils/util-functions";
import { LayerCard } from "./Layer";
import Soundfont, { InstrumentName } from "soundfont-player";

interface LayersProps {
    sideBarOpen: boolean;
}

export const Layers = ({ sideBarOpen }: LayersProps): JSX.Element => {
    const { layers, setLayers } = useContext(LayersContext);
    const { notes, setNotes } = useContext(NotesContext);

    const handleAddLayer = async () => {
        const player = await Soundfont.instrument(
            audioContext,
            INSTRUMENT_OPTIONS[0].value
        );
        const newLayer: Layer = {
            id: getNewID(),
            name: "Layer " + (layers.length + 1),
            notes: [],
            instrument: {
                clientName: INSTRUMENT_OPTIONS[0].name,
                name: INSTRUMENT_OPTIONS[0].value,
                player: player,
            },
        };
        setLayers([...layers, newLayer]);
    };

    return (
        <div
            className="w-44 h-screen z-[100] bg-slate-200 overflow-auto flex-col items-center"
            style={{
                display: sideBarOpen ? "flex" : "none",
                width: SIDEBAR_WIDTH + "px",
            }}
        >
            <p className="text-lg font-bold mb-4">Layers</p>

            <div className="flex flex-col items-center">
                {layers.map((layer: Layer) => (
                    <LayerCard key={getNewID()} layer={layer} />
                ))}
                <BiLayerPlus
                    onClick={handleAddLayer}
                    className="mt-2 cursor-pointer w-8 h-8 hover:text-blue-600"
                />
            </div>
        </div>
    );
};
