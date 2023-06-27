import { useEffect, useState } from "react";
import { DEFAULT_BPM, DEFAULT_SNAP_VALUE } from "./utils/constants";
import {
    BPMContext,
    InstrumentContext,
    LayersContext,
    NotesContext,
    PlayingContext,
    PlayingTypeContext,
    ProgressContext,
    SnapValueContext,
} from "./utils/context";
import { Controls } from "./components/controls/Controls";
import { Layer, NoteData, PlayingType } from "./utils/types";
import {
    createNewDefaultLayer,
    getNewID,
    reanitializeInstrument,
} from "./utils/util-functions";
import { InstrumentName } from "soundfont-player";

function App() {
    const [snapValue, setSnapValue] = useState(DEFAULT_SNAP_VALUE);
    const [notes, setNotes] = useState<Layer>({
        id: getNewID(),
        name: "New Layer",
        notes: [],
        instrument: {
            name: "acoustic_grand_piano",
            player: null,
            clientName: "Acoustic Grand Piano",
        },
    });
    const [layers, setLayers] = useState<Layer[]>([notes]);
    const [BPM, setBPM] = useState<number>(DEFAULT_BPM);
    const [progress, setProgress] = useState<number>(0);
    const [playing, setPlaying] = useState<boolean>(false);
    const [instrument, setInstrument] = useState<string>(
        "acoustic_grand_piano"
    );

    useEffect(() => {
        reanitializeInstrument(instrument as InstrumentName);
    }, [instrument]);

    useEffect(() => {
        setLayers((prevLayers) => {
            const newLayers = [...prevLayers];
            const index = newLayers.findIndex((layer) => layer.id === notes.id);
            newLayers[index] = notes;
            return newLayers;
        });
    }, [notes]);

    useEffect(() => {
        const fetchLayer = async () => {
            const defaultLayer = (await createNewDefaultLayer()) as Layer;
            setNotes(defaultLayer);
            setLayers([defaultLayer]);
        };

        fetchLayer();
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
                                <InstrumentContext.Provider
                                    value={{
                                        instrument,
                                        setInstrument,
                                    }}
                                >
                                    <LayersContext.Provider
                                        value={{ layers, setLayers }}
                                    >
                                        <Controls />
                                    </LayersContext.Provider>
                                </InstrumentContext.Provider>
                            </PlayingContext.Provider>
                        </ProgressContext.Provider>
                    </BPMContext.Provider>
                </NotesContext.Provider>
            </SnapValueContext.Provider>
        </>
    );
}

export default App;
