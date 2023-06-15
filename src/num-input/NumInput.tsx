import { SelectArrows } from "../components/select-arrows/SelectArrow";

interface NumInputProps {
    value: any;
    onChange: (value: number) => void;
    min: number;
    max: number;
    step: number;
}

export function NumInput({
    value,
    onChange,
    min = 0,
    max = 10,
    step = 1,
}: NumInputProps) {
    function increment() {
        if (max == null) return onChange(value + step);

        if (value + step > max) return onChange(max);
        else onChange(value + step);
    }

    function decrement() {
        if (min == null) return onChange(value - step);
        if (value - step < min) return onChange(min);
        else onChange(value - step);
    }

    return (
        <div className="flex ml-1 bg-white">
            <div className="w-max mr-1">{value}</div>
            <div>
                <SelectArrows decrement={decrement} increment={increment} />
            </div>
        </div>
    );
}
