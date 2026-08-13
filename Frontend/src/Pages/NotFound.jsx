import { Link } from 'react-router-dom'
import Icon from '../components/Icon'

const NotFound = () => {
  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="text-center max-w-sm">
        <span className="inline-grid place-items-center w-16 h-16 rounded-2xl bg-accent-soft text-accent mb-6">
          <Icon name="search" size={30} />
        </span>
        <p className="font-display text-6xl font-bold tracking-tight">404</p>
        <h1 className="mt-2 font-display text-xl font-semibold tracking-tight">
          This file isn't here
        </h1>
        <p className="mt-2 text-sm text-mute">
          The page or file you're looking for was moved, deleted, or never existed.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 h-11 px-5 rounded-full bg-accent text-white text-sm font-semibold hover:bg-[#185275] transition-colors"
        >
          <Icon name="drive" size={18} />
          Back to My Drive
        </Link>
      </div>
    </div>
  )
}

export default NotFound;