import { Link } from 'react-router-dom';

interface SidebarProps {
  userName: string;
  activeItem: string;
}

const menuItems = [
  { id: 'overview', label: 'Overview', icon: 'dashboard', path: '/client/dashboard' },
  { id: 'bookings', label: 'My Bookings', icon: 'event_available', path: '/client/appointments' },
  { id: 'messages', label: 'Messages', icon: 'mail', path: '#' },
  { id: 'settings', label: 'Settings', icon: 'settings', path: '#' },
  { id: 'help', label: 'Help', icon: 'help', path: '#' },
];

export default function Sidebar({ userName, activeItem }: SidebarProps) {
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside className="bg-surface-container-lowest h-full w-64 border-r border-outline-variant hidden md:flex flex-col py-6 px-4 space-y-2 shrink-0 z-40">
      <div className="flex items-center gap-3 mb-8 px-4">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-outline-variant bg-surface-container-high flex items-center justify-center text-secondary font-bold text-lg">
          {initials}
        </div>
        <div>
          <h2 className="font-headline-md text-headline-md text-primary leading-tight">Client Portal</h2>
          <p className="font-body-md text-body-md text-on-surface-variant text-sm">Manage your sessions</p>
        </div>
      </div>
      <nav className="flex-1 space-y-2 font-label-md text-label-md">
        {menuItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all ${
              activeItem === item.id
                ? 'text-secondary font-semibold bg-secondary-container/10 translate-x-1'
                : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto pt-4">
        <Link
          to="/consultants"
          className="w-full bg-secondary text-white py-3 rounded-md font-label-md text-label-md hover:bg-opacity-90 transition-opacity shadow-sm flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">add</span>
          Book New Consultant
        </Link>
      </div>
    </aside>
  );
}