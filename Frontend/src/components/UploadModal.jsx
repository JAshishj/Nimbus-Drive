import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import Spinner from "./Spinner.jsx";
import { formatBytes, typeFromFileName, fileTypeMeta } from "../data/data.js";
import { useUploadFile } from "../hooks/useFiles.js";
import { useCreateFolder } from "../hooks/useFolders.js";

export default function UploadModal({ folderId, onClose }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [folderName, setFolderName] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  const {
    mutate: uploadFile,
    isPending,
    isSuccess,
    isError,
    error,
    reset,
    data: uploadedData,
  } = useUploadFile(folderId);

  const {
    mutate: createFolder,
    isPending: isCreating,
    isSuccess: isFolderCreated,
    reset: resetFolderCreate,
  } = useCreateFolder(folderId);

  const folderTimerRef = useRef(null);

  const handleCreateFolder = () => {
    if (!folderName.trim() || isCreating) return;
    createFolder(folderName.trim(), {
      onSuccess: () => {
        setFolderName("");
        folderTimerRef.current = setTimeout(() => resetFolderCreate(), 2500);
      },
    });
  };

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
      clearTimeout(folderTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !isPending) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPending, onClose]);

  const handleFileSelect = (file) => {
    if (!file) return;
    if (isError) reset();
    setSelectedFile(file);
  };

  const handleStartUpload = () => {
    if (!selectedFile || isPending) return;
    uploadFile(selectedFile,
      {
        onSuccess: () => {
          timerRef.current = setTimeout(onClose, 1200);
        },
      },
    );
  };

  const handleClearSelected = () => {
    if (isPending) return;
    setSelectedFile(null);
    reset();
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const fileType = selectedFile ? typeFromFileName(selectedFile.name) : "doc";
  const typeMeta = fileTypeMeta[fileType] || fileTypeMeta.doc;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4 backdrop-blur-xs transition-opacity animate-in fade-in"
      onClick={() => {
        if (!isPending) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-modal-title"
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-surface border border-line shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-line shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="grid place-items-center w-8 h-8 rounded-lg bg-accent-soft text-accent">
              <Icon name="upload" size={17} />
            </span>
            <h2
              id="upload-modal-title"
              className="font-display text-base font-semibold tracking-tight text-ink"
            >
              {isPending
                ? "Uploading to Drive…"
                : isSuccess
                  ? "Upload Complete"
                  : "Add to My Drive"}
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isPending}
            className="grid place-items-center w-8 h-8 rounded-lg text-faint hover:bg-line/50 hover:text-ink transition-colors disabled:opacity-40 disabled:pointer-events-none"
            aria-label="Close modal"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          {isSuccess && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 text-center space-y-2 animate-in fade-in zoom-in-95">
              <div className="mx-auto grid place-items-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600">
                <Icon name="check" size={24} strokeWidth={2.5} />
              </div>
              <p className="text-sm font-semibold text-emerald-900">
                File uploaded successfully!
              </p>
              <p className="text-xs text-emerald-700 truncate max-w-xs mx-auto">
                {uploadedData?.name || selectedFile?.name}
              </p>
            </div>
          )}

          {isError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 flex items-start gap-3 animate-in fade-in">
              <div className="shrink-0 mt-0.5 w-4 h-4 rounded-full bg-red-200 text-red-800 grid place-items-center font-bold">
                !
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-red-900">Upload failed</p>
                <p className="mt-0.5 text-red-700 truncate">
                  {error?.message ||
                    "An unexpected error occurred during upload."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => reset()}
                className="shrink-0 font-medium text-red-800 hover:text-red-950 underline cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {isPending && (
            <div className="rounded-2xl border border-accent/20 bg-accent-soft/40 p-8 text-center space-y-4 animate-in fade-in">
              <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-accent-soft text-accent">
                <Spinner className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">
                  Uploading {selectedFile?.name}…
                </p>
                <p className="text-xs text-mute mt-1">
                  {selectedFile ? formatBytes(selectedFile.size) : "Processing"}
                </p>
              </div>
              <div className="w-full bg-line/60 rounded-full h-1.5 overflow-hidden">
                <div className="bg-accent h-full w-full rounded-full animate-pulse" />
              </div>
            </div>
          )}

          {!isPending && !isSuccess && (
            <>
              {!selectedFile ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                  onClick={() => inputRef.current?.click()}
                  className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
                    dragging
                      ? "border-accent bg-accent-soft ring-4 ring-accent/10"
                      : "border-line hover:border-accent/50 hover:bg-canvas"
                  }`}
                >
                  <span className="mx-auto grid place-items-center w-12 h-12 rounded-full bg-accent-soft text-accent mb-3 transition-transform hover:scale-105">
                    <Icon name="upload" size={22} />
                  </span>
                  <p className="text-sm font-semibold text-ink">
                    Drag &amp; drop file here
                  </p>
                  <p className="mt-1 text-xs text-faint">
                    or click to browse your computer
                  </p>
                  <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(file);
                      e.target.value = "";
                    }}
                  />
                </div>
              ) : (
                <div className="rounded-2xl border border-line bg-canvas p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="relative grid place-items-center w-11 h-11 rounded-xl bg-surface border border-line text-mute shrink-0">
                      <Icon name={typeMeta.icon} size={22} />
                      <span
                        className="absolute -bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-sm border-2 border-surface"
                        style={{ backgroundColor: typeMeta.dot }}
                      />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-sm font-semibold text-ink truncate"
                        title={selectedFile.name}
                      >
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-mute mt-0.5">
                        {typeMeta.label} · {formatBytes(selectedFile.size)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleClearSelected}
                      className="grid place-items-center w-8 h-8 rounded-lg text-faint hover:bg-line/50 hover:text-ink transition-colors"
                      title="Choose a different file"
                      aria-label="Remove selected file"
                    >
                      <Icon name="close" size={16} />
                    </button>
                  </div>
                </div>
              )}

              {isFolderCreated && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 flex items-center gap-2.5 animate-in fade-in">
                  <span className="grid place-items-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 shrink-0">
                    <Icon name="check" size={13} strokeWidth={2.5} />
                  </span>
                  <p className="text-xs font-semibold text-emerald-900">
                    Folder created successfully!
                  </p>
                </div>
              )}

              <div className="pt-2 border-t border-line/60">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCreateFolder();
                  }}
                  className="flex items-center gap-2"
                >
                  <div className="flex-1 flex items-center gap-2.5 px-3 h-10 rounded-xl border border-line bg-surface focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 transition">
                    <Icon
                      name="folder"
                      size={18}
                      className="text-faint shrink-0"
                    />
                    <input
                      value={folderName}
                      onChange={(e) => setFolderName(e.target.value)}
                      placeholder="New folder name"
                      className="w-full bg-transparent text-sm outline-none placeholder:text-faint"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!folderName.trim() || isCreating}
                    className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl border border-line text-sm font-medium hover:bg-canvas transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                  >
                    {isCreating ? (
                      <>
                        <Spinner className="h-4 w-4" />
                        Creating…
                      </>
                    ) : (
                      <>
                        <Icon name="plus" size={16} strokeWidth={2} />
                        Folder
                      </>
                    )}
                  </button>
                </form>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-end gap-2.5 px-5 py-4 border-t border-line shrink-0 bg-surface">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="h-9 px-4 rounded-xl border border-line text-sm font-medium text-mute hover:text-ink hover:bg-canvas transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          >
            {isSuccess ? "Close" : "Cancel"}
          </button>

          {selectedFile && !isSuccess && (
            <button
              type="button"
              onClick={handleStartUpload}
              disabled={isPending}
              className="inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-all shadow-xs disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              {isPending ? (
                <>
                  <Spinner className="h-4 w-4 text-white" /> Uploading…
                </>
              ) : isError ? (
                <>
                  <Icon name="upload" size={16} />
                  Retry Upload
                </>
              ) : (
                <>
                  <Icon name="upload" size={16} />
                  Upload File
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
