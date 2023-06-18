import { useContext } from "react";
import { INSTRUMENT_OPTIONS } from "../../utils/constants";
import { InstrumentContext } from "../../utils/context";
import { idGen } from "../../utils/globals";
import { SelectArrows } from "../select-arrows/SelectArrow";

export const InstrumentOptions = () => {
    const { instrument, setInstrument } = useContext(InstrumentContext);
    const handleInstrumentChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setInstrument(e.target.value);
    };

    const increment = () => {
        const index = INSTRUMENT_OPTIONS.findIndex(
            (option) => option.value === instrument
        );
        const nextIndex = (index + 1) % INSTRUMENT_OPTIONS.length;
        setInstrument(INSTRUMENT_OPTIONS[nextIndex].value);
    };

    const decrement = () => {
        const index = INSTRUMENT_OPTIONS.findIndex(
            (option) => option.value === instrument
        );
        const nextIndex = (index - 1) % INSTRUMENT_OPTIONS.length;
        setInstrument(INSTRUMENT_OPTIONS[nextIndex].value);
    };

    return (
        <div className="flex">
            <select
                className="rounded-sm"
                onChange={handleInstrumentChange}
                value={instrument}
            >
                {INSTRUMENT_OPTIONS.map((option) => (
                    <option
                        key={idGen.next().value as number}
                        value={option.value}
                    >
                        {option.name}
                    </option>
                ))}
            </select>
            <SelectArrows increment={decrement} decrement={increment} />
        </div>
    );
};
