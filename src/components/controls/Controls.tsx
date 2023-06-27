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
import { useRef, useState } from "react";
import { HEADER_HEIGHT } from "../../utils/constants";
import { PianoRoll } from "../piano-roll/PianoRoll";
import { GridRefContext, PianoRollRefContext } from "../../utils/context";
import { FaLayerGroup } from "react-icons/fa";
import { Header } from "./Header";
import { Layers } from "../layers/Layers";
import { PlayingType } from "../../utils/types";

export const Controls = (): JSX.Element => {
    const [playingType, setPlayingType] = useState<PlayingType>(
        PlayingType.SONG
    );
    const [downloadFileDialogOpen, setDownloadFileDialogOpen] =
        useState<boolean>(false);
    const handleToggleDownloadFileDialog = () => {
        setDownloadFileDialogOpen(!downloadFileDialogOpen);
    };
    const {
        togglePlay,
        handleStop,
        handleBPMChange,
        handleSnapValueChange,
        fileInputRef,
        exportPianoRoll,
    } = useControls(playingType, setPlayingType);

    const pianoRollRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    const [sideBarOpen, setSideBarOpen] = useState<boolean>(true);
    const handleToggleSideBar = () => {
        setSideBarOpen(!sideBarOpen);
    };

    const headerProps = {
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
    };

    return (
        <div className="select-none flex flex-col h-screen bg-slate-200 overflow-hidden">
            <Header {...headerProps} />

            <div className="flex flex-1 overflow-hidden">
                <div
                    className="w-full h-full overflow-y-auto overflow-x-hidden flex"
                    ref={pianoRollRef}
                >
                    <PianoRollRefContext.Provider value={pianoRollRef}>
                        <GridRefContext.Provider value={gridRef}>
                            <PianoRoll />
                        </GridRefContext.Provider>
                    </PianoRollRefContext.Provider>
                </div>
                <Layers sideBarOpen={sideBarOpen} />
            </div>
        </div>
    );
};
