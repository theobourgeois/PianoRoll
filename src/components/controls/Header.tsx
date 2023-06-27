import { useContext } from "react";
import { BiMagnet } from "react-icons/bi";
import { CgImport, CgSoftwareDownload } from "react-icons/cg";
import { FaLayerGroup } from "react-icons/fa";
import { MdPiano } from "react-icons/md";
import {
    TbPlayerPauseFilled,
    TbPlayerPlayFilled,
    TbPlayerStopFilled,
} from "react-icons/tb";
import { HEADER_HEIGHT } from "../../utils/constants";
import {
    BPMContext,
    PlayingContext,
    SnapValueContext,
} from "../../utils/context";
import { FileFormat, PlayingType } from "../../utils/types";
import DraggableNumInput from "../draggable-num-input/DraggableNumInput";
import { DownloadFileDialog } from "./DownloadFileDialog";
import { InstrumentOptions } from "./InstrumentOptions";

interface HeaderProps {
    togglePlay: () => void;
    handleStop: () => void;
    handleBPMChange: (value: number) => void;
    handleSnapValueChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
    exportPianoRoll: (format: FileFormat, filename: string) => Promise<void>;
    downloadFileDialogOpen: boolean;
    handleToggleDownloadFileDialog: () => void;
    handleToggleSideBar: () => void;
    playingType: PlayingType;
    setPlayingType: (playingType: PlayingType) => void;
}

export const Header = ({
    togglePlay,
    handleStop,
    handleBPMChange,
    handleSnapValueChange,
    fileInputRef,
    exportPianoRoll,
    downloadFileDialogOpen,
    handleToggleDownloadFileDialog,
    handleToggleSideBar,
    playingType,
    setPlayingType,
}: HeaderProps): JSX.Element => {
    const { BPM } = useContext(BPMContext);
    const { playing } = useContext(PlayingContext);
    const { snapValue } = useContext(SnapValueContext);

    return (
        <div className="flex justify-between items-center">
            <div
                className="w-full bg-slate-200 flex items-center"
                style={{
                    height: HEADER_HEIGHT + "px",
                }}
            >
                <div
                    onClick={togglePlay}
                    className="bg-blue-500 hover:bg-blue-600 ml-2 w-8 h-8 flex items-center justify-center rounded-md"
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
                    className="bg-red-500 hover:bg-red-600 mx-2 w-8 h-8 flex items-center justify-center rounded-md"
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

                <div className="flex flex-col w-12 h-2/3 ml-2 bg-slate-300 justify-center">
                    <div
                        onClick={() => setPlayingType(PlayingType.SONG)}
                        className={`
                                flex justify-center items-center h-1/2 
                                ${
                                    playingType === PlayingType.SONG
                                        ? "bg-blue-500 hover:bg-blue-600 text-white"
                                        : "bg-slate-300 hover:bg-slate-400 text-black"
                                }
                            `}
                    >
                        <p className="text-xs text-center">Song</p>
                    </div>
                    <div
                        onClick={() => setPlayingType(PlayingType.TRACK)}
                        className={`
                                flex justify-center items-center h-1/2 
                                ${
                                    playingType === PlayingType.TRACK
                                        ? "bg-blue-500 hover:bg-blue-600 text-white"
                                        : "bg-slate-300 hover:bg-slate-400 text-black"
                                }
                            `}
                    >
                        <p className="text-xs text-center">Track</p>
                    </div>
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

                <div className="flex items-center relative mx-2">
                    <label
                        className="flex bg-blue-500 hover:bg-blue-600  px-2 rounded-sm text-white"
                        htmlFor="file"
                    >
                        <CgImport color="white" className="w-5 h-5 mr-1" />
                        Import MIDI file
                    </label>
                    <input
                        className="absolute opacity-0 w-full"
                        ref={fileInputRef}
                        type="file"
                    />
                </div>
                <div className="relative">
                    <DownloadFileDialog
                        exportPianoRoll={exportPianoRoll}
                        open={downloadFileDialogOpen}
                    />
                    <div
                        onClick={handleToggleDownloadFileDialog}
                        className="flex bg-blue-500 hover:bg-blue-600 px-2 rounded-sm items-center text-white h-6"
                    >
                        <CgSoftwareDownload
                            color="white"
                            className="w-5 h-5 mr-1"
                        />
                        Export File
                    </div>
                </div>
            </div>
            <div onClick={handleToggleSideBar} className="mr-4">
                <FaLayerGroup className="w-6 h-6" />
            </div>
        </div>
    );
};
