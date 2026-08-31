import { useEffect, useRef, useState } from "react";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import { GridView, ListView, FileIcon } from "./components/FileView";
import UploadModal from "./components/UploadModal";
import ShareModal from "./components/ShareModal";
import RenameModal from "./components/RenameModal";
import Spinner from "./components/Spinner";
import Icon from "./components/Icon";
import { fileTypeMeta, typeFromFileName, formatDate } from "./data/data.js";
import { useAuth } from "./Context/AuthContext.jsx";
import { useFiles, useViewFile, useDeleteFile } from "./hooks/useFiles.js";
import { useFolders, useDeleteFolder } from "./hooks/useFolders.js";
import { useStarred, useStar, useUnStar } from "./hooks/useStar.js";
import { filesApi } from "./api/files.js";

const sectionName = {
  drive: "My Drive",
  recent: "Recent",
  shared: "Shared with me",
  starred: "Starred",
};

const App = () => {
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [active, setActive] = useState("drive");
  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [shareTarget, setShareTarget] = useState(null);
  const [renameTarget, setRenameTarget] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmFolderId, setConfirmFolderId] = useState(null);
  const [folderHistory, setFolderHistory] = useState([]);
  const { user } = useAuth();

  const confirmTimerRef = useRef(null);

  useEffect(() => {
    if (confirmFolderId) {
      confirmTimerRef.current = setTimeout(
        () => setConfirmFolderId(null),
        2000,
      );
    }
    return () => clearTimeout(confirmTimerRef.current);
  }, [confirmFolderId]);

  const {
    data: files,
    isLoading: isLoadingFiles,
    isError: isErrorFiles,
  } = useFiles(currentFolderId);

  const { data: fileUrl, isLoading: isViewing } = useViewFile(selected?.id);

  const { mutate: deleteFile, isPending: isDeleting } =
    useDeleteFile(currentFolderId);

  const {
    data: folders,
    isLoading: isLoadingFolders,
    isError: isErrorFolders,
  } = useFolders(currentFolderId);

  const { mutate: deleteFolder, isPending: isDeletingFolder } =
    useDeleteFolder(currentFolderId);

  const { data: starredData, isLoading: isLoadingStarred } = useStarred();
  const { mutate: starItem } = useStar(currentFolderId);
  const { mutate: unStarItem } = useUnStar(currentFolderId);

  const isStarredView = active === "starred";

  const toggleStar = (item) => {
    if (item.starred) {
      if (item.mime_type) unStarItem({ fileId: item.id });
      else unStarItem({ folderId: item.id });
    } else if (item.mime_type) {
      starItem({ fileId: item.id });
    } else {
      starItem({ folderId: item.id });
    }
  };

  const handleSection = (id) => {
    setActive(id);
    setCurrentFolderId(null);
    setFolderHistory([]);
  };

  const handleItemClick = (item, isDouble) => {
    if (isDouble) {
      if (item.mime_type) {
        setConfirmDelete(false);
        setSelected(item);
      } else {
        setFolderHistory((h) => [
          ...h,
          { id: currentFolderId, section: active },
        ]);
        if (active !== "drive") setActive("drive");
        setCurrentFolderId(item.id);
      }
      return;
    }
    setConfirmDelete(false);
    setSelected(item);
  };

  const goBack = () => {
    if (folderHistory.length === 0) return;
    const prev = folderHistory[folderHistory.length - 1];
    setCurrentFolderId(prev.id);
    setActive(prev.section);
    setFolderHistory((h) => h.slice(0, -1));
  };

  const items = (() => {
    let list;
    if (isStarredView) {
      list = [
        ...(Array.isArray(starredData?.starredFolders)
          ? starredData.starredFolders
          : []),
        ...(Array.isArray(starredData?.starredFiles)
          ? starredData.starredFiles
          : []),
      ].map((i) => ({ ...i, starred: i.starred ?? true }));
    } else if (active === "recent") {
      list = [
        ...(Array.isArray(folders)
          ? folders.sort(
              (a, b) => new Date(b.updated_at) - new Date(a.updated_at),
            )
          : []),
        ...(Array.isArray(files)
          ? files.sort(
              (a, b) => new Date(b.updated_at) - new Date(a.updated_at),
            )
          : []),
      ];
    } else {
      list = [
        ...(Array.isArray(folders)
          ? folders.sort((a, b) => a.name.localeCompare(b.name))
          : []),
        ...(Array.isArray(files)
          ? files.sort((a, b) => a.name.localeCompare(b.name))
          : []),
      ];
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((f) => f.name.toLowerCase().includes(q));
    }
    return list;
  })();

  const starredIds = new Set([
    ...(Array.isArray(files) ? files : [])
      .filter((f) => f.starred)
      .map((f) => f.id),
    ...(isStarredView && Array.isArray(starredData?.starredFiles)
      ? starredData.starredFiles.map((i) => i.id)
      : []),
  ]);
  const selectedIsStarred = selected ? starredIds.has(selected.id) : false;

  const handleView = () => {
    if (!selected.mime_type) {
      closeModal();
      return handleItemClick(selected, true);
    }
    if (fileUrl) {
      window.open(fileUrl, "_blank");
    } else {
      alert("File not found");
    }
  };

  const handleDownload = async () => {
    try {
      const url = await filesApi.downloadFile(selected.id);
      window.open(url, "_blank");
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  const closeModal = () => {
    setSelected(null);
    setConfirmDelete(false);
    setConfirmFolderId(null);
  };

  const handleDelete = () => {
    deleteFile(selected.id, {
      onSuccess: () => closeModal(),
    });
  };

  const handleDeleteFolder = (id) => {
    if (confirmFolderId === id) {
      deleteFolder(id, {
        onSuccess: () => setConfirmFolderId(null),
      });
    } else {
      setConfirmFolderId(id);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        active={active}
        onSelect={handleSection}
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
          onBack={goBack}
          showBack={folderHistory.length > 0}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="px-4 md:px-8 py-6 max-w-6xl mx-auto">
            {(
              isStarredView
                ? isLoadingStarred
                : isLoadingFiles || isLoadingFolders
            ) ? (
              <div className="py-20 flex flex-col items-center justify-center text-center">
                <Spinner className="h-7 w-7 text-accent mb-3" />
                <p className="text-sm font-medium text-mute">Loading files…</p>
              </div>
            ) : !isStarredView && (isErrorFiles || isErrorFolders) ? (
              <div className="py-12 text-center text-red-500">
                Error loading files.
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-6">
                    {folderHistory.length > 0 && (
                      <button
                        onClick={goBack}
                        className="hidden lg:inline-flex ml-[-50%] items-center gap-1.5 text-base font-semibold text-mute hover:text-ink transition-colors cursor-pointer"
                      >
                        <Icon name="arrowLeft" size={19} />
                        Back
                      </button>
                    )}
                    <p className="text-sm text-faint">
                      {items.length} item{items.length === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>
                {view === "grid" ? (
                  <GridView
                    items={items}
                    onOpen={handleItemClick}
                    onDeleteFolder={handleDeleteFolder}
                    confirmDeleteId={confirmFolderId}
                    isDeletingFolder={isDeletingFolder}
                    onToggleStar={toggleStar}
                  />
                ) : (
                  <ListView
                    items={items}
                    onOpen={handleItemClick}
                    onDeleteFolder={handleDeleteFolder}
                    confirmDeleteId={confirmFolderId}
                    isDeletingFolder={isDeletingFolder}
                    onToggleStar={toggleStar}
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

      {shareTarget && (
        <ShareModal item={shareTarget} onClose={() => setShareTarget(null)} />
      )}

      {renameTarget && (
        <RenameModal
          parentFolderId={currentFolderId}
          item={renameTarget}
          onClose={() => setRenameTarget(null)}
        />
      )}

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-sm max-h-[calc(100vh-2rem)] overflow-auto rounded-2xl bg-surface border border-line shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4">
              <FileIcon file={selected} />
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-base font-semibold truncate">
                  {selected.name}
                </h2>
                <p className="mt-0.5 text-sm text-mute">
                  {!selected.mime_type
                    ? "Folder"
                    : fileTypeMeta[selected.mime_type]?.label ||
                      fileTypeMeta[typeFromFileName(selected.name || "")]
                        ?.label}
                  {selected.size ? ` · ${selected.size}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() =>
                    toggleStar({
                      ...selected,
                      starred: selectedIsStarred,
                    })
                  }
                  className={`grid place-items-center w-8 h-8 rounded-lg hover:bg-line/50 active:scale-90 transition-all ${
                    selectedIsStarred
                      ? "text-folder"
                      : "text-faint hover:text-ink"
                  }`}
                  aria-label={selectedIsStarred ? "Remove star" : "Add star"}
                >
                  <Icon
                    name="starred"
                    size={18}
                    strokeWidth={1.6}
                    fill={selectedIsStarred ? "currentColor" : "none"}
                  />
                </button>
                <button
                  onClick={closeModal}
                  className="grid place-items-center w-8 h-8 rounded-lg text-faint hover:bg-line/50 hover:text-ink"
                  aria-label="Close"
                >
                  <Icon name="close" />
                </button>
              </div>
            </div>

            <dl className="mt-5 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-faint">Owner</dt>
                <dd className="font-medium">{user.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-faint">Modified</dt>
                <dd className="font-medium">
                  {formatDate(
                    selected.updated_at ||
                      selected.created_at ||
                      selected.modified,
                    true,
                  ) || "—"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-faint">Type</dt>
                <dd className="font-medium">
                  {!selected.mime_type
                    ? "Folder"
                    : fileTypeMeta[selected.mime_type]?.label ||
                      fileTypeMeta[typeFromFileName(selected.name || "")]
                        ?.label}
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
              <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 h-10 rounded-lg border border-line text-sm font-medium hover:bg-canvas transition-colors"
              >
                <Icon name="download" size={16} /> Download
              </button>
              <button
                onClick={() => {
                  setRenameTarget(selected);
                  closeModal();
                }}
                className="flex items-center justify-center gap-2 h-10 rounded-lg border border-line text-sm font-medium hover:bg-canvas transition-colors cursor-pointer"
              >
                <Icon name="rename" size={16} /> Rename
              </button>
              <button
                onClick={() => {
                  setShareTarget(selected);
                  closeModal();
                }}
                className="flex items-center justify-center gap-2 h-10 rounded-lg border border-line text-sm font-medium hover:bg-canvas transition-colors"
              >
                <Icon name="share" size={16} /> Share
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
