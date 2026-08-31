import Icon from "./Icon";
import Spinner from "./Spinner";
import { getFileDisplay, formatBytes, formatDate } from "../data/data.js";
import { useClickActions } from "../hooks/useClickActions.js";

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

function StarButton({ item, onToggleStar }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggleStar(item);
      }}
      className={`grid place-items-center w-8 h-8 rounded-lg hover:bg-line/50 active:scale-90 transition-all ${
        item.starred ? "text-folder" : "text-faint hover:text-ink"
      }`}
      aria-label={item.starred ? "Remove star" : "Add star"}
    >
      <Icon
        name="starred"
        size={17}
        strokeWidth={1.6}
        fill={item.starred ? "currentColor" : "none"}
      />
    </button>
  );
}

export function GridView({
  items,
  onOpen,
  onDeleteFolder,
  confirmDeleteId,
  isDeletingFolder,
  onToggleStar,
}) {
  if (items.length === 0) {
    return <EmptyState />;
  }
  return (
    <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
      {items.map((item) => {
        const { isFolder, meta } = getFileDisplay(item);
        return (
          <Clickable
            key={item.id}
            item={item}
            className="group rounded-2xl border border-line bg-surface p-4 hover:border-accent/40 hover:shadow-md transition-all cursor-pointer"
            onOpen={onOpen}
          >
            <div className="flex justify-between">
              <FileIcon file={item} />
              {isFolder ? (
                confirmDeleteId === item.id ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteFolder(item.id);
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 h-8 rounded-lg bg-red-600 text-white text-xs font-semibold transition-colors"
                    title="Click again to delete"
                  >
                    {isDeletingFolder ? (
                      <Spinner className="h-3.5 w-3.5" />
                    ) : (
                      <Icon name="trash" size={14} />
                    )}
                    Click again
                  </button>
                ) : (
                  <div
                    className={`flex gap-0.5 transition-opacity ${
                      item.starred ? "" : "opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    <StarButton item={item} onToggleStar={onToggleStar} />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteFolder(item.id);
                      }}
                      className="grid place-items-center w-8 h-8 rounded-lg text-faint hover:bg-line/50 hover:text-red-600 transition-colors"
                      title="Delete folder"
                      aria-label="Delete folder"
                    >
                      <Icon name="trash" size={17} />
                    </button>
                  </div>
                )
              ) : (
                <div
                  className={`flex gap-0.5 transition-opacity ${
                    item.starred ? "" : "opacity-0 group-hover:opacity-100"
                  }`}
                >
                  <StarButton item={item} onToggleStar={onToggleStar} />
                </div>
              )}
            </div>

            <p
              className="mt-3 text-sm font-semibold truncate"
              title={item.name}
            >
              {item.name}
            </p>
            <p className="mt-0.5 text-xs text-faint">
              {isFolder
                ? "Folder"
                : `${meta.label}${item.size ? ` · ${formatBytes(item.size)}` : ""}`}
            </p>
          </Clickable>
        );
      })}
    </div>
  );
}

function Clickable({ item, onOpen, className, children }) {
  const { handleClick } = useClickActions({
    onSingle: () => onOpen(item),
    onDouble: () => onOpen(item, true),
  });
  return (
    <div className={className} onClick={(e) => { e.stopPropagation(); handleClick(); }}>
      {children}
    </div>
  );
}

export function ListView({
  items,
  onOpen,
  onDeleteFolder,
  confirmDeleteId,
  isDeletingFolder,
  onToggleStar,
}) {
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
      {items.map((item) => {
        const { isFolder, meta } = getFileDisplay(item);
        return (
          <Clickable
            key={item.id}
            item={item}
            className="group grid grid-cols-[minmax(0,1fr)_150px_120px] items-center gap-4 px-5 py-3 border-b border-line last:border-b-0 hover:bg-accent-soft/40 transition-colors cursor-pointer"
            onOpen={onOpen}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <FileIcon file={item} />
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{item.name}</p>
                <p className="text-xs text-faint sm:hidden truncate">
                  {isFolder
                    ? "Folder"
                    : `${meta.label}${item.size ? ` · ${formatBytes(item.size)}` : ""}`}
                  {item.updated_at ? ` · ${formatDate(item.updated_at)}` : ""}
                </p>
              </div>
              {isFolder ? (
                confirmDeleteId === item.id ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteFolder(item.id);
                    }}
                    className="ml-auto shrink-0 inline-flex items-center gap-1.5 px-2.5 h-8 rounded-lg bg-red-600 text-white text-xs font-semibold transition-colors"
                    title="Click again to delete"
                  >
                    {isDeletingFolder ? (
                      <Spinner className="h-3.5 w-3.5" />
                    ) : (
                      <Icon name="trash" size={14} />
                    )}
                    Click again
                  </button>
                ) : (
                  <div
                    className={`ml-auto flex gap-0.5 shrink-0 transition-opacity ${
                      item.starred ? "" : "opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    <StarButton item={item} onToggleStar={onToggleStar} />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteFolder(item.id);
                      }}
                      className="grid place-items-center w-8 h-8 rounded-lg text-faint hover:bg-line/50 hover:text-red-600 transition-colors"
                      title="Delete folder"
                      aria-label="Delete folder"
                    >
                      <Icon name="trash" size={17} />
                    </button>
                  </div>
                )
              ) : (
                <div
                  className={`ml-auto flex gap-0.5 shrink-0 transition-opacity ${
                    item.starred ? "" : "opacity-0 group-hover:opacity-100"
                  }`}
                >
                  <StarButton item={item} onToggleStar={onToggleStar} />
                </div>
              )}
            </div>
            <span className="text-sm text-mute hidden sm:block">
              {isFolder ? "—" : formatBytes(item.size) || "—"}
            </span>
            <span className="text-sm text-mute hidden sm:block">
              {formatDate(item.updated_at || item.modified) || "—"}
            </span>
          </Clickable>
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
