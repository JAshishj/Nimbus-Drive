import { useEffect, useRef, useState } from 'react'
import Icon from './Icon'
import { FileIcon } from './FileView'
import { makeFile, makeFolder, formatBytes, typeFromFileName } from '../data/data.js'

const STAGE = { pick: 'pick', upload: 'upload', done: 'done' }

export default function UploadModal({ onClose, onComplete }) {
  const [stage, setStage] = useState(STAGE.pick)
  const [pending, setPending] = useState([]) // File objects chosen but not uploaded
  const [queue, setQueue] = useState([]) // { file, progress } being uploaded
  const [folderName, setFolderName] = useState('')
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  const overall =
    queue.length > 0
      ? Math.round(queue.reduce((sum, q) => sum + q.progress, 0) / queue.length)
      : 0

  const addFiles = (fileList) => {
    const fresh = Array.from(fileList).filter(
      (f) => !pending.some((p) => p.name === f.name && p.size === f.size)
    )
    if (fresh.length) setPending((prev) => [...prev, ...fresh])
  }

  const startUpload = () => {
    if (pending.length === 0) return
    setQueue(pending.map((f) => ({ file: f, progress: 0 })))
    setStage(STAGE.upload)
  }

  useEffect(() => {
    if (stage !== STAGE.upload) return
    const id = setInterval(() => {
      setQueue((prev) => {
        const uploadsDone = prev.every((q) => q.progress >= 100)
        if (uploadsDone) {
          clearInterval(id)
          return prev
        }
        return prev.map((q) => {
          if (q.progress >= 100) return q
          const step = Math.random() * 18 + 6
          return { ...q, progress: Math.min(100, q.progress + step) }
        })
      })
    }, 160)
    return () => clearInterval(id)
  }, [stage])

  useEffect(() => {
    if (stage === STAGE.upload && queue.length > 0 && queue.every((q) => q.progress >= 100)) {
      const timer = setTimeout(() => {
        onComplete(queue.map((q) => makeFile(q.file.name, q.file.size)))
        setStage(STAGE.done)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [stage, queue, onComplete])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const createFolder = (e) => {
    e.preventDefault()
    const name = folderName.trim()
    if (!name) return
    onComplete([makeFolder(name)])
    setFolderName('')
    setStage(STAGE.done)
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-surface border border-line shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-line shrink-0">
          <h2 className="font-display text-base font-semibold tracking-tight">
            {stage === STAGE.pick && 'Add to My Drive'}
            {stage === STAGE.upload && 'Uploading…'}
            {stage === STAGE.done && 'All done'}
          </h2>
          <button
            onClick={onClose}
            className="grid place-items-center w-8 h-8 rounded-lg text-faint hover:bg-line/50 hover:text-ink transition-colors"
            aria-label="Close"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {stage === STAGE.pick && (
            <div className="space-y-4">
              <div
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragging(true)
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setDragging(false)
                  addFiles(e.dataTransfer.files)
                }}
                onClick={() => inputRef.current?.click()}
                className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
                  dragging
                    ? 'border-accent bg-accent-soft'
                    : 'border-line hover:border-accent/50 hover:bg-canvas'
                }`}
              >
                <span className="mx-auto grid place-items-center w-12 h-12 rounded-full bg-accent-soft text-accent mb-3">
                  <Icon name="upload" size={22} />
                </span>
                <p className="text-sm font-semibold">
                  Drag &amp; drop files here
                </p>
                <p className="mt-1 text-xs text-faint">
                  or click to browse your computer
                </p>
                <input
                  ref={inputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    addFiles(e.target.files)
                    e.target.value = ''
                  }}
                />
              </div>

              <form onSubmit={createFolder} className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2.5 px-3 h-10 rounded-xl border border-line focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 transition">
                  <Icon name="folder" size={18} className="text-faint shrink-0" />
                  <input
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    placeholder="Name a new folder"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-faint"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!folderName.trim()}
                  className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-line text-sm font-medium hover:bg-canvas transition-colors disabled:opacity-40 disabled:pointer-events-none"
                >
                  <Icon name="plus" size={17} strokeWidth={2} />
                  Folder
                </button>
              </form>

              {pending.length > 0 && (
                <div className="rounded-xl border border-line divide-y divide-line">
                  <p className="px-4 py-2.5 text-xs font-medium text-faint uppercase tracking-wide">
                    Ready to upload · {pending.length} file{pending.length === 1 ? '' : 's'}
                  </p>
                  {pending.map((f) => (
                    <div key={`${f.name}-${f.size}`} className="flex items-center gap-3 px-4 py-2.5">
                      <FileIcon file={{ type: typeFromFileName(f.name) }} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{f.name}</p>
                        <p className="text-xs text-faint">{formatBytes(f.size)}</p>
                      </div>
                      <button
                        onClick={() =>
                          setPending((prev) =>
                            prev.filter((p) => !(p.name === f.name && p.size === f.size))
                          )
                        }
                        className="grid place-items-center w-7 h-7 rounded-lg text-faint hover:bg-line/50 hover:text-ink transition-colors"
                        aria-label={`Remove ${f.name}`}
                      >
                        <Icon name="close" size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {stage === STAGE.upload && (
            <div className="space-y-4">
              <div className="rounded-xl border border-line p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold">Uploading {queue.length} file{queue.length === 1 ? '' : 's'}</span>
                  <span className="font-display font-semibold tabular-nums">{overall}%</span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-line overflow-hidden">
                  <div
                    className="h-full rounded-full bg-accent transition-all duration-200"
                    style={{ width: `${overall}%` }}
                  />
                </div>
              </div>

              <div className="rounded-xl border border-line divide-y divide-line">
                {queue.map((q) => (
                  <div key={`${q.file.name}-${q.file.size}`} className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <FileIcon file={{ type: typeFromFileName(q.file.name) }} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{q.file.name}</p>
                        <p className="text-xs text-faint">{formatBytes(q.file.size)}</p>
                      </div>
                      <span className="text-sm font-medium tabular-nums text-mute">
                        {Math.round(q.progress)}%
                      </span>
                    </div>
                    <div className="mt-2 h-1 rounded-full bg-line overflow-hidden">
                      <div
                        className="h-full rounded-full bg-accent transition-all duration-200"
                        style={{ width: `${q.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {stage === STAGE.done && (
            <div className="py-10 text-center">
              <span className="mx-auto grid place-items-center w-14 h-14 rounded-full bg-accent-soft text-accent mb-4">
                <Icon name="check" size={28} strokeWidth={2.4} />
              </span>
              <p className="font-display text-lg font-semibold tracking-tight">
                {folderName ? 'Folder created' : 'Upload complete'}
              </p>
              <p className="mt-1 text-sm text-mute">
                {folderName
                  ? `“${folderName}” was added to My Drive.`
                  : `${queue.length} file${queue.length === 1 ? '' : 's'} added to My Drive.`}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2.5 px-5 py-4 border-t border-line shrink-0">
          {stage === STAGE.pick && (
            <>
              <button
                onClick={onClose}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-line text-sm font-medium hover:bg-canvas transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={startUpload}
                disabled={pending.length === 0}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-[#185275] transition-colors disabled:opacity-40 disabled:pointer-events-none"
              >
                <Icon name="upload" size={17} />
                Upload {pending.length > 0 && `${pending.length} file${pending.length === 1 ? '' : 's'}`}
              </button>
            </>
          )}
          {stage === STAGE.upload && (
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-line text-sm font-medium hover:bg-canvas transition-colors"
            >
              Cancel upload
            </button>
          )}
          {stage === STAGE.done && (
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-[#185275] transition-colors"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  )
}