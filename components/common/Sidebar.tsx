
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { NAVIGATION_ITEMS } from '../../constants'; // Using .tsx implicitly
import { NavItem } from '../../types';

interface SidebarProps {
  isOpen?: boolean; // for mobile
  toggleSidebar?: () => void; // for mobile
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { user } = useAuth();

  if (!user) return null;

  const availableNavItems = NAVIGATION_ITEMS.filter(item => item.roles.includes(user.role));

  const navLinkClasses = ({ isActive }: { isActive: boolean }): string =>
    `flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out ${
      isActive
        ? 'bg-primary text-white shadow-md'
        : 'text-gray-300 hover:bg-neutral-dark hover:text-white'
    }`;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && toggleSidebar && (
        <div className="fixed inset-0 z-30 bg-black opacity-50 md:hidden" onClick={toggleSidebar}></div>
      )}
      <aside className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-neutral-darker text-gray-100 p-4 space-y-2 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out shadow-lg`}
       style={{backgroundColor: '#111827'}} /* neutral-900 as neutral-darker */
      >
        <nav>
          <ul>
            {availableNavItems.map((item: NavItem) => (
              <li key={item.path} className='mt-5'>
                <NavLink
                  to={item.path}
                  className={navLinkClasses}
                  onClick={toggleSidebar && isOpen ? toggleSidebar : undefined} // Close sidebar on mobile nav click
                >
                  {item.icon && <span className="mr-3">{item.icon}</span>}
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
