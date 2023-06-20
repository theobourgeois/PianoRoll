import { NoteData, Position } from "./types";
import {
    BAR_LENGTH,
    NOTES,
    NOTE_HEIGHT,
    NOTE_WIDTH,
    PIANO_WIDTH,
    SCROLL_VALUE,
} from "./constants";
import {
    allNotes,
    idGen,
    audioContext,
    instrumentPlayer,
    setInstrumentPlayer,
} from "./globals";
import Soundfont, { InstrumentName } from "soundfont-player";

export function* idGenerator() {
    let id = 0;
    while (true) {
        yield ++id;
    }
}

export const getPos = (note: NoteData): Position => {
    const x = Math.max(PIANO_WIDTH + note.column * NOTE_WIDTH * 1, PIANO_WIDTH);
    const y = (allNotes.length - note.row - 1) * NOTE_HEIGHT;
    return { x, y };
};

export const getRowFromNote = (note: string) => {
    return allNotes.length - allNotes.indexOf(note) - 1;
};

let currentMouseMoveHandler: ((e: MouseEvent) => void) | null = null;
let currentMouseUpHandler: ((e: MouseEvent) => void) | null = null;

export const handleNoteMouseEvents = (
    mouseMoveHandler: (row: number, col: number, e: MouseEvent) => void
) => {
    // If there are already event listeners attached, remove them first.
    if (currentMouseMoveHandler) {
        window.removeEventListener("mousemove", currentMouseMoveHandler);
        //@ts-ignore
        window.removeEventListener("mouseup", currentMouseUpHandler);
    }
    const handleMouseMove = (e: MouseEvent) => {
        const { row, col } = getNoteCoordsFromMousePosition(e);
        const pastWindowWidthRight = e.clientX >= window.innerWidth - 1;
        const pastWindowWidthLeft = e.clientX <= 1;
        const pastWindowHeightTop = e.clientY >= window.innerHeight - 1;
        const pastWindowHeightBottom = e.clientY <= 1;
        const widthScrollValue = pastWindowWidthRight
            ? SCROLL_VALUE
            : pastWindowWidthLeft
                ? -SCROLL_VALUE
                : 0;
        const heightScrollValue = pastWindowHeightTop
            ? SCROLL_VALUE
            : pastWindowHeightBottom
                ? -SCROLL_VALUE
                : 0;
        window.scrollBy(widthScrollValue, heightScrollValue);
        mouseMoveHandler(row, col, e);
    };

    const handleMouseUp = () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
    };

    // Save the current handlers so they can be removed later.
    currentMouseMoveHandler = handleMouseMove;
    currentMouseUpHandler = handleMouseUp;

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
};

export const getAllNotesFromOctaveCount = (
    octaveCount: number,
    startOctave = 0
): string[] => {
    let result: string[] = [];
    for (let i = startOctave; i < octaveCount; i++) {
        result = result.concat(Object.keys(NOTES).map((note) => `${note}${i}`));
    }
    return result.reverse();
};

export const getHeightOfPianoRoll = () => allNotes.length * NOTE_HEIGHT;

export const getNoteCoordsFromMousePosition = (
    e: React.MouseEvent | MouseEvent
) => {
    const { x, y } = getMousePos(e);

    const row = Math.min(
        Math.max(allNotes.length - Math.ceil(y / NOTE_HEIGHT), 0),
        allNotes.length - 1
    );
    const col = Math.max(Math.round((x - PIANO_WIDTH) / (NOTE_WIDTH * 1)), 0);
    return { row, col };
};

export const playNote = (note: string, timeMS = 100) => {
    if (instrumentPlayer)
        instrumentPlayer.play(note, audioContext.currentTime, {
            duration: timeMS / 1000,
            gain: 5,
        });
};

export const getFrequencyFromNote = (note: string) => {
    const octave = parseInt(note[note.length - 1]);
    const noteName = note.slice(0, -1);
    return (NOTES[noteName] as number) * Math.pow(2, octave);
};

export const makeNewNote = (row: number, col: number, noteLength: number) => {
    return {
        row: row,
        column: col,
        note: allNotes[allNotes.length - 1 - row],
        units: noteLength,
        velocity: 1,
        pan: 1,
        id: idGen.next().value as number,
        selected: false,
    };
};

export const snapColumn = (col: number, snapValue: number) => {
    if (col === 0) return 0;
    const mod = col % snapValue;
    if (mod > snapValue / 2) {
        return col + (snapValue - mod);
    }
    return col - mod;
};

export const timer = (ms: number) => {
    return new Promise((res) => {
        const targetTime = audioContext.currentTime + ms / 1000;
        const intervalId = setInterval(() => {
            if (audioContext.currentTime >= targetTime) {
                clearInterval(intervalId);
                // @ts-ignore
                res();
            }
        }, 1);
    });
};

export const getMousePos = (e: MouseEvent | React.MouseEvent): Position => {
    const x = e.clientX + window.scrollX;
    const y = e.clientY + window.scrollY;
    return { x, y };
};

export const reanitializeInstrument = async (instrument: InstrumentName) => {
    setInstrumentPlayer(await Soundfont.instrument(audioContext, instrument));
};

export const getNearestBar = (notes: NoteData[]) => {
    let farthestCol = Math.max(
        ...notes.map((note: NoteData) => note.column + note.units)
    );
    if (farthestCol % BAR_LENGTH !== 0)
        farthestCol += BAR_LENGTH - (farthestCol % BAR_LENGTH);
    return farthestCol;
};

//@ts-ignore
export const midiToNoteData = (midiData) => {
    // @ts-ignore
    const noteData = [];
    for (const track of midiData.track) {
        let currentColumn = 0;
        const timeDivision = midiData.timeDivision;
        let ongoingNotes = {};
        // @ts-ignore
        track.event.forEach((event, index) => {
            currentColumn += Math.floor((event.deltaTime / timeDivision) * 8);
            if (event.type === 9 && event.data[1] !== 0) {
                // @ts-ignore
                ongoingNotes[event.data[0]] = {
                    start: currentColumn,
                    velocity: event.data[1],
                };
            } else if (
                event.type === 8 ||
                (event.type === 9 && event.data[1] === 0)
            ) {
                // @ts-ignore
                const noteStart = ongoingNotes[event.data[0]];
                if (noteStart !== undefined) {
                    const note = {
                        row: event.data[0],
                        note: allNotes[allNotes.length - 1 - event.data[0]],
                        column: noteStart.start,
                        units: currentColumn - noteStart.start,
                        velocity: noteStart.velocity,
                        pan: 0,
                        id: index,
                        selected: false,
                    };
                    noteData.push(note);
                    // @ts-ignore
                    delete ongoingNotes[event.data[0]];
                }
            }
        });
    }
    // @ts-ignore
    return noteData;
};

export const ellipsized = (str: string, maxLength: number) => {
    if (maxLength < 0) return ''
    if (str.length > maxLength) {
        return str.slice(0, maxLength) + "..";
    }
    return str;
}

