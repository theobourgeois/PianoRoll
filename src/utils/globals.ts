import { getAllNotesFromOctaveCount, idGenerator } from "./util-functions";
import { Player } from "soundfont-player";

export const allNotes = getAllNotesFromOctaveCount(10);
export const idGen = idGenerator();
export const audioContext = new (window.AudioContext)();

export let instrumentPlayer: Player | null = null;
export const setInstrumentPlayer = (player: Player) => {
    instrumentPlayer = player;
}