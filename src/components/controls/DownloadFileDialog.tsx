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
        <div
            style={{
                height: open ? "max-content" : "0",
                opacity: open ? "1" : "0",
                transition: "height 300ms",
            }}
            className="absolute overflow-hidden flex flex-col rounded-md justify-start bg-slate-200 p-4 w-44 top-14 right-0"
        >
            <label htmlFor="filename">File Name</label>
            <input
                id="filename"
                value={fileName}
                onChange={handleFileNameChange}
                type="text"
                className="rounded-sm bg-slate-100 px-1 mb-2"
            ></input>
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
            <button
                className="bg-slate-600 rounded-sm text-slate-100"
                onClick={() => exportPianoRoll(format, fileName)}
            >
                Download
            </button>
        </div>
    );
};
