import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import Spinner from "./Spinner.jsx";
import { FileIcon } from "./FileView";
import { getFileDisplay, formatBytes } from "../data/data.js";
import { useShareItem } from "../hooks/useShares.js";

const PERMISSIONS = [
  { value: "viewer", label: "Can view", icon: "eye" },
  { value: "editor", label: "Can edit", icon: "rename" },
];

export default function ShareModal({ item, onClose }) {
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState("viewer");
  const timerRef = useRef(null);

  const {
    mutate: share,
    isPending,
    isSuccess,
    isError,
    error,
    reset,
  } = useShareItem();

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !isPending) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPending, onClose]);

  const { isFolder, metaLabel } = getFileDisplay(item);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || isPending) return;
    share(
      {
        fileId: isFolder ? null : item.id,
        folderId: isFolder ? item.id : null,
        targetEmail: email.trim(),
        permission,
      },
      {
        onSuccess: () => {
          timerRef.current = setTimeout(onClose, 1600);
        },
      },
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
      aria-labelledby="share-modal-title"
    >
      <div
        className="w-full max-w-md rounded-2xl bg-surface border border-line shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-line shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="grid place-items-center w-8 h-8 rounded-lg bg-accent-soft text-accent shrink-0">
              <Icon name="share" size={17} />
            </span>
            <h2
              id="share-modal-title"
              className="font-display text-base font-semibold tracking-tight text-ink truncate"
            >
              {isSuccess
                ? "Shared"
                : isPending
                  ? "Sharing…"
                  : `Share "${item.name}"`}
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

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          <div className="rounded-2xl border border-line bg-canvas p-4">
            <div className="flex items-center gap-3">
              <FileIcon file={item} />
              <div className="min-w-0 flex-1">
                <p
                  className="text-sm font-semibold text-ink truncate"
                  title={item.name}
                >
                  {item.name}
                </p>
                <p className="text-xs text-mute mt-0.5">
                  {metaLabel}
                  {!isFolder && item.size ? ` · ${formatBytes(item.size)}` : ""}
                </p>
              </div>
            </div>
          </div>

          {isSuccess && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 flex items-center gap-2.5 animate-in fade-in">
              <span className="grid place-items-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 shrink-0">
                <Icon name="check" size={13} strokeWidth={2.5} />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-emerald-900">
                  Shared with {email.trim()}
                </p>
                <p className="text-xs text-emerald-700 mt-0.5 truncate">
                  They'll find it under Shared with me.
                </p>
              </div>
            </div>
          )}

          {isError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 flex items-start gap-3 animate-in fade-in">
              <div className="shrink-0 mt-0.5 w-4 h-4 rounded-full bg-red-200 text-red-800 grid place-items-center font-bold">
                !
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-red-900">Couldn't share</p>
                <p className="mt-0.5 text-red-700">
                  {error?.message || "An unexpected error occurred."}
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

          {!isSuccess && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-2.5 px-3 h-10 rounded-xl border border-line bg-surface focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 transition">
                <Icon name="user" size={17} className="text-faint shrink-0" />
                <input
                  autoFocus
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-faint"
                />
              </div>

              <div className="flex gap-1 p-1 rounded-xl border border-line bg-canvas">
                {PERMISSIONS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPermission(p.value)}
                    className={`flex-1 inline-flex items-center justify-center gap-1.5 h-8 rounded-lg text-sm transition-colors cursor-pointer ${
                      permission === p.value
                        ? "bg-accent-soft text-accent font-semibold"
                        : "text-mute hover:bg-line/50"
                    }`}
                  >
                    <Icon name={p.icon} size={15} />
                    {p.label}
                  </button>
                ))}
              </div>

              <button type="submit" hidden />
            </form>
          )}
        </div>

        <div className="flex items-center justify-end gap-2.5 px-5 py-4 border-t border-line shrink-0 bg-surface">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="h-9 px-4 rounded-xl border border-line text-sm font-medium text-mute hover:text-ink hover:bg-canvas transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          >
            {isSuccess ? "Done" : "Cancel"}
          </button>

          {!isSuccess && (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!email.trim() || isPending}
              className="inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-all shadow-xs disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              {isPending ? (
                <>
                  <Spinner className="h-4 w-4 text-white" /> Sharing…
                </>
              ) : (
                <>
                  <Icon name="share" size={16} />
                  Share
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
