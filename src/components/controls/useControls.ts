import MidiParser from "midi-parser-js";
import { useContext, useRef, useEffect } from "react";
import { DEFAULT_SAVE_TIME } from "../../utils/constants";
import { NotesContext, BPMContext, ProgressContext, PlayingContext, SnapValueContext } from "../../utils/context";
import { allNotes, idGen } from "../../utils/globals";
import { NoteData, Direction } from "../../utils/types";
import { midiToNoteData, getNearestBar, playNote, timer } from "../../utils/util-functions";

export const useControls = () => {

    const { notes, setNotes } = useContext(NotesContext);
    const { BPM, setBPM } = useContext(BPMContext);
    const { progress, setProgress } = useContext(ProgressContext);
    const { playing, setPlaying } = useContext(PlayingContext);
    const { snapValue, setSnapValue } = useContext(SnapValueContext);
    const tempProgressRef = useRef<number>(0);

    const notesRef = useRef<NoteData[]>(notes);
    const playingRef = useRef<boolean>(false);
    const progressRef = useRef<number>(progress);
    const BPMRef = useRef<number>(BPM);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        MidiParser.parse(fileInputRef.current, (obj: any) => {
            setNotes(midiToNoteData(obj));
        });
    }, []);

    useEffect(() => {
        notesRef.current = notes;
    }, [notes]);

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

    const playPianoRoll = async () => {
        if (notesRef.current.length === 0) return;
        let farthestCol = getNearestBar(notesRef.current);
        let unitTimeMs = (60 / (BPMRef.current * 8)) * 1000;
        for (let i = tempProgressRef.current; i < farthestCol; i++) {
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
        const selectedNotes = notesRef.current.filter((note) => note.selected);

        for (const note of notesRef.current) {
            if (!note.selected && !noSelectedNote) continue;

            const newNote = {
                ...note,
                column:
                    note.column +
                    getNearestBar(
                        noSelectedNote ? notesRef.current : selectedNotes
                    ),
                id: idGen.next().value as number,
            };
            newNotes.push(newNote);
        }
        setNotes(newNotes);
    };

    const handleDeleteNotes = () => {
        const noSelectedNote = notesRef.current.every(
            (note: NoteData) => !note.selected
        );
        if (noSelectedNote) return setNotes([]);
        const newNotes = [...notesRef.current];
        for (const note of notesRef.current) {
            if (note.selected) {
                newNotes.splice(newNotes.indexOf(note), 1);
            }
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
                    handleDeleteNotes();
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

    return {
        togglePlay,
        playing,
        handleStop,
        BPM,
        handleBPMChange,
        handleSnapValueChange,
        snapValue,
        fileInputRef
    }

}