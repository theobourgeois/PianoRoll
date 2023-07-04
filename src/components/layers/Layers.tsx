import { memo, useContext, useEffect } from "react";
import { INSTRUMENT_OPTIONS, SIDEBAR_WIDTH } from "../../utils/constants";
import { LayersContext, NotesContext } from "../../utils/context";
import { audioContext } from "../../utils/globals";
import { Layer } from "../../utils/types";
import { BiLayerPlus } from "react-icons/bi";
import { getNewID } from "../../utils/util-functions";
import { LayerCard } from "./Layer";
import Soundfont from "soundfont-player";

interface LayersProps {
    sideBarOpen: boolean;
}

export const Layers = ({ sideBarOpen }: LayersProps): JSX.Element => {
    const { layers, setLayers } = useContext(LayersContext);
    const { setNotes } = useContext(NotesContext);

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
        setNotes({ ...newLayer });
    };

    return (
        <>
            <div
                style={{
                    transition: "margin-left 0.2s ease-in-out",
                    marginLeft: `${sideBarOpen ? SIDEBAR_WIDTH : 0}px`,
                }}
            ></div>
            <div
                className="absolute  flex h-screen z-[100] bg-slate-200 dark:bg-slate-600 px-2 overflow-auto flex-col items-center"
                style={{
                    width: `${SIDEBAR_WIDTH}px`,
                    right: `${sideBarOpen ? 0 : -SIDEBAR_WIDTH}px`,
                    transition: "right 0.2s ease-in-out",
                }}
            >
                <p className="mt-2 mb-4 text-lg font-bold dark:text-slate-200 text-slate-700">
                    Layers
                </p>

                <div className="flex flex-col items-center">
                    {layers.map((layer: Layer) => (
                        <LayerCard key={getNewID()} layer={layer} />
                    ))}
                    <BiLayerPlus
                        onClick={handleAddLayer}
                        className="w-8 h-8 mt-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-300 dark:text-slate-200 text-slate-700"
                    />
                </div>
            </div>
        </>
    );

    return (
        <div
            className="flex h-screen z-[100] bg-slate-200 dark:bg-slate-600 px-2 overflow-auto flex-col items-center"
            style={{
                transition: "margin-left 0.2s ease-in-out",
                marginLeft: `${sideBarOpen ? SIDEBAR_WIDTH : 0}px`,
            }}
        >
            <p className="mt-2 mb-4 text-lg font-bold dark:text-slate-200 text-slate-700">
                Layers
            </p>

            <div className="flex flex-col items-center">
                {layers.map((layer: Layer) => (
                    <LayerCard key={getNewID()} layer={layer} />
                ))}
                <BiLayerPlus
                    onClick={handleAddLayer}
                    className="w-8 h-8 mt-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-300 dark:text-slate-200 text-slate-700"
                />
            </div>
        </div>
    );
};
