import React, { useState, useEffect, useRef } from "react";

interface UploadImagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[]) => void;
  currentCount: number;
}

const UploadImagesModal: React.FC<UploadImagesModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  currentCount,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_TOTAL = 5;
  const remainingSlots = MAX_TOTAL - currentCount;

  useEffect(() => {
    // Generate previews when files change
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);

    // Cleanup function to revoke object URLs
    return () => {
      newPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      addFiles(Array.from(selectedFiles));
    }
  };

  const addFiles = (newFiles: File[]) => {
    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      newFiles.forEach((file) => {
        if (
          updatedFiles.length + currentCount < MAX_TOTAL &&
          !updatedFiles.some((f) => f.name === file.name)
        ) {
          updatedFiles.push(file);
        }
      });
      return updatedFiles;
    });
  };

  const handleRemove = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles) {
      addFiles(Array.from(droppedFiles));
    }
  };

  if (!isOpen) return null;

  const progressPercentage = ((files.length + currentCount) / MAX_TOTAL) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* MODAL CONTAINER */}
      <div className="relative bg-[#0e0e0e] border border-white/10 w-full max-w-4xl rounded-lg shadow-[0px_24px_48px_rgba(0,0,0,0.8)] overflow-y-auto md:overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        {/* LEFT PANEL: DRAG & DROP */}
        <div className="flex-1 p-6 md:p-10 border-b md:border-b-0 md:border-r border-white/5">
          <header className="mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tighter text-[#f2ca50] mb-1 font-['Manrope']">
              Upload Images
            </h2>
            <p className="text-[#d0c5af] text-sm font-medium">
              Add high-resolution visuals to your gallery.
            </p>
          </header>

          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="group relative bg-[#1c1b1b] border-2 border-dashed border-white/10 hover:border-[#f2ca50]/50 rounded-lg h-[220px] md:h-[320px] flex flex-col items-center justify-center transition-all duration-300 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="bg-[#353534] w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[#f2ca50] text-3xl">
                cloud_upload
              </span>
            </div>
            <h3 className="text-lg font-bold mb-1 text-[#e5e2e1]">
              Drag and drop files
            </h3>
            <p className="text-[#d0c5af] text-sm mb-6">
              PNG, JPG or WebP up to 10MB
            </p>
            <button
              className="bg-[#353534] hover:bg-[#3a3939] text-[#e5e2e1] font-semibold px-8 py-3 rounded-full transition-colors border border-white/10"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Select File
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              multiple
              hidden
            />
            {/* Overlay interno */}
            <div className="absolute inset-0 bg-[#f2ca50]/5 opacity-0 group-hover:opacity-100 rounded-lg pointer-events-none transition-opacity"></div>
          </div>
        </div>

        {/* RIGHT PANEL: PREVIEW & ACTIONS */}
        <div className="w-full md:w-[320px] bg-[#1c1b1b] flex flex-col max-h-[40vh] md:max-h-none">
          <div className="p-6 md:p-8 flex-1 overflow-y-auto min-h-0">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#d0c5af]/60 mb-6">
              Recently Selected
            </h4>

            {/* PREVIEW GRID */}
            <div className="grid grid-cols-2 gap-3">
              {previews.map((url, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-lg bg-[#353534] overflow-hidden relative group"
                >
                  <img
                    src={url}
                    alt={`Preview ${index}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span
                      className="material-symbols-outlined text-[#ffb4ab] text-xl cursor-pointer hover:scale-110 transition-transform"
                      onClick={() => handleRemove(index)}
                    >
                      delete
                    </span>
                  </div>
                </div>
              ))}
              {/* Empty slot / Loader placeholder */}
              {files.length < 10 && (
                <div
                  className="aspect-square rounded-lg border border-white/10 flex items-center justify-center bg-black/20 cursor-pointer hover:bg-black/40 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <span className="material-symbols-outlined text-[#d0c5af]/30">
                    add
                  </span>
                </div>
              )}
            </div>

            <div className="mt-8 p-4 bg-black/20 rounded-lg border border-white/5">
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className="text-[#e5e2e1]">Capacity Status</span>
                <span className="text-[#3de1fc]">
                  {files.length + currentCount} / {MAX_TOTAL} images
                </span>
              </div>
              <div className="h-1 w-full bg-[#353534] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#f2ca50] transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              {files.length + currentCount >= MAX_TOTAL && (
                <p className="text-[10px] text-red-400 mt-2 font-bold animate-pulse">
                  Maximum capacity reached (5 images)
                </p>
              )}
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="p-6 md:p-8 pt-0 mt-auto flex flex-col gap-3 bg-[#1c1b1b] sticky bottom-0 border-t border-white/5 md:border-t-0 md:static">
            <button
              className="w-full bg-[#f2ca50] text-[#3c2f00] font-bold py-4 rounded-full active:scale-95 transition-all shadow-lg shadow-[#f2ca50]/10 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => onUpload(files)}
              disabled={files.length === 0}
            >
              Upload
            </button>
            <button
              className="w-full bg-[#353534] hover:bg-[#3a3939] text-[#e5e2e1] font-semibold py-4 rounded-full transition-all"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadImagesModal;
