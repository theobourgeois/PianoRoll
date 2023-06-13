import { useEffect, useState } from "react";
import { DEFAULT_BPM, DEFAULT_SNAP_VALUE } from "./utils/constants";
import {
    BPMContext,
    InstrumentContext,
    NotesContext,
    PlayingContext,
    ProgressContext,
    SnapValueContext,
} from "./utils/context";
import { PianoRoll } from "./components/piano-roll/PianoRoll";
import { Controls } from "./components/controls/Controls";
import { NoteData } from "./utils/types";
import { reanitializeInstrument } from "./utils/util-functions";
import { InstrumentName } from "soundfont-player";

function App() {
    const [snapValue, setSnapValue] = useState(DEFAULT_SNAP_VALUE);
    const [notes, setNotes] = useState<NoteData[]>([]);
    const [BPM, setBPM] = useState<number>(DEFAULT_BPM);
    const [progress, setProgress] = useState<number>(0);
    const [playing, setPlaying] = useState<boolean>(false);
    const [instrument, setInstrument] = useState<string>(
        "acoustic_grand_piano"
    );

    useEffect(() => {
        reanitializeInstrument(instrument as InstrumentName);
    }, [instrument]);

    return (
        <div className="select-none flex bg-slate-200">
            <div className="h-full">
                <div className="flex">
                    <div className="">
                        <SnapValueContext.Provider
                            value={{ snapValue, setSnapValue }}
                        >
                            <NotesContext.Provider value={{ notes, setNotes }}>
                                <BPMContext.Provider value={{ BPM, setBPM }}>
                                    <ProgressContext.Provider
                                        value={{ progress, setProgress }}
                                    >
                                        <PlayingContext.Provider
                                            value={{ playing, setPlaying }}
                                        >
                                            <PianoRoll />
                                            <InstrumentContext.Provider
                                                value={{
                                                    instrument,
                                                    setInstrument,
                                                }}
                                            >
                                                <Controls />
                                            </InstrumentContext.Provider>
                                        </PlayingContext.Provider>
                                    </ProgressContext.Provider>
                                </BPMContext.Provider>
                            </NotesContext.Provider>
                        </SnapValueContext.Provider>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
