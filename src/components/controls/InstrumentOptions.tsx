import { useContext } from "react";
import Soundfont, { InstrumentName } from "soundfont-player";
import { INSTRUMENT_OPTIONS } from "../../utils/constants";
import { NotesContext } from "../../utils/context";
import { audioContext } from "../../utils/globals";
import { getNewID } from "../../utils/util-functions";
import { SelectArrows } from "../select-arrows/SelectArrow";

export const InstrumentOptions = () => {
    const { notes, setNotes } = useContext(NotesContext);

    const handleInstrumentChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const instrument = e.target.value as InstrumentName;
        handleChangeInstrument(instrument);
    };

    const handleChangeInstrument = async (instrument: InstrumentName) => {
        const newNotes = { ...notes };
        const index = INSTRUMENT_OPTIONS.findIndex(
            (option) => option.value === instrument
        );
        newNotes.instrument = {
            name: instrument,
            player: await Soundfont.instrument(audioContext, instrument),
            clientName: INSTRUMENT_OPTIONS[index].name,
        };
        setNotes(newNotes);
    };

    const increment = () => {
        const index = INSTRUMENT_OPTIONS.findIndex(
            (option) => option.value === notes.instrument.name
        );
        const nextIndex = (index + 1) % (INSTRUMENT_OPTIONS.length - 1);
        handleChangeInstrument(INSTRUMENT_OPTIONS[nextIndex].value);
    };

    const decrement = () => {
        const index = INSTRUMENT_OPTIONS.findIndex(
            (option) => option.value === notes.instrument.name
        );
        const nextIndex = (index - 1) % (INSTRUMENT_OPTIONS.length - 1);
        handleChangeInstrument(INSTRUMENT_OPTIONS[nextIndex].value);
    };

    return (
        <div className="flex">
            <select
                className="rounded-sm"
                onChange={handleInstrumentChange}
                value={notes.instrument.name}
            >
                {INSTRUMENT_OPTIONS.map((option) => (
                    <option key={getNewID()} value={option.value}>
                        {option.name}
                    </option>
                ))}
            </select>
            <SelectArrows increment={decrement} decrement={increment} />
        </div>
    );
};
