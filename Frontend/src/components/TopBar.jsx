import Icon from './Icon'

export default function TopBar({
  search,
  onSearch,
  view,
  onView,
  onNew,
  onMenu,
  activeLabel,
  onBack,
  showBack,
}) {
  return (
    <header className="flex items-center gap-3 px-4 md:px-6 h-16 shrink-0 border-b border-line bg-canvas/80 backdrop-blur">
      {showBack && (
        <button
          onClick={onBack}
          className="lg:hidden grid place-items-center w-10 h-10 rounded-lg text-mute hover:bg-line/50"
          aria-label="Go back"
        >
          <Icon name="arrowLeft" size={20} />
        </button>
      )}
      <button
        onClick={onMenu}
        className="lg:hidden grid place-items-center w-10 h-10 rounded-lg text-mute hover:bg-line/50"
        aria-label="Open menu"
      >
        <Icon name="menu" />
      </button>

      <h1 className="font-display text-lg font-semibold tracking-tight hidden sm:block">
        {activeLabel}
      </h1>

      <div className="flex-1 flex justify-center px-2">
        <div className="w-full max-w-md flex items-center gap-2.5 px-3.5 h-10 rounded-full bg-surface border border-line focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 transition">
          <Icon name="search" size={18} className="text-faint shrink-0" />
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search in drive"
            className="w-full bg-transparent text-sm outline-none placeholder:text-faint"
            aria-label="Search"
          />
        </div>
      </div>

      <div className="hidden md:flex items-center gap-1 rounded-lg border border-line bg-surface p-1">
        <button
          onClick={() => onView('grid')}
          className={`grid place-items-center w-9 h-8 rounded-md transition-colors ${
            view === 'grid' ? 'bg-accent-soft text-accent' : 'text-faint hover:text-ink'
          }`}
          aria-label="Grid view"
        >
          <Icon name="grid" size={17} />
        </button>
        <button
          onClick={() => onView('list')}
          className={`grid place-items-center w-9 h-8 rounded-md transition-colors ${
            view === 'list' ? 'bg-accent-soft text-accent' : 'text-faint hover:text-ink'
          }`}
          aria-label="List view"
        >
          <Icon name="list" size={17} />
        </button>
      </div>

      <button
        onClick={onNew}
        className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-accent text-white text-sm font-semibold shadow-sm hover:bg-[#185275] transition-colors"
      >
        <Icon name="plus" size={18} strokeWidth={2.2} />
        <span className="hidden sm:inline">New</span>
      </button>
    </header>
  )
}