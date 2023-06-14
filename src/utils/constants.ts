export const NOTES: { [key: string]: number; } = {
    c: 16,
    "c#": 17.32,
    d: 18.35,
    "d#": 19.45,
    e: 20.6,
    f: 21.83,
    "f#": 23.12,
    g: 24.5,
    "g#": 25.96,
    a: 27.5,
    "a#": 29.14,
    b: 30.87,
} as const;

export const DEFAULT_BPM = 120 as const;
export const NOTE_HEIGHT = 32 as const;
export const NOTE_WIDTH = 8 as const;
export const PIANO_WIDTH = 100 as const;
export const DEFAULT_NOTE_LENGTH = 8 as const;
export const DEFAULT_SNAP_VALUE = 2 as const;
export const RIGHT_CLICK = 2 as const;
export const LEFT_CLICK = 0 as const;
export const DEFAULT_SAVE_TIME = 1000 as const;
export const NOTE_COLOR = "rgb(96 165 250)" as const;
export const SELECTED_NOTE_COLOR = "#bfdbfe" as const;
export const BAR_LENGTH = 32 as const;
export const SCROLL_VALUE = 20 as const;


