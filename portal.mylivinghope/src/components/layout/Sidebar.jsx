import { NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import {
  LayoutDashboard,
  Package,
  CheckSquare,
  Users,
  Megaphone,
  Palette,
  Layers,
  Lightbulb,
  ClipboardList,
  Settings,
  UserCog,
  Sparkles,
  Bot,
  Flame,
  X,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Contacts', href: '/contacts', icon: Users },
  { name: 'Campaigns', href: '/campaigns', icon: Megaphone },
  { name: 'Artists', href: '/artists', icon: Palette },
  { name: 'Card Design', href: '/card-design', icon: Layers },
  { name: 'Brainstorm', href: '/brainstorm', icon: Lightbulb },
  { name: 'Inspiration', href: '/inspiration', icon: Sparkles },
  { name: 'Checklist', href: '/checklist', icon: ClipboardList },
  { name: 'Claude', href: '/claude', icon: Bot },
]

const adminNavigation = [
  { name: 'Team', href: '/team', icon: UserCog },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Sidebar({ isOpen, onClose }) {
  const { isAdmin } = useAuth()

  const NavItem = ({ item }) => (
    <NavLink
      to={item.href}
      onClick={onClose}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-surface-2 hover:text-gray-900 dark:hover:text-gray-200'
        }`
      }
    >
      <item.icon className="w-5 h-5 flex-shrink-0" />
      {item.name}
    </NavLink>
  )

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 dark:bg-black/70 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50
          h-screen w-64
          bg-white dark:bg-dark-surface border-r border-gray-200 dark:border-dark-border
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-dark-border">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary-500 rounded-xl">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-display font-bold text-gray-900 dark:text-gray-100">
                  My Living Hope
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Portal</p>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-surface-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin">
            {navigation.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}

            {/* Admin section */}
            {isAdmin && (
              <>
                <div className="pt-4 mt-4 border-t border-gray-200 dark:border-dark-border">
                  <p className="px-3 mb-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Admin
                  </p>
                  {adminNavigation.map((item) => (
                    <NavItem key={item.name} item={item} />
                  ))}
                </div>
              </>
            )}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-dark-border">
            <div className="text-xs text-gray-400 dark:text-gray-500 text-center">
              Built with hope
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
