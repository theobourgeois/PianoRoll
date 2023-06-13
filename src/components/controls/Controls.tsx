import { useContext, useEffect, useRef, useState } from "react";
import DraggableNumInput from "../../draggable-num-input/DraggableNumInput";
import { DEFAULT_SAVE_TIME } from "../../utils/constants";
import {
    NotesContext,
    BPMContext,
    ProgressContext,
    PlayingContext,
    SnapValueContext,
} from "../../utils/context";
import { Direction, NoteData } from "../../utils/types";
import { getNearestBar, playNote, timer } from "../../utils/util-functions";
import {
    TbPlayerPlayFilled,
    TbPlayerPauseFilled,
    TbPlayerStopFilled,
} from "react-icons/tb";
import { MdPiano } from "react-icons/md";
import { BiMagnet } from "react-icons/bi";
import { CgImport } from "react-icons/cg";
import { InstrumentOptions } from "./InstrumentOptions";
import { allNotes, idGen } from "../../utils/globals";
import MidiParser from "midi-parser-js";

function midiToNoteData(midiData) {
    const noteData = [];

    for (const track of midiData.track) {
        let currentTick = 0;
        let currentColumn = 0;
        const timeDivision = midiData.timeDivision;
        let ongoingNotes = {}; // Dictionary to track ongoing notes

        track.event.forEach((event, index) => {
            // Increase currentTick by deltaTime
            currentTick += event.deltaTime;
            currentColumn += Math.floor((event.deltaTime / timeDivision) * 8);

            if (event.type === 9) {
                // note-on event
                ongoingNotes[event.data[0]] = currentColumn; // Start of the note
            } else if (event.type === 8) {
                // note-off event
                const noteStart = ongoingNotes[event.data[0]];
                if (noteStart !== undefined) {
                    // If the note was previously started
                    const note = {
                        row: event.data[0],
                        note: allNotes[allNotes.length - 1 - event.data[0]],
                        column: noteStart,
                        units: currentColumn - noteStart, // units equals to the note length
                        velocity: 1,
                        pan: 0,
                        id: index,
                        selected: false,
                    };

                    noteData.push(note);
                    delete ongoingNotes[event.data[0]]; // Delete the note from ongoingNotes
                }
            }
        });
    }

    return noteData;
}

