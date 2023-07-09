import { useEffect, useRef, useState } from "react";
import {
    DEFAULT_BPM,
    DEFAULT_SAVE_TIME,
    DEFAULT_SNAP_VALUE,
    INSTRUMENT_OPTIONS,
} from "./utils/constants";
import {
    BPMContext,
    LayersContext,
    NotesContext,
    PlayingContext,
    ProgressContext,
    SnapValueContext,
} from "./utils/context";
import { Controls } from "./components/controls/Controls";
import { Layer } from "./utils/types";
import { getNewID } from "./utils/util-functions";
import { audioContext } from "./utils/globals";
import Soundfont, { InstrumentName } from "soundfont-player";

function App() {
    const [snapValue, setSnapValue] = useState(DEFAULT_SNAP_VALUE);
    const [notes, setNotes] = useState<Layer>({
        id: getNewID(),
        name: INSTRUMENT_OPTIONS[0].name,
        notes: [],
        instrument: {
            name: INSTRUMENT_OPTIONS[0].value,
            clientName: INSTRUMENT_OPTIONS[0].name,
        },
    });
    const [layers, setLayers] = useState<Layer[]>([notes]);
    const [BPM, setBPM] = useState<number>(DEFAULT_BPM);
    const [progress, setProgress] = useState<number>(0);
    const [playing, setPlaying] = useState<boolean>(false);
    const [hasMounted, setHasMounted] = useState(false);
    const layersRef = useRef<Layer[]>([]);

    useEffect(() => {
        layersRef.current = layers;
    }, [layers]);

    // update layers when notes change
    // cant update layers on mount because it interferes with initialization of local storage
    useEffect(() => {
        if (hasMounted) {
            setLayers((prevLayers) => {
                const newLayers = [...prevLayers];
                const index = newLayers.findIndex(
                    (layer) => layer.id === notes.id
                );
                if (index >= 0) {
                    newLayers[index] = notes;
                    return newLayers;
                }
                return prevLayers;
            });
        } else {
            setHasMounted(true);
        }
    }, [notes]);

    /**
     * Initialize layers.
     * If no local storage, create new default layer
     * Update instrument player because it is not serializable
     * Save layers each DEFAULT_SAVE_TIME milliseconds
     */
    useEffect(() => {
        const saveNotes = () => {
            localStorage.setItem("layers", JSON.stringify(layersRef.current));
        };
        const initLayers = async () => {
            const storedLayers = localStorage.getItem("layers");
            const parsedLayers = storedLayers
                ? JSON.parse(storedLayers)
                : undefined;

            // when no local storage, create new default layer
            if (!parsedLayers) {
                const newSelectedLayer = { ...notes };
                newSelectedLayer.instrument.player = await Soundfont.instrument(
                    audioContext,
                    newSelectedLayer.instrument?.name as InstrumentName
                );
                setNotes(newSelectedLayer);
                setLayers([newSelectedLayer]);
                saveNotes();
                return;
            }

            // need to update instrument player because it is not serializable
            const updatedPlayerLayers = await Promise.all(
                parsedLayers.map(async (layer: Layer) => {
                    const player = await Soundfont.instrument(
                        audioContext,
                        layer.instrument?.name as InstrumentName
                    );
                    return {
                        ...layer,
                        instrument: { ...layer.instrument, player },
                    };
                })
            );

            if (updatedPlayerLayers) {
                setLayers(updatedPlayerLayers);
                setNotes({ ...updatedPlayerLayers[0] });
            }

            // save notes every DEFAULT_SAVE_TIME milliseconds
            const intervalId = setInterval(saveNotes, DEFAULT_SAVE_TIME);
            return () => {
                clearInterval(intervalId);
            };
        };

        initLayers();
    }, []);

    return (
        <>
            <SnapValueContext.Provider value={{ snapValue, setSnapValue }}>
                <NotesContext.Provider value={{ notes, setNotes }}>
                    <BPMContext.Provider value={{ BPM, setBPM }}>
                        <ProgressContext.Provider
                            value={{ progress, setProgress }}
                        >
                            <PlayingContext.Provider
                                value={{ playing, setPlaying }}
                            >
                                <LayersContext.Provider
                                    value={{ layers, setLayers }}
                                >
                                    <Controls />
                                </LayersContext.Provider>
                            </PlayingContext.Provider>
                        </ProgressContext.Provider>
                    </BPMContext.Provider>
                </NotesContext.Provider>
            </SnapValueContext.Provider>
        </>
    );
}

export default App;
