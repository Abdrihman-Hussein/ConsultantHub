import { Link } from 'react-router-dom';

interface NavbarProps {
  activePage?: 'browse' | 'dashboard' | 'home';
}

export default function Navbar({ activePage = 'home' }: NavbarProps) {
  return (
    <header className="bg-surface border-b border-outline-variant full-width top-0 z-50 sticky">
      <div className="flex justify-between items-center w-full px-8 h-20 max-w-max-width mx-auto">
        <div className="flex items-center gap-6">
          <Link to="/" className="font-headline-lg text-headline-lg font-bold text-primary">
            ConsultantHub
          </Link>
          <div className="relative hidden md:block w-64 ml-4">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
              search
            </span>
            <input
              className="w-full pl-9 pr-4 py-2 bg-surface-alt border border-outline-variant rounded-full text-label-md font-label-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20 transition-all"
              placeholder="Search consultants..."
              type="text"
            />
          </div>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/consultants"
            className={`font-label-md text-label-md h-20 flex items-center px-2 transition-colors ${
              activePage === 'browse'
                ? 'text-secondary font-bold border-b-2 border-secondary'
                : 'text-on-surface-variant hover:text-secondary hover:bg-surface-container-low'
            }`}
          >
            Browse
          </Link>
          <Link
            to="/client/dashboard"
            className={`font-label-md text-label-md h-20 flex items-center px-2 transition-colors ${
              activePage === 'dashboard'
                ? 'text-secondary font-bold border-b-2 border-secondary'
                : 'text-on-surface-variant hover:text-secondary hover:bg-surface-container-low'
            }`}
          >
            Dashboard
          </Link>
          <a className="text-on-surface-variant hover:text-secondary hover:bg-surface-container-low transition-colors font-label-md text-label-md h-20 flex items-center px-2" href="#">
            Resources
          </a>
        </nav>
        <div className="flex items-center space-x-4">
          <Link to="/login" className="font-label-md text-label-md text-secondary border border-secondary px-4 py-2 rounded hover:bg-secondary/5 transition-colors">
            Log In
          </Link>
          <Link to="/register" className="font-label-md text-label-md bg-secondary text-white px-4 py-2 rounded hover:bg-secondary/90 transition-colors shadow-sm">
            Profile
          </Link>
        </div>
        <button className="md:hidden text-on-surface-variant">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>
    </header>
  );
}