import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import { GridView, ListView, FileIcon } from "./components/FileView";
import UploadModal from "./components/UploadModal";
import Spinner from "./components/Spinner";
import Icon from "./components/Icon";
import { fileTypeMeta, typeFromFileName } from "./data/data.js";

import { useFiles, useViewFile, useDeleteFile } from "./hooks/useFiles.js";

const sectionName = {
  drive: "My Drive",
  recent: "Recent",
  starred: "Starred",
  trash: "Trash",
};

const App = () => {
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [active, setActive] = useState("drive");
  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [, setBump] = useState(0);

  const {
    data: files,
    isLoading: isLoadingFiles,
    isError: isErrorFiles,
  } = useFiles(currentFolderId);
  const { data: fileUrl, isLoading: isViewing } = useViewFile(selected?.id);
  const { mutate: deleteFile, isPending: isDeleting } = useDeleteFile(
    selected?.id,
    currentFolderId,
  );
  useEffect(() => {
    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
    };
  }, [fileUrl]);

  const handleItemClick = (item) => {
    if (item.type === "folder" || item.mime_type === "folder") {
      setCurrentFolderId(item.id);
    } else {
      setConfirmDelete(false);
      setSelected(item);
    }
  };

  const items = (() => {
    let list = Array.isArray(files) ? [...files] : [];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((f) => f.name.toLowerCase().includes(q));
    }
    return list;
  })();

  const handleView = () => {
    if (fileUrl) {
      window.open(fileUrl, "_blank");
    } else {
      alert("File not found");
    }
  };

  const toggleStar = (id) => {
    const f = files.find((x) => x.id === id);
    if (f) {
      f.starred = !f.starred;
      setSelected((s) => (s && s.id === id ? { ...s, starred: f.starred } : s));
    }
    setBump((n) => n + 1);
  };

  const closeModal = () => {
    setSelected(null);
    setConfirmDelete(false);
  };

  const handleDelete = () => {
    deleteFile(selected.id, {
      onSuccess: () => closeModal(),
    });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        active={active}
        onSelect={setActive}
        open={open}
        onToggle={() => setOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          search={search}
          onSearch={setSearch}
          view={view}
          onView={setView}
          onNew={() => setUploadOpen(true)}
          onMenu={() => setOpen(true)}
          activeLabel={sectionName[active]}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="px-4 md:px-8 py-6 max-w-6xl mx-auto">
            {isLoadingFiles ? (
              <div className="py-20 flex flex-col items-center justify-center text-center">
                <Spinner className="h-7 w-7 text-accent mb-3" />
                <p className="text-sm font-medium text-mute">Loading files…</p>
              </div>
            ) : isErrorFiles ? (
              <div className="py-12 text-center text-red-500">
                Error loading files.
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5">
                  <p className="text-sm text-faint">
                    {items.length} item{items.length === 1 ? "" : "s"}
                  </p>
                </div>
                {view === "grid" ? (
                  <GridView
                    items={items}
                    onToggleStar={toggleStar}
                    onOpen={handleItemClick}
                  />
                ) : (
                  <ListView
                    items={items}
                    onToggleStar={toggleStar}
                    onOpen={handleItemClick}
                  />
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {uploadOpen && (
        <UploadModal
          folderId={currentFolderId}
          onClose={() => setUploadOpen(false)}
        />
      )}

      {selected && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-surface border border-line shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4">
              <FileIcon file={selected} />
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-base font-semibold truncate">
                  {selected.name}
                </h2>
                <p className="mt-0.5 text-sm text-mute">
                  {fileTypeMeta[selected.mime_type]?.label || fileTypeMeta[selected.type]?.label || fileTypeMeta[typeFromFileName(selected.name || "")]?.label || "File"}
                  {selected.size ? ` · ${selected.size}` : ""}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="grid place-items-center w-8 h-8 rounded-lg text-faint hover:bg-line/50 hover:text-ink"
                aria-label="Close"
              >
                <Icon name="close" />
              </button>
            </div>

            <dl className="mt-5 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-faint">Owner</dt>
                <dd className="font-medium">Me</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-faint">Modified</dt>
                <dd className="font-medium">{selected.created_at || selected.updated_at || selected.modified || "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-faint">Type</dt>
                <dd className="font-medium">
                  {fileTypeMeta[selected.mime_type]?.label || fileTypeMeta[selected.type]?.label || fileTypeMeta[typeFromFileName(selected.name || "")]?.label || "File"}
                </dd>
              </div>
            </dl>

            <div className="mt-6 grid grid-cols-2 gap-2.5">
              <button
                onClick={handleView}
                disabled={isViewing}
                className="flex items-center justify-center gap-2 h-10 rounded-lg border border-line text-sm font-medium hover:bg-canvas transition-colors disabled:opacity-60 cursor-pointer"
              >
                {isViewing ? (
                  <>
                    <Spinner className="h-4 w-4 text-accent" />
                    <span>Opening…</span>
                  </>
                ) : (
                  <>
                    <Icon name="view" size={17} />
                    <span>View</span>
                  </>
                )}
              </button>
              <button className="flex items-center justify-center gap-2 h-10 rounded-lg border border-line text-sm font-medium hover:bg-canvas transition-colors">
                <Icon name="download" size={16} /> Download
              </button>
              <button className="flex items-center justify-center gap-2 h-10 rounded-lg border border-line text-sm font-medium hover:bg-canvas transition-colors">
                <Icon name="rename" size={16} /> Rename
              </button>
              <button
                /*onClick={() => toggleStar(selected.id)}*/
                className="flex items-center justify-center gap-2 h-10 rounded-lg border border-line text-sm font-medium hover:bg-canvas transition-colors"
              >
                <Icon name="starred" size={16} />
                {selected.starred ? "Unstar" : "Star"}
              </button>
            </div>

            <div className="mt-4 border-t border-line pt-4">
              <button
                onClick={
                  confirmDelete ? handleDelete : () => setConfirmDelete(true)
                }
                disabled={isDeleting}
                className={`w-full inline-flex items-center justify-center gap-2 h-10 rounded-lg border text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                  confirmDelete
                    ? "border-red-600 bg-red-600 text-white hover:bg-red-700"
                    : "border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50"
                }`}
              >
                {isDeleting ? (
                  <>
                    <Spinner className="h-4 w-4 text-white" />
                    <span>Deleting…</span>
                  </>
                ) : confirmDelete ? (
                  <>
                    <Icon name="trash" size={16} />
                    <span>Confirm delete</span>
                  </>
                ) : (
                  <>
                    <Icon name="trash" size={16} />
                    <span>Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
