import { useEffect, useRef, useState } from 'react';

const MENU_ITEMS = [
  { label: 'Mi cuenta', detail: 'jhon.pulido · Administrador' },
  { label: 'Configuración', detail: 'Personaliza tus preferencias de cuenta.' },
  { label: 'Notificaciones', detail: 'No tienes notificaciones nuevas.' },
  { label: 'Idioma y región', detail: 'Español · Latinoamérica' },
];

function UserMenu({ onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setIsOpen(false);
        setActiveItem(null);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setActiveItem(null);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="user-menu" ref={menuRef}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={`recorder-user${isOpen ? ' recorder-user--open' : ''}`}
        onClick={() => {
          setIsOpen((open) => !open);
          setActiveItem(null);
        }}
        type="button"
      >
        <span className="recorder-avatar">JP</span>
        <span className="recorder-user-name">Jhon Pulido</span>
        <svg className="recorder-user-chevron" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="m6 8 4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen && (
        <section aria-label="Menú de usuario" className="user-menu-popover">
          <header className="user-menu-profile">
            <span className="user-menu-profile-avatar">JP</span>
            <span className="user-menu-profile-copy">
              <strong>Jhon Pulido</strong>
              <span>jhon.pulido · Admin</span>
            </span>
            <span className="user-menu-status" aria-label="En línea" />
          </header>

          {activeItem ? (
            <div className="user-menu-subpage">
              <button
                aria-label="Volver al menú de usuario"
                className="user-menu-back"
                onClick={() => setActiveItem(null)}
                type="button"
              >
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="m12 4-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Menú de usuario
              </button>
              <h2>{activeItem.label}</h2>
              <p>{activeItem.detail}</p>
            </div>
          ) : (
            <div className="user-menu-options" role="menu">
              {MENU_ITEMS.map((item, index) => (
                <button
                  className="user-menu-option"
                  key={item.label}
                  onClick={() => setActiveItem(item)}
                  role="menuitem"
                  style={{ '--menu-item-index': index }}
                  type="button"
                >
                  <span>{item.label}</span>
                  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="m8 5 5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              ))}
            </div>
          )}

          <footer className="user-menu-footer">
            <button className="user-menu-logout" onClick={onLogout} type="button">
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M8 3H4.8A1.8 1.8 0 0 0 3 4.8v10.4A1.8 1.8 0 0 0 4.8 17H8m4-3 4-4-4-4m4 4H7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Cerrar sesión
            </button>
          </footer>
        </section>
      )}
    </div>
  );
}

export default UserMenu;
