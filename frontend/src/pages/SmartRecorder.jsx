import { useEffect, useState } from 'react';

function SmartRecorder({ onBack }) {
  const [note, setNote] = useState('');
  const [isTicketMenuOpen, setIsTicketMenuOpen] = useState(false);
  const [ticketType, setTicketType] = useState('');

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Registrador inteligente | Unisys Training';

    return () => {
      document.title = previousTitle;
    };
  }, []);

  const resetRecorder = () => {
    setNote('');
    setTicketType('');
    setIsTicketMenuOpen(false);
  };

  return (
    <main className="recorder-page">
      <header className="recorder-topbar">
        <div className="recorder-brand-nav">
          <span className="recorder-brand">Unisys Training</span>
          <nav className="recorder-tabs" aria-label="Navegación principal">
            <button className="recorder-tab" onClick={onBack} type="button">Panel</button>
            <button className="recorder-tab recorder-tab--active" type="button">
              Registrador inteligente
            </button>
          </nav>
        </div>
        <div className="recorder-user-nav">
          <button className="recorder-icon-button" aria-label="Buscar" type="button">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="10.8" cy="10.8" r="6.3" stroke="currentColor" strokeWidth="1.8" />
              <path d="m15.5 15.5 4.2 4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
          <button className="recorder-icon-button" aria-label="Notificaciones" type="button">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M18 9a6 6 0 0 0-12 0c0 7-2.5 7-2.5 8.5h17C20.5 16 18 16 18 9Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
              <path d="M10 20h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </button>
          <button className="recorder-user" type="button">
            <span className="recorder-avatar">JP</span>
            <span className="recorder-user-name">Jhon Pulido</span>
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="m6 8 4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </header>

      <section className="recorder-composer" aria-label="Notas del registrador">
        <textarea
          className="recorder-note-input"
          onChange={(event) => setNote(event.target.value)}
          placeholder="Escribe @ para mencionar un colaborador..."
          value={note}
        />
        <button className="recorder-mention" onClick={() => setNote((current) => `${current}${current ? ' ' : ''}@colaborador`)} type="button">
          <span className="recorder-mention-mark">@</span>
          <span>colaborador</span>
        </button>
      </section>

      <section className="recorder-workspace" aria-label="Espacio de trabajo">
        <div className="recorder-empty-state">
          <svg className="recorder-empty-icon" viewBox="0 0 48 48" fill="none" aria-hidden="true">
            <rect x="10" y="9" width="28" height="34" rx="4" stroke="currentColor" strokeWidth="3" />
            <rect x="18" y="5" width="12" height="8" rx="3" fill="#dce3e8" stroke="currentColor" strokeWidth="3" />
          </svg>
          <h1>Registrador inteligente</h1>
          <p>Usa <strong>@</strong> para mencionar un colaborador y luego <strong>Crear ticket</strong> para abrir el formulario.</p>
        </div>
        <aside className="recorder-helper">
          <svg className="recorder-helper-icon" viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <path d="M20 11c-5 4-5 11-3 15 3 5 8 4 14 3 6-1 8 1 7 7-1 6-2 10 3 13 5 3 12 1 15-4 2-4 1-8 0-11m0 0c5 2 10-1 12-5 2-5 0-12-5-15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <p>El registrador inteligente busca recursos mientras usted toma notas.</p>
        </aside>
      </section>

      <footer className="recorder-footer">
        <button className="recorder-reset" onClick={resetRecorder} type="button">Volver a empezar</button>
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

export default SmartRecorder;