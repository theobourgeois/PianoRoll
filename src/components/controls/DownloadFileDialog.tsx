import { useState } from "react";
import { FileFormat } from "../../utils/types";

interface DownloadFileDialogProps {
    exportPianoRoll: (format: FileFormat, filename: string) => void;
    open: boolean;
}

export const DownloadFileDialog = ({
    exportPianoRoll,
    open,
}: DownloadFileDialogProps) => {
    const [format, setFormat] = useState<FileFormat>(FileFormat.WAV);
    const [fileName, setFileName] = useState<string>("audiofile");

    const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFileName(e.target.value);
    };
    const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormat(e.target.value as FileFormat);
    };

    return (
        <dialog
            open={open}
            className="z-[1000] top-[35%] w-1/2 h-1/4 backdrop:bg-black bg-slate-300 rounded-md drop-shadow-lg"
        >
            <div className="flex flex-col w-full h-full p-4 overflow-hidden rounded-md justify-evenly bg-slate-200">
                <p className="mb-1 text-xl font-medium">Export File</p>

                <div className="flex flex-col">
                    <label htmlFor="filename">File Name</label>
                    <input
                        id="filename"
                        value={fileName}
                        onChange={handleFileNameChange}
                        type="text"
                        className="px-1 mb-2 rounded-sm bg-slate-100"
                    ></input>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="format">File Format</label>
                    <select
                        id="format"
                        value={format}
                        onChange={handleFormatChange}
                        className="mb-2"
                    >
                        {Object.values(FileFormat).map((format) => (
                            <option key={format} value={format}>
                                {format}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    className="rounded-sm bg-slate-600 text-slate-100"
                    onClick={() => exportPianoRoll(format, fileName)}
                >
                    Download
                </button>
            </div>
        </dialog>
    );
};