export const Controls = (): JSX.Element => {
    const { notes, setNotes } = useContext(NotesContext);
    const { BPM, setBPM } = useContext(BPMContext);
    const { progress, setProgress } = useContext(ProgressContext);
    const { playing, setPlaying } = useContext(PlayingContext);
    const { snapValue, setSnapValue } = useContext(SnapValueContext);

    const notesRef = useRef<NoteData[]>(notes);
    const playingRef = useRef<boolean>(false);
    const progressRef = useRef<number>(progress);
    const BPMRef = useRef<number>(BPM);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        MidiParser.parse(fileInputRef.current, (obj) => {
            console.log(obj);
            setNotes(midiToNoteData(obj));
        });
    }, []);

    useEffect(() => {
        notesRef.current = notes;
    }, [notes]);

    const handlePlay = () => {
        if (playingRef.current) return;
        playingRef.current = true;
        setPlaying(true);
        playPianoRoll();
    };

    const handleStop = () => {
        setProgress(0);
        setPlaying(false);
        playingRef.current = false;
    };

    const playPianoRoll = async () => {
        if (notesRef.current.length === 0) return;
        let farthestCol = getNearestBar(notesRef.current);
        let unitTimeMs = (60 / (BPMRef.current * 8)) * 1000;
        for (let i = progressRef.current; i < farthestCol; i++) {
            if (!playingRef.current) return;
            unitTimeMs = (60 / (BPMRef.current * 8)) * 1000;
            const notesToPlay = notesRef.current.filter(
                (note) => note.column === i
            );
            if (notesToPlay) {
                for (const note of notesToPlay) {
                    const timeMS = note.units * unitTimeMs;
                    playNote(note.note, timeMS);
                }
            }
            setProgress(i);
            // wait for next beat
            await timer(unitTimeMs);
        }
        if (progressRef.current > 0) {
            progressRef.current = 0;
            setProgress(0);
        }
        playPianoRoll();
    };

    useEffect(() => {
        progressRef.current = progress;
    }, [progress]);

    const handleSelectAll = () => {
        setNotes((prevNotes: NoteData[]) => {
            return prevNotes.map((note) => ({
                ...note,
                selected: true,
            }));
        });
    };

    const handleDeselectAll = () => {
        setNotes((prevNotes: NoteData[]) => {
            return prevNotes.map((note) => ({
                ...note,
                selected: false,
            }));
        });
    };

    const moveNotes = (direction: Direction, amplitude = 1) => {
        const noSelectedNote = notesRef.current.every(
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

        setNotes((prevNotes: NoteData[]) => {
            return prevNotes.map((note) => {
                const newCol =
                    note.selected || noSelectedNote
                        ? note.column + colOffset
                        : note.column;
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
            });
        });
    };

    const shiftOctave = (up = false) => {
        const offset = up ? 12 : -12;
        const noSelectedNote = notesRef.current.every(
            (note: NoteData) => !note.selected
        );
        setNotes((prevNotes: NoteData[]) => {
            return prevNotes.map((note) => {
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
            });
        });
    };

    const handleDuplicateNotes = () => {
        const newNotes = [...notesRef.current];
        const noSelectedNote = notesRef.current.every(
            (note: NoteData) => !note.selected
        );

        for (const note of notesRef.current) {
            if (!note.selected && !noSelectedNote) continue;

            const newNote = {
                ...note,
                column: note.column + getNearestBar(notesRef.current),
                id: idGen.next().value as number,
            };
            newNotes.push(newNote);
        }
        setNotes(newNotes);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const controlCommand = e.metaKey || e.ctrlKey;
            const shiftKey = e.shiftKey && !controlCommand;
            switch (e.key) {
                case "=":
                case "-":
                    if (controlCommand) return;
                case "Delete":
                    setNotes([]);
                    break;
                case " ":
                    if (playingRef.current) handleStop();
                    else handlePlay();
                    break;
                case "ArrowLeft":
                    moveNotes("left");
                    break;
                case "ArrowRight":
                    moveNotes("right");
                    break;
                case "ArrowUp":
                    if (controlCommand) shiftOctave(true);
                    else moveNotes("top");
                    break;
                case "ArrowDown":
                    if (controlCommand) shiftOctave();
                    else moveNotes("bottom");
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

            e.preventDefault();
        };
        document.addEventListener("keydown", handleKeyDown);
        const storedNotes = localStorage.getItem("notes");
        if (storedNotes) setNotes(JSON.parse(storedNotes));

        const saveNotes = () => {
            localStorage.setItem("notes", JSON.stringify(notesRef.current));
        };

        const intervalId = setInterval(saveNotes, DEFAULT_SAVE_TIME);

        return () => {
            clearInterval(intervalId);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const togglePlay = () => {
        if (!playing) return handlePlay();
        setPlaying(!playing);
        playingRef.current = false;
    };

    const handleSnapValueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSnapValue(parseInt(e.target.value));
    };

    const handleBPMChange = (value: number) => {
        setBPM(value);
        BPMRef.current = value;
    };

    // const [past, setPast] = useState<NoteData[][]>([]);
    // const [future, setFuture] = useState<NoteData[][]>([]);

    // useEffect(() => {
    //     if (past.length === 0 && notes.length === 0) return;

    //     if (notesRef.current.length != notes.length) {
    //         setPast((past) => [notes, ...past]);
    //     }
    //     notesRef.current = notes;
    // }, [notes]);

    // const undo = () => {
    //     if (!past.length) return;
    //     setFuture([notesRef.current, ...future]);
    //     setNotes(past[0]);
    //     setPast(past.slice(1));
    // };

    // const redo = () => {
    //     if (!future.length) return;
    //     setPast([notesRef.current, ...past]);
    //     setNotes(future[0]);
    //     setFuture(future.slice(1));
    // };

    return (
        <div className="fixed right-0 top-0 m-2 mt-6 drop-shadow-lg rounded-md p-2 w-max h-max z-50 bg-slate-200">
            <div className="flex ">
                <div
                    onClick={togglePlay}
                    className="bg-blue-500 ml-2 w-8 h-8 flex items-center justify-center rounded-md"
                >
                    {playing ? (
                        <TbPlayerPauseFilled
                            color="white"
                            className="w-6 h-6"
                        />
                    ) : (
                        <TbPlayerPlayFilled color="white" className="w-6 h-6" />
                    )}
                </div>
                <div
                    onClick={handleStop}
                    className="bg-red-500 mx-2 w-8 h-8 flex items-center justify-center rounded-md"
                >
                    <TbPlayerStopFilled color="white" className="w-6 h-6" />
                </div>
                <div className="flex items-center">
                    <p className="mr-1">BPM</p>
                    <DraggableNumInput
                        value={BPM}
                        min={10}
                        max={500}
                        onChange={handleBPMChange}
                    />
                </div>

                <div className="flex items-center">
                    <div className="bg-blue-500 mx-2 w-6 h-6 flex items-center justify-center rounded-md">
                        <BiMagnet color="white" className="w-6 h-6" />
                    </div>
                    <select
                        className="rounded-sm"
                        onChange={handleSnapValueChange}
                        value={snapValue}
                    >
                        <option value="1">1/8</option>
                        <option value="2">1/4</option>
                        <option value="4">1/2</option>
                        <option value="8">1/1</option>
                    </select>
                </div>

                <div className="flex items-center">
                    <div className="bg-blue-500 mx-2 w-6 h-6 flex items-center justify-center rounded-md">
                        <MdPiano color="white" className="w-6 h-6" />
                    </div>
                    <InstrumentOptions />
                </div>
                <div className="flex items-center">
                    <div className="bg-blue-500 mx-2 w-6 h-6 flex items-center justify-center rounded-md">
                        <CgImport color="white" className="w-5 h-5" />
                    </div>
                    <input ref={fileInputRef} type="file" />
                </div>
            </div>
        </div>
    );
};
