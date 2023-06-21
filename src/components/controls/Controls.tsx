import DraggableNumInput from "../draggable-num-input/DraggableNumInput";
import {
    TbPlayerPlayFilled,
    TbPlayerPauseFilled,
    TbPlayerStopFilled,
} from "react-icons/tb";
import { MdPiano } from "react-icons/md";
import { BiMagnet } from "react-icons/bi";
import { CgImport, CgSoftwareDownload } from "react-icons/cg";
import { InstrumentOptions } from "./InstrumentOptions";
import { useControls } from "./useControls";
import { DownloadFileDialog } from "./DownloadFileDialog";
import { useState } from "react";

export const Controls = (): JSX.Element => {
    const {
        togglePlay,
        playing,
        handleStop,
        BPM,
        handleBPMChange,
        handleSnapValueChange,
        snapValue,
        fileInputRef,
        exportPianoRoll,
    } = useControls();

    const [downloadFileDialogOpen, setDownloadFileDialogOpen] =
        useState<boolean>(false);
    const handleToggleDownloadFileDialog = () => {
        setDownloadFileDialogOpen(!downloadFileDialogOpen);
    };

    return (
        <div className="fixed flex items-center right-0 top-0 m-2 mt-6 drop-shadow-lg rounded-md p-2 w-max h-max z-50 bg-slate-200">
            <div
                onClick={togglePlay}
                className="bg-blue-500 hover:bg-blue-600 ml-2 w-8 h-8 flex items-center justify-center rounded-md"
            >
                {playing ? (
                    <TbPlayerPauseFilled color="white" className="w-6 h-6" />
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

            <DownloadFileDialog
                exportPianoRoll={exportPianoRoll}
                open={downloadFileDialogOpen}
            />
            <div
                onClick={handleToggleDownloadFileDialog}
                className="flex bg-blue-500 hover:bg-blue-600 px-2 rounded-sm items-center text-white h-6"
            >
                <CgSoftwareDownload color="white" className="w-5 h-5 mr-1" />
                Export File
            </div>
        </div>
    );
};
