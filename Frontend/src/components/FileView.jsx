import Icon from "./Icon";
import { getFileDisplay, formatBytes } from "../data/data.js";

function FolderGlyph({ color }) {
  return (
    <span className="relative grid place-items-center w-11 h-11 rounded-xl bg-folder-soft text-folder shrink-0">
      <Icon name="folder" size={26} fill={color} />
    </span>
  );
}

function FileGlyph({ meta }) {
  return (
    <span className="relative grid place-items-center w-11 h-11 rounded-xl bg-surface border border-line text-mute shrink-0">
      <Icon name={meta.icon} size={24} />
      <span
        className="absolute -bottom-0.5 right-0.5 w-3 h-3 rounded-sm border-2 border-surface"
        style={{ backgroundColor: meta.dot }}
      />
    </span>
  );
}

export function FileIcon({ file }) {
  if (!file) return null;
  const { isFolder, meta } = getFileDisplay(file);
  return isFolder ? (
    <FolderGlyph color={file.color} />
  ) : (
    <FileGlyph meta={meta} />
  );
}

export function GridView({ items, onToggleStar, onOpen }) {
  if (items.length === 0) {
    return <EmptyState />;
  }
  return (
    <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
      {items.map((file) => {
        const { isFolder, meta } = getFileDisplay(file);
        return (
          <div
            key={file.id}
            className="group rounded-2xl border border-line bg-surface p-4 hover:border-accent/40 hover:shadow-md transition-all cursor-pointer"
            onClick={() => onOpen(file)}
          >
            <div className="flex justify-between">
              <FileIcon file={file} />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  /*onToggleStar(file.id)*/
                }}
                className={`grid place-items-center w-8 h-8 rounded-lg transition-colors ${
                  file.starred
                    ? "text-amber-400 hover:bg-amber-50"
                    : "text-faint opacity-0 group-hover:opacity-100 hover:bg-line/50 hover:text-ink"
                }`}
                aria-label={file.starred ? "Remove star" : "Star"}
              >
                <Icon name="starred" size={18} strokeWidth={1.6} />
              </button>
            </div>

            <p
              className="mt-3 text-sm font-semibold truncate"
              title={file.name}
            >
              {file.name}
            </p>
            <p className="mt-0.5 text-xs text-faint">
              {isFolder
                ? "Folder"
                : `${meta.label}${file.size ? ` · ${formatBytes(file.size)}` : ""}`}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export function ListView({ items, onToggleStar, onOpen }) {
  if (items.length === 0) {
    return <EmptyState />;
  }
  return (
    <div className="rounded-2xl border border-line bg-surface overflow-hidden">
      <div className="grid grid-cols-[minmax(0,1fr)_150px_120px] gap-4 px-5 py-2.5 text-xs font-medium text-faint uppercase tracking-wide border-b border-line max-sm:hidden">
        <span>Name</span>
        <span>Size</span>
        <span>Modified</span>
      </div>
      {items.map((file) => {
        const { isFolder, meta } = getFileDisplay(file);
        return (
          <div
            key={file.id}
            className="grid grid-cols-[minmax(0,1fr)_150px_120px] items-center gap-4 px-5 py-3 border-b border-line last:border-b-0 hover:bg-accent-soft/40 transition-colors cursor-pointer"
            onClick={() => onOpen(file)}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <FileIcon file={file} />
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{file.name}</p>
                <p className="text-xs text-faint sm:hidden truncate">
                  {isFolder
                    ? "Folder"
                    : `${meta.label}${file.size ? ` · ${formatBytes(file.size)}` : ""}`}
                  {file.updated_at || file.modified
                    ? ` · ${file.updated_at || file.modified}`
                    : ""}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  /*onToggleStar(file.id)*/
                }}
                className={`ml-auto shrink-0 grid place-items-center w-8 h-8 rounded-lg transition-colors sm:hidden ${
                  file.starred
                    ? "text-amber-400 hover:bg-amber-50"
                    : "text-faint opacity-0 group-hover:opacity-100 hover:bg-line/50 hover:text-ink"
                }`}
                aria-label={file.starred ? "Remove star" : "Star"}
              >
                <Icon name="starred" size={17} strokeWidth={1.6} />
              </button>
            </div>
            <span className="text-sm text-mute hidden sm:block">
              {isFolder ? "—" :formatBytes (file.size) || "—"}
            </span>
            <span className="text-sm text-mute hidden sm:block">
              {file.updated_at || file.modified || "—"}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <span className="grid place-items-center w-14 h-14 rounded-2xl bg-surface border border-line text-faint mb-4">
        <Icon name="search" size={26} />
      </span>
      <p className="font-display text-lg font-semibold">Nothing here</p>
      <p className="mt-1 text-sm text-mute">
        Try a different search or move files here.
      </p>
    </div>
  );
}
