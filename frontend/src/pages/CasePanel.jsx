import { useEffect, useState } from 'react';
import AppSearch from '../components/molecules/AppSearch.jsx';
import NotificationBell from '../components/molecules/NotificationBell.jsx';
import UserMenu from '../components/molecules/UserMenu.jsx';

function CasePanel({ onOpenPanel, onOpenRecorder, onLogout, isTicketNotificationUnread, onMarkTicketNotificationRead }) {
  const [isTicketMenuOpen, setIsTicketMenuOpen] = useState(false);
  const [ticketType, setTicketType] = useState('');

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Panel | Unisys Training';

    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <main className="case-panel-page">
      <header className="recorder-topbar">
        <div className="recorder-brand-nav">
          <span className="recorder-brand">Unisys Training</span>
          <nav className="recorder-tabs" aria-label="Navegación principal">
            <button className="recorder-tab recorder-tab--active" type="button">
              Panel
            </button>
            <button className="recorder-tab" onClick={onOpenRecorder} type="button">
              Registrador inteligente
            </button>
          </nav>
        </div>
        <div className="recorder-user-nav">
          <AppSearch
            onCreateTicket={() => setIsTicketMenuOpen(true)}
            onOpenPanel={onOpenPanel}
            onOpenRecorder={onOpenRecorder}
          />
          <NotificationBell
            isUnread={isTicketNotificationUnread}
            onMarkAsRead={onMarkTicketNotificationRead}
          />
          <UserMenu onLogout={onLogout} />
        </div>
      </header>

      <section className="case-panel-content" aria-label="Casos registrados">
        <section className="case-list-panel">
          <header className="case-list-heading">
            <h1>Casos registrados</h1>
            <p>0 tickets en total</p>
          </header>
          <div className="case-list-empty">
            <svg className="case-list-empty-icon" viewBox="0 0 48 48" fill="none" aria-hidden="true">
              <rect x="10" y="9" width="28" height="34" rx="4" stroke="currentColor" strokeWidth="3" />
              <rect x="18" y="5" width="12" height="8" rx="3" fill="#dce3e8" stroke="currentColor" strokeWidth="3" />
            </svg>
            <h2>Sin casos guardados</h2>
            <p>Los casos guardados desde el Registrador aparecerán aquí.</p>
          </div>
        </section>

        <aside className="case-detail-empty" aria-label="Detalle del caso">
          <svg className="case-detail-empty-icon" viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <path d="M20 11c-5 4-5 11-3 15 3 5 8 4 14 3 6-1 8 1 7 7-1 6-2 10 3 13 5 3 12 1 15-4 2-4 1-8 0-11m0 0c5 2 10-1 12-5 2-5 0-12-5-15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <p>Selecciona un caso para ver su detalle.</p>
        </aside>
      </section>

      <footer className="recorder-footer">
        <button className="recorder-reset" onClick={onOpenRecorder} type="button">
          Volver a empezar
        </button>
        <div className="recorder-create-wrap">
          {isTicketMenuOpen && (
            <div className="recorder-ticket-menu" role="menu">
              {['Incidente', 'Solicitud', 'Consulta'].map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setTicketType(type);
                    setIsTicketMenuOpen(false);
                  }}
                  role="menuitem"
                  type="button"
                >
                  {type}
                </button>
              ))}
            </div>
          )}
          <button
            aria-expanded={isTicketMenuOpen}
            className="recorder-create"
            onClick={() => setIsTicketMenuOpen((isOpen) => !isOpen)}
            type="button"
          >
            {ticketType ? `Crear ${ticketType.toLowerCase()}` : 'Crear ticket'}
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </footer>
    </main>
  );
}

export default CasePanel;
