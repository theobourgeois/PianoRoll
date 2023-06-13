export type NoteData = {
    row: number;
    column: number;
    note: string;
    units: number;
    velocity: number;
    pan: number;
    id: number;
    selected: boolean;
};
export type Position = {
    x: number;
    y: number;
}

export type Direction = 'top' | 'bottom' | 'left' | 'right';