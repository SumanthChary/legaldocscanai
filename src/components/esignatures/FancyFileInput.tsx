
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Upload, X } from "lucide-react";

type FancyFileInputProps = {
  file: File | null;
  setFile: (f: File | null) => void;
  uploading: boolean;
};

export function FancyFileInput({ file, setFile, uploading }: FancyFileInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragActive(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
    }
  }
  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragActive(true);
  }
  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragActive(false);
  }
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      setFile(null);
    }
  }

  return (
    <div
      className={`relative flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-white border-2 ${
        isDragActive
          ? "border-blue-500 bg-blue-50"
          : "border-purple-200 hover:border-purple-400"
      } rounded-xl transition-all duration-200 shadow-lg px-4 py-9 cursor-pointer w-full group`}
      onClick={() => !uploading && fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      aria-disabled={uploading}
      tabIndex={0}
      style={{ minHeight: 115, outline: "none" }}
      role="button"
    >
      <input
        type="file"
        accept="application/pdf"
        ref={fileInputRef}
        onChange={handleFileChange}
        disabled={uploading}
        className="hidden"
        tabIndex={-1}
      />
      {!file ? (
        <div className="flex flex-col items-center gap-2 pointer-events-none select-none">
          <Upload className="w-7 h-7 text-purple-600 mb-2 animate-fade-in" />
          <span className="text-purple-900 font-semibold">
            Drag PDF here or
            <span className="underline ml-1">Choose file</span>
          </span>
          <span className="text-xs text-purple-400">
            PDF only &mdash; Max 10MB
          </span>
        </div>
      ) : (
        <div className="flex w-full items-center gap-3 px-2 pointer-events-none">
          <FileText className="w-6 h-6 text-blue-500 animate-fade-in shrink-0" />
          <div className="flex-1 truncate text-base text-purple-900 font-medium animate-fade-in">{file.name}</div>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            className="ml-2 !pointer-events-auto hover:bg-red-50 hover:text-red-500 transition-colors"
            onClick={e => {
              e.stopPropagation();
              setFile(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            tabIndex={0}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
      <div className="absolute inset-0 pointer-events-none rounded-xl ring-2 ring-transparent group-hover:ring-purple-300 transition" />
    </div>
  );
}
