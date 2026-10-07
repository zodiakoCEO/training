import { useEffect, useRef, useState } from 'react';

function NotificationBell({ isUnread, onMarkAsRead }) {
  const [isOpen, setIsOpen] = useState(false);
  const bellRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      if (!bellRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
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
    <div className="notification-bell" ref={bellRef}>
      <button
        aria-controls="ticket-notification"
        aria-expanded={isOpen}
        aria-label={isUnread ? 'Notificaciones, hay avisos sin leer' : 'Notificaciones'}
        className={`recorder-icon-button${isUnread ? ' recorder-icon-button--unread' : ''}`}
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M18 9a6 6 0 0 0-12 0c0 7-2.5 7-2.5 8.5h17C20.5 16 18 16 18 9Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          <path d="M10 20h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
        {isUnread && <span aria-hidden="true" className="notification-badge" />}
      </button>

      {isOpen && (
        <section
          aria-label="Notificación de tickets"
          className="notification-popover"
          id="ticket-notification"
          role="dialog"
        >
          <header className="notification-heading">
            <span className="notification-symbol" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
                <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span>
              <strong>Ticket en proceso</strong>
              <span className="notification-status">Pendiente de resolver</span>
            </span>
            {isUnread && <span aria-label="Sin leer" className="notification-unread-dot" />}
          </header>
          <p>
            Tienes un ticket que aún no has marcado como resuelto o finalizado.
            Recuerda actualizarlo cuando termines.
          </p>
          {isUnread ? (
            <button
              className="notification-acknowledge"
              onClick={onMarkAsRead}
              type="button"
            >
              Entendido
            </button>
          ) : (
            <span className="notification-read-label">Aviso leído</span>
          )}
        </section>
      )}
    </div>
  );
}

export default NotificationBell;
