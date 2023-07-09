import { useEffect, useRef, useState } from "react";
import ClickAwayListener from "react-click-away-listener";
import { getNewID } from "../../utils/util-functions";

interface Option {
    label: any;
    value: any;
}

interface DropDownProps {
    options: Option[];
    onChange: (value: any) => void;
    defaultValue?: Option["value"];
    icon: React.ReactNode;
    selectable?: boolean;
}

export const DropDown = ({
    options,
    onChange,
    defaultValue,
    icon,
    selectable = false,
}: DropDownProps) => {
    const [selectedValue, setSelectedValue] =
        useState<Option["value"]>(defaultValue);
    const [open, setOpen] = useState<boolean>(false);

    const handleSelect = (value: Option["value"]) => {
        setSelectedValue(value);
        setOpen(false);
        onChange(value);
    };

    useEffect(() => {
        setSelectedValue(defaultValue);
    }, [defaultValue]);
    const handleToggleOpen = () => setOpen(!open);

    return (
        <ClickAwayListener onClickAway={() => setOpen(false)}>
            <div className="relative">
                <div
                    className="flex items-center justify-center h-6 bg-blue-500 rounded-md cursor-pointer min-w-[24px] hover:bg-blue-600 "
                    onClick={handleToggleOpen}
                >
                    {icon}
                </div>
                {open && (
                    <div
                        className="absolute mt-1 left-0 z-[1000] bg-white w-max p-2 rounded-md overflow-auto"
                        style={{ maxHeight: window.innerHeight - 50 + "px" }}
                    >
                        {options.map((option: Option) => (
                            <div
                                key={getNewID()}
                                className={
                                    selectedValue === option.value && selectable
                                        ? "px-2 bg-slate-200"
                                        : "px-2 bg-white hover:bg-slate-200"
                                }
                                onClick={() => handleSelect(option.value)}
                            >
                                <div className="flex">
                                    {selectable && (
                                        <input
                                            className="mr-2"
                                            type="radio"
                                            name="snap"
                                            onChange={() =>
                                                handleSelect(option.value)
                                            }
                                            checked={(() => {
                                                console.log(selectedValue);
                                                return (
                                                    selectedValue ===
                                                    option.value
                                                );
                                            })()}
                                        />
                                    )}

                                    {option.label}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </ClickAwayListener>
    );
};
