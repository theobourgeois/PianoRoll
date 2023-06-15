interface SelectArrowsProps {
    decrement: () => void;
    increment: () => void;
}
export const SelectArrows = ({ decrement, increment }: SelectArrowsProps) => {
    return (
        <div>
            <div
                className="bg-slate-200 hover:bg-slate-300"
                onClick={increment}
            >
                <svg
                    className="scale-[0.4]"
                    fill="#2F2F2F"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20.116"
                    height="11.746"
                    viewBox="0 0 20.116 11.746"
                >
                    <path
                        id="Icon_awesome-sort-up"
                        data-name="Icon awesome-sort-up"
                        d="M19.617,15.75H2.883a1.69,1.69,0,0,1-1.2-2.883L10.055,4.5a1.681,1.681,0,0,1,2.384,0l8.367,8.367A1.686,1.686,0,0,1,19.617,15.75Z"
                        transform="translate(-1.191 -4.004)"
                    />
                </svg>
            </div>
            <div
                className="bg-slate-200 hover:bg-slate-300"
                onClick={decrement}
            >
                <svg
                    className="rotate-180 scale-[0.4]"
                    fill="#2F2F2F"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20.116"
                    height="11.746"
                    viewBox="0 0 20.116 11.746"
                >
                    <path
                        id="Icon_awesome-sort-up"
                        data-name="Icon awesome-sort-up"
                        d="M19.617,15.75H2.883a1.69,1.69,0,0,1-1.2-2.883L10.055,4.5a1.681,1.681,0,0,1,2.384,0l8.367,8.367A1.686,1.686,0,0,1,19.617,15.75Z"
                        transform="translate(-1.191 -4.004)"
                    />
                </svg>
            </div>
        </div>
    );
};
