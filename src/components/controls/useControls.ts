import MidiParser from "midi-parser-js";
import { useContext, useRef, useEffect } from "react";
import { DEFAULT_SAVE_TIME } from "../../utils/constants";
import {
    NotesContext,
    BPMContext,
    ProgressContext,
    PlayingContext,
    SnapValueContext,
    LayersContext,
} from "../../utils/context";
import { allNotes, audioContext, idGen, instrumentPlayer, setInstrumentPlayer } from "../../utils/globals";
import { NoteData, Direction, FileFormat, Layer, PlayingType } from "../../utils/types";
import {
    midiToNoteData,
    getNearestBar,
    playNote,
    timer,
    getNewID,
} from "../../utils/util-functions";
import toWav from 'audiobuffer-to-wav'
import Soundfont, { Player } from "soundfont-player";

export const useControls = (playingType: PlayingType, setPlayingType: (type: PlayingType) => void) => {
    const { notes, setNotes } = useContext(NotesContext);
    const { BPM, setBPM } = useContext(BPMContext);
    const { progress, setProgress } = useContext(ProgressContext);
    const { playing, setPlaying } = useContext(PlayingContext);
    const { snapValue, setSnapValue } = useContext(SnapValueContext);
    const { layers, setLayers } = useContext(LayersContext);


    const tempProgressRef = useRef<number>(0);
    const layersRef = useRef<Layer[]>(layers);
    const selectedLayerRef = useRef<Layer>(notes);
    const playingRef = useRef<boolean>(false);
    const progressRef = useRef<number>(progress);
    const BPMRef = useRef<number>(BPM);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const playingTypeRef = useRef<PlayingType>(playingType);

    useEffect(() => {
        playingTypeRef.current = playingType;
    }, [playingType]);

    useEffect(() => {
        MidiParser.parse(fileInputRef.current, (obj: any) => {
            setNotes({ ...selectedLayerRef.current, notes: midiToNoteData(obj) });
        });
    }, []);

    useEffect(() => {
        selectedLayerRef.current = notes;
    }, [notes]);

    useEffect(() => {
        layersRef.current = layers;
    }, [layers]);

    const handlePlay = () => {
        tempProgressRef.current = progressRef.current;
        if (playingRef.current) return;
        playingRef.current = true;
        setPlaying(true);
        playPianoRoll();
    };

    const handleStop = () => {
        setProgress(tempProgressRef.current);
        setPlaying(false);
        playingRef.current = false;
    };

    const playTrack = async () => {
        if (selectedLayerRef.current.notes.length === 0) return;
        let farthestCol = getNearestBar(selectedLayerRef.current.notes);
        let unitTimeMs = (60 / (BPMRef.current * 8)) * 1000;
        for (let i = tempProgressRef.current; i < farthestCol; i++) {
            if (!playingRef.current) return;
            unitTimeMs = (60 / (BPMRef.current * 8)) * 1000;
            const notesToPlay = selectedLayerRef.current.notes.filter(
                (note) => note.column === i
            );
            if (notesToPlay) {
                for (const note of notesToPlay) {
                    const timeMS = note.units * unitTimeMs;
                    playNote(selectedLayerRef.current.instrument?.player, note.note, timeMS);
                }
            }
            setProgress(i);
            await timer(unitTimeMs);
        }
        if (progressRef.current > 0) {
            progressRef.current = 0;
            setProgress(0);
        }
        playTrack();
    };

    const playSong = async () => {
        if (layersRef.current.length === 0) return;
        const noTracks = layersRef.current.every(layer => layer.notes.length === 0);
        if (noTracks) return;

        let farthestCol = Math.max(...layersRef.current.map(layer => getNearestBar(layer.notes)));
        if (farthestCol === -Infinity) return; // If there are no notes
        let unitTimeMs = (60 / (BPMRef.current * 8)) * 1000;
        for (let i = tempProgressRef.current; i < farthestCol; i++) {

            if (!playingRef.current) return;
            unitTimeMs = (60 / (BPMRef.current * 8)) * 1000;
            for (const layer of layersRef.current) {
                const notesToPlay = layer.notes.filter(note => note.column === i);
                for (const note of notesToPlay) {
                    const timeMS = note.units * unitTimeMs;
                    playNote(layer.instrument?.player, note.note, timeMS);
                }
            }
            setProgress(i);
            await timer(unitTimeMs);
        }
        if (progressRef.current > 0) {
            progressRef.current = 0;
            setProgress(0);
        }
        playSong();
    };



    const playPianoRoll = () => {
        switch (playingTypeRef.current) {
            case PlayingType.TRACK:
                return playTrack();
            case PlayingType.SONG:
                return playSong();
        }
    }

    useEffect(() => {
        progressRef.current = progress;
    }, [progress]);

    const handleSelectAll = () => {
        setNotes((prevNotes: Layer) => ({
            ...selectedLayerRef.current,
            notes: prevNotes.notes.map((note) => ({
                ...note,
                selected: true,
            }))
        }));
    };

    const handleDeselectAll = () => {
        setNotes((prevNotes: Layer) => ({
            ...selectedLayerRef.current,
            notes: prevNotes.notes.map((note) => ({
                ...note,
                selected: false,
            }))
        }));
    };

    const moveNotes = (direction: Direction, amplitude = 1) => {
        const noSelectedNote = selectedLayerRef.current.notes.every(
            (note: NoteData) => !note.selected
        );
        let colOffset = 0;
        let rowOffset = 0;
        switch (direction) {
            case "left":
                colOffset = -snapValue * amplitude;
                break;
            case "right":
                colOffset = snapValue * amplitude;
                break;
            case "top":
                rowOffset = 1;
                break;
            case "bottom":
                rowOffset = -1;
                break;
        }

        setNotes((prevSelectedLayer: Layer) => ({
            ...prevSelectedLayer,
            notes: prevSelectedLayer.notes.map((note) => {
                const newCol = Math.max(
                    note.selected || noSelectedNote
                        ? note.column + colOffset
                        : note.column, 0);
                const newRow =
                    note.selected || noSelectedNote
                        ? note.row + rowOffset
                        : note.row;
                const newNote =
                    note.selected || noSelectedNote
                        ? allNotes[allNotes.length - 1 - (note.row + rowOffset)]
                        : note.note;

                return {
                    ...note,
                    column: newCol,
                    row: newRow,
                    note: newNote,
                };
            })
        }));
    };

    const shiftOctave = (up = false) => {
        const offset = up ? 12 : -12;
        const noSelectedNote = selectedLayerRef.current.notes.every(
            (note: NoteData) => !note.selected
        );
        setNotes((prevSelectedLayer: Layer) => {
            return {
                ...prevSelectedLayer, notes: prevSelectedLayer.notes.map((note: NoteData) => {
                    const newNote =
                        note.selected || noSelectedNote
                            ? allNotes[allNotes.length - 1 - (note.row + offset)]
                            : note.note;
                    const newRow =
                        note.selected || noSelectedNote
                            ? note.row + offset
                            : note.row;

                    return {
                        ...note,
                        row: newRow,
                        note: newNote,
                    };
                })
            }
        });
    };

    const handleDuplicateNotes = () => {
        const newNotes = [...selectedLayerRef.current.notes].map(note => ({ ...note, selected: false }));
        const selectedNotes = selectedLayerRef.current.notes.filter((note) => note.selected);
        const noSelectedNote = selectedNotes.length === 0;

        if (noSelectedNote) {
            const offset = getNearestBar(selectedLayerRef.current.notes);
            for (const note of selectedLayerRef.current.notes) {
                const newNote = {
                    ...note,
                    selected: true,
                    column: note.column + offset,
                    id: getNewID(),
                };
                newNotes.push(newNote);
            }
        }
        else {
            const offset = getNearestBar(selectedNotes);
            const smallestCol = Math.min(...selectedNotes.map(note => note.column));
            for (const note of selectedNotes) {

                const newNote = {
                    ...note,
                    selected: true,
                    column: note.column - smallestCol + offset,
                    id: getNewID(),
                };
                newNotes.push(newNote);
            }

        }
        setNotes((prevSelectedLayer: Layer) => ({ ...prevSelectedLayer, notes: newNotes }));
    }

    const handleDeleteNotes = () => {
        const noSelectedNote = selectedLayerRef.current.notes.every(
            (note: NoteData) => !note.selected
        );
        if (noSelectedNote) return setNotes({ ...selectedLayerRef.current, notes: [] });

        const newNotes = [...selectedLayerRef.current.notes];
        for (const note of selectedLayerRef.current.notes) {
            if (note.selected) {
                newNotes.splice(newNotes.indexOf(note), 1);
            }
        }
        setNotes({ ...selectedLayerRef.current, notes: newNotes });
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const controlCommand = e.metaKey || e.ctrlKey;
            const shiftKey = e.shiftKey && !controlCommand;
            switch (e.key) {
                case "Delete":
                    handleDeleteNotes();
                    break;
                case " ":
                    if (playingRef.current) handleStop();
                    else handlePlay();
                    e.preventDefault();
                    break;
                case "ArrowLeft":
                    e.preventDefault();
                    moveNotes("left");
                    break;
                case "ArrowRight":
                    e.preventDefault();
                    moveNotes("right");
                    break;
                case "ArrowUp":
                    if (controlCommand) shiftOctave(true);
                    else moveNotes("top");
                    e.preventDefault();
                    break;
                case "ArrowDown":
                    if (controlCommand) shiftOctave();
                    else moveNotes("bottom");
                    e.preventDefault();
                    break;
                case "a":
                    if (controlCommand) handleSelectAll();
                    break;
                case "d":
                    if (controlCommand) handleDeselectAll();
                    break;
                case "b":
                    if (controlCommand) handleDuplicateNotes();
                    break;
                case "z":
                    break;
                case "y":
                    break;
                case "c":
                    break;
                case "v":
                    break;
                case "x":
                    break;
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const togglePlay = () => {
        if (!playing) return handlePlay();
        setPlaying(!playing);
        playingRef.current = false;
    };

    const handleSnapValueChange = (value: number) => {
        setSnapValue(value);
    };

    const handleBPMChange = (value: number) => {
        setBPM(value);
        BPMRef.current = value;
    };

    const playTrackOffline = async (instrument: Player) => {
        if (selectedLayerRef.current.notes.length === 0) return;
        let farthestCol = getNearestBar(selectedLayerRef.current.notes);
        let unitTimeSec = 60 / (BPMRef.current * 8);  // Switched to seconds
        let currentTime = 0;

        for (let i = 0; i < farthestCol; i++) {
            unitTimeSec = 60 / (BPMRef.current * 8);
            const notesToPlay = selectedLayerRef.current.notes.filter(
                (note) => note.column === i
            );
            for (const note of notesToPlay) {
                playNoteOffline(note.note, currentTime, note.units * unitTimeSec, instrument);
            }
            currentTime += unitTimeSec;

        }

    }

    const playSongOffline = async (instruments: OfflineInstrument[]) => {
        if (selectedLayerRef.current.notes.length === 0) return;
        let unitTimeSec = 60 / (BPMRef.current * 8);
        let currentTime = 0;
        let farthestCol = Math.max(...layersRef.current.map(layer => getNearestBar(layer.notes)));
        if (farthestCol === -Infinity) return;
        for (let i = 0; i < farthestCol; i++) {
            unitTimeSec = 60 / (BPMRef.current * 8);
            let maxDuration = 0;
            for (const layer of layersRef.current) {
                const notesToPlay = layer.notes.filter(note => note.column === i);
                const instrument = instruments.find(instrument => instrument.id === layer.id)?.instrument;
                for (const note of notesToPlay) {
                    const noteDuration = note.units * unitTimeSec;
                    playNoteOffline(note.note, currentTime, noteDuration, instrument as Player);
                    maxDuration = Math.max(maxDuration, noteDuration);
                }
            }
            currentTime += maxDuration;
        }
    }

    const exportPianoRoll = async (format: FileFormat, filename: string) => {
        let lengthOfSong = getNearestBar(selectedLayerRef.current.notes) * (60 / (BPMRef.current * 8));
        if (playingTypeRef.current === PlayingType.SONG)
            lengthOfSong = Math.max(...layersRef.current.map(layer => getNearestBar(layer.notes))) * (60 / (BPMRef.current * 8));

        const offlineContext = new OfflineAudioContext({
            numberOfChannels: 2,
            length: 44100 * lengthOfSong,
            sampleRate: 44100,
        });

        switch (playingTypeRef.current) {
            case PlayingType.TRACK:
                // @ts-ignore
                const instrument = await Soundfont.instrument(offlineContext, selectedLayerRef.current.instrument.name);
                playTrackOffline(instrument);
                break;
            case PlayingType.SONG:
                const instrumentPromises = layersRef.current.map(async layer => {
                    // @ts-ignore
                    const instrument = await Soundfont.instrument(offlineContext, layer.instrument.name);
                    return ({
                        id: layer.id,
                        instrument
                    });
                });
                const instruments = await Promise.all(instrumentPromises);
                playSongOffline(instruments);
                break;
        }


        offlineContext.startRendering().then(async (buffer) => {
            switch (format) {
                case FileFormat.WAV: {
                    const wav = toWav(buffer);
                    const blob = new window.Blob([new DataView(wav)], {
                        type: "audio/wav",
                    });

                    const url = window.URL.createObjectURL(blob);
                    const anchor = document.createElement("a");
                    anchor.download = filename + "." + format;
                    anchor.href = url;
                    anchor.click();
                    break;
                }
            }

        });
    }

    return {
        togglePlay,
        handleStop,
        handleBPMChange,
        handleSnapValueChange,
        fileInputRef,
        exportPianoRoll
    };
};

const playNoteOffline = (note: string, time: number, ms: number, instrumentPlayer: Player) => {
    if (instrumentPlayer) {
        instrumentPlayer.play(note, time, {
            duration: ms,
            gain: 5,
        });
    }
};

interface OfflineInstrument {
    id: number;
    instrument: Player;
}