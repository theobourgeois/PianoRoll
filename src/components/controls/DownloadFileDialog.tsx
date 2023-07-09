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
                display: open ? "flex" : "none",
                transition: "height 300ms",
            }}
            className="absolute max flex-col justify-start p-4 z-[1002] overflow-hidden rounded-md bg-slate-200 w-44 top-3 drop-shadow-md"
        >
            <label htmlFor="filename">File Name</label>
            <input
                id="filename"
                value={fileName}
                onChange={handleFileNameChange}
                onKeyDown={(e) => e.stopPropagation()}
                type="text"
                className="px-1 mb-2 rounded-sm bg-slate-100"
            ></input>
            <label htmlFor="format">File Format</label>
            <select
                id="format"
                value={format}
                onChange={handleFormatChange}
                onKeyDown={(e) => e.stopPropagation()}
                className="mb-2"
            >
                {Object.values(FileFormat).map((format) => (
                    <option key={format} value={format}>
                        {format}
                    </option>
                ))}
            </select>

            <button
                className="rounded-sm bg-slate-600 text-slate-100"
                onClick={() => exportPianoRoll(format, fileName)}
            >
                Download
            </button>
        </div>
    );
};
