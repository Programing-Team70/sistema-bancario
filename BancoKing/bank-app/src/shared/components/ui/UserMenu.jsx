import { useState, useRef, useEffect } from 'react';
import { Settings, UserCircle, User, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../../../features/auth/store/authStore';
import { UpdateProfile } from '../../../features/users/components/UpdateProfile';
import { ProfileViewer } from '../../../features/users/components/ProfileViewer';

export const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const menuRef = useRef(null);
  const { user } = useAuthStore();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openEditModal = () => {
    setIsOpen(false);

    setIsModalOpen(true);
  };

  const openProfileModal = () => {
    setIsOpen(false);

    setIsProfileOpen(true);
  };

  return (
    <>
      <section className='user-menu-wrapper' ref={menuRef}>
        <button
          className={`navbar-profile ${isOpen ? 'active' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label='Abrir menú de usuario'
        >
          <User size={20} />
        </button>

        {isOpen && (
          <aside className='user-dropdown-panel'>
            <header className='panel-header'>
              <div className='header-avatar'>
                <User size={24} color='var(--primary-green)' />
              </div>

              <div className='header-details'>
                <h4 className='p-name'>
                  {user?.name} {user?.surname}
                </h4>

                <p className='p-email'>{user?.email}</p>

                <span className='p-role-badge'>
                  {user?.role === 'ADMIN_ROLE' ? 'Admin' : 'Client'}
                </span>
              </div>
            </header>

            <main className='panel-content'>
              <nav>
                <ul className='panel-list'>
                  <li>
                    <button className='panel-item' onClick={openProfileModal}>
                      <div className='item-icon-wrapper'>
                        <UserCircle size={18} />
                      </div>

                      <span>Mi Perfil</span>

                      <ChevronRight size={14} className='arrow-icon' />
                    </button>
                  </li>

                  <li>
                    <button className='panel-item' onClick={openEditModal}>
                      <div className='item-icon-wrapper'>
                        <Settings size={18} />
                      </div>

                      <span>Ajustes</span>

                      <ChevronRight size={14} className='arrow-icon' />
                    </button>
                  </li>
                </ul>
              </nav>
            </main>
          </aside>
        )}
      </section>

      <ProfileViewer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onEdit={() => {
          setIsProfileOpen(false);

          setIsModalOpen(true);
        }}
      />

      <UpdateProfile isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
