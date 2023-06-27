import { getAllNotesFromOctaveCount, getHeightOfPianoRoll, idGenerator } from "./util-functions";
import { Player } from "soundfont-player";

export const allNotes = getAllNotesFromOctaveCount(9);
export const idGen = idGenerator();
export const audioContext = new (window.AudioContext)();
export let instrumentPlayer: Player | null = null;
export const setInstrumentPlayer = (player: Player) => {
    instrumentPlayer = player;
}
export const PIANO_ROLL_HEIGHT = getHeightOfPianoRoll()

