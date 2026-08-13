import { useState } from 'react'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import { GridView, ListView, FileIcon } from './components/FileView'
import UploadModal from './components/UploadModal'
import Icon from './components/Icon'
import { files, fileTypeMeta } from './data/data.js'

const sectionName = { drive: 'My Drive', shared: 'Shared', recent: 'Recent', starred: 'Starred', trash: 'Trash' }

const App = () => {
  const [active, setActive] = useState('drive')
  const [view, setView] = useState('grid')
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [, setBump] = useState(0)

  const items = (() => {
    let list = [...files]
    if (active === 'starred') list = list.filter((f) => f.starred)
    if (active === 'shared') list = list.filter((f) => f.owner !== 'me')
    if (active === 'trash') list = []
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((f) => f.name.toLowerCase().includes(q))
    }
    return list
  })()

  const toggleStar = (id) => {
    const f = files.find((x) => x.id === id)
    if (f) {
      f.starred = !f.starred
      setSelected((s) => (s && s.id === id ? { ...s, starred: f.starred } : s))
    }
    setBump((n) => n + 1)
  }

  const addFiles = (newOnes) => {
    files.push(...newOnes)
    setBump((n) => n + 1)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar active={active} onSelect={setActive} open={open} onToggle={() => setOpen(false)} />

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
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-faint">
                {items.length} item{items.length === 1 ? '' : 's'}
              </p>
            </div>

            {view === 'grid' ? (
              <GridView items={items} onToggleStar={toggleStar} onOpen={setSelected} />
            ) : (
              <ListView items={items} onToggleStar={toggleStar} onOpen={setSelected} />
            )}
          </div>
        </main>
      </div>

      {uploadOpen && (
        <UploadModal onClose={() => setUploadOpen(false)} onComplete={addFiles} />
      )}

      {selected && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-surface border border-line shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4">
              <FileIcon file={selected} />
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-base font-semibold truncate">{selected.name}</h2>
                <p className="mt-0.5 text-sm text-mute">
                  {fileTypeMeta[selected.type].label}
                  {selected.size ? ` · ${selected.size}` : ''}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="grid place-items-center w-8 h-8 rounded-lg text-faint hover:bg-line/50 hover:text-ink"
                aria-label="Close"
              >
                <Icon name="close" />
              </button>
            </div>

            <dl className="mt-5 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-faint">Owner</dt>
                <dd className="font-medium">{selected.owner}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-faint">Modified</dt>
                <dd className="font-medium">{selected.modified}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-faint">Type</dt>
                <dd className="font-medium">{fileTypeMeta[selected.type].label}</dd>
              </div>
            </dl>

            <div className="mt-6 grid grid-cols-2 gap-2.5">
              <button className="flex items-center justify-center gap-2 h-10 rounded-lg border border-line text-sm font-medium hover:bg-canvas transition-colors">
                <Icon name="view" size={17} /> View
              </button>
              <button className="flex items-center justify-center gap-2 h-10 rounded-lg border border-line text-sm font-medium hover:bg-canvas transition-colors">
                <Icon name="download" size={16} /> Download
              </button>
              <button className="flex items-center justify-center gap-2 h-10 rounded-lg border border-line text-sm font-medium hover:bg-canvas transition-colors">
                <Icon name="rename" size={16} /> Rename
              </button>
              <button
                onClick={() => toggleStar(selected.id)}
                className="flex items-center justify-center gap-2 h-10 rounded-lg border border-line text-sm font-medium hover:bg-canvas transition-colors"
              >
                <Icon name="starred" size={16} />
                {selected.starred ? 'Unstar' : 'Star'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App;