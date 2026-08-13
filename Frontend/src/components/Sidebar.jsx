import { Link } from 'react-router-dom'
import Icon from './Icon'
import { sections } from '../data/data.js'

export default function Sidebar({ active, onSelect, open, onToggle }) {
  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-ink/30 lg:hidden transition-opacity ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onToggle}
        aria-hidden="true"
      />

      <aside
        className={`fixed z-40 lg:static inset-y-0 left-0 w-64 shrink-0 transform bg-canvas border-r border-line transition-transform duration-200 lg:translate-x-0 flex flex-col ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-3 px-5 h-16 shrink-0">
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-accent text-white shadow-sm">
            <Icon name="drive" size={20} />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">Nimbus</span>
          <button
            onClick={onToggle}
            className="lg:hidden grid place-items-center w-8 h-8 rounded-lg text-faint hover:bg-line/50 hover:text-ink ml-auto"
            aria-label="Close menu"
          >
            <Icon name="close" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active === s.id
                  ? 'bg-accent-soft text-accent'
                  : 'text-mute hover:bg-line/50 hover:text-ink'
              }`}
              aria-current={active === s.id ? 'page' : undefined}
            >
              <Icon name={s.icon} size={19} />
              {s.label}
            </button>
          ))}
        </nav>

        <div className="px-5 pb-5 shrink-0">
          <div className="rounded-xl border border-line bg-surface p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Storage</span>
              <span className="text-faint">62%</span>
            </div>
            <div className="mt-2.5 h-1.5 rounded-full bg-line overflow-hidden">
              <div className="h-full w-[62%] rounded-full bg-accent" />
            </div>
            <p className="mt-2.5 text-xs text-faint">7.4 GB of 15 GB used</p>
          </div>

          <Link
            to="/login"
            className="mt-3 w-full flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-sm text-mute hover:bg-line/50 hover:text-ink transition-colors font-medium"
          >
            <Icon name="settings" size={19} />
            Settings
          </Link>
          <Link
            to="/login"
            className="mt-1 w-full flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-sm text-mute hover:bg-line/50 hover:text-ink transition-colors font-medium"
          >
            <Icon name="shared" size={19} />
            Sign out
          </Link>
        </div>
      </aside>
    </>
  )
}