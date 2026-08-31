import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import Spinner from "./Spinner.jsx";
import { getFileDisplay } from "../data/data.js";
import { useRenameFile } from "../hooks/useFiles.js";
import { useRenameFolder } from "../hooks/useFolders.js";

function TypeGlyph({ item }) {
  const isFolder = !item.mime_type;
  const icon = isFolder ? "folder" : getFileDisplay(item)?.meta?.icon || "file";
  return (
    <span className="grid place-items-center w-7 h-7 rounded-lg bg-canvas border border-line text-faint shrink-0">
      <Icon name={icon} size={15} />
    </span>
  );
}

export default function RenameModal({ parentFolderId, item, onClose }) {
  const [value, setValue] = useState(item.name || "");
  const inputRef = useRef(null);

  const ext =
    !item.mime_type && item.name?.includes(".")
      ? item.name.slice(item.name.lastIndexOf("."))
      : "";

  const {
    mutate: renameFile,
    isPending: pendingFile,
    isError: errorFile,
    error: errFile,
    reset: resetFile,
  } = useRenameFile(parentFolderId);

  const {
    mutate: renameFolder,
    isPending: pendingFolder,
    isError: errorFolder,
    error: errFolder,
    reset: resetFolder,
  } = useRenameFolder(parentFolderId);

  const isPending = pendingFile || pendingFolder;
  const isError = errorFile || errorFolder;
  const error = errFile || errFolder;

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.focus();
    if (ext) {
      const end = Math.max(item.name.length - ext.length, 0);
      el.setSelectionRange(0, end);
    } else {
      el.select();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !isPending) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPending, onClose]);

  const trimmed = value.trim();
  const finalName = () =>
    ext && !trimmed.toLowerCase().endsWith(ext.toLowerCase())
      ? trimmed + ext
      : trimmed;

  const canSave = trimmed && trimmed !== item.name;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSave || isPending) return;
    const mutate = item.mime_type ? renameFile : renameFolder;
    const reset = item.mime_type ? resetFile : resetFolder;
    mutate(
      { id: item.id, name: finalName() },
      { onSuccess: () => { reset(); onClose(); } },
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4 backdrop-blur-xs transition-opacity animate-in fade-in"
      onClick={() => {
        if (!isPending) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="rename-modal-title"
    >
      <div
        className="w-full max-w-md rounded-2xl bg-surface border border-line shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-line shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="grid place-items-center w-8 h-8 rounded-lg bg-accent-soft text-accent shrink-0">
              <Icon name="rename" size={17} />
            </span>
            <h2
              id="rename-modal-title"
              className="font-display text-base font-semibold tracking-tight text-ink truncate"
            >
              {isPending ? "Renaming…" : `Rename "${item.name}"`}
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isPending}
            className="grid place-items-center w-8 h-8 rounded-lg text-faint hover:bg-line/50 hover:text-ink transition-colors disabled:opacity-40 disabled:pointer-events-none shrink-0 cursor-pointer"
            aria-label="Close modal"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-5 py-5 space-y-3">
            {isError && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 flex items-start gap-3 animate-in fade-in">
                <div className="shrink-0 mt-0.5 w-4 h-4 rounded-full bg-red-200 text-red-800 grid place-items-center font-bold">
                  !
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-red-900">Couldn't rename</p>
                  <p className="mt-0.5 text-red-700">
                    {error?.message || "An unexpected error occurred."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => (item.mime_type ? resetFile() : resetFolder())}
                  className="shrink-0 font-medium text-red-800 hover:text-red-950 underline cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}

            <div className="flex items-center gap-2.5 px-3 h-11 rounded-xl border border-line bg-surface focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 transition">
              <TypeGlyph item={item} />
              <input
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                disabled={isPending}
                className="w-full bg-transparent text-sm font-medium outline-none disabled:opacity-60"
                spellCheck="false"
              />
            </div>

            {ext && trimmed && !trimmed.toLowerCase().endsWith(ext.toLowerCase()) && (
              <p className="text-xs text-faint px-1">
                Will save as <span className="font-medium text-mute">{finalName()}</span>
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2.5 px-5 py-4 border-t border-line shrink-0 bg-surface">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="h-9 px-4 rounded-xl border border-line text-sm font-medium text-mute hover:text-ink hover:bg-canvas transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSave || isPending}
              className="inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-all shadow-xs disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              {isPending ? (
                <>
                  <Spinner className="h-4 w-4 text-white" /> Saving…
                </>
              ) : (
                <>
                  <Icon name="check" size={16} strokeWidth={2.2} />
                  Save
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
