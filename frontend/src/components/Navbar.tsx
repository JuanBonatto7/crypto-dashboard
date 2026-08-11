import { NavLink } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const linkClasses = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-brand-600 text-white'
      : 'text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800'
  }`

export function Navbar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <NavLink to="/" className="flex items-center gap-2 text-lg font-bold">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white">
            $
          </span>
          Crypto Dashboard
        </NavLink>

        <nav className="flex items-center gap-2">
          <NavLink to="/" className={linkClasses} end>
            Dashboard
          </NavLink>
          <NavLink to="/favorites" className={linkClasses}>
            Favoritos
          </NavLink>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Cambiar tema"
            className="ml-2 rounded-lg border border-slate-300 p-2 text-sm hover:bg-slate-200 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </nav>
      </div>
    </header>
  )
}
