import { useCallback, useEffect, useRef, useState } from 'react';
import AppSearch from '../components/molecules/AppSearch.jsx';
import NotificationBell from '../components/molecules/NotificationBell.jsx';
import RecorderTemplatesModal from '../components/molecules/RecorderTemplatesModal.jsx';
import UserMenu from '../components/molecules/UserMenu.jsx';

function SmartRecorder({ onOpenPanel, onOpenRecorder, onOpenIncident, onOpenWorkOrder, onLogout, isTicketNotificationUnread, onMarkTicketNotificationRead }) {
  const [note, setNote] = useState('');
  const [isTicketMenuOpen, setIsTicketMenuOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [ticketType, setTicketType] = useState('');
  const noteInputRef = useRef(null);
  const closeTemplates = useCallback(() => setIsTemplatesOpen(false), []);

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
    setIsTemplatesOpen(false);
  };

  const insertTemplate = (template) => {
    const textarea = noteInputRef.current;
    const selectionStart = textarea?.selectionStart ?? note.length;
    const selectionEnd = textarea?.selectionEnd ?? note.length;
    const prefix = note.slice(0, selectionStart);
    const suffix = note.slice(selectionEnd);
    const separatorBefore = prefix && !prefix.endsWith('\n') ? '\n\n' : '';
    const separatorAfter = suffix && !template.endsWith('\n') ? '\n\n' : '';
    const nextNote = `${prefix}${separatorBefore}${template}${separatorAfter}${suffix}`;
    const cursorPosition = prefix.length + separatorBefore.length + template.length;

    setNote(nextNote);
    setIsTemplatesOpen(false);
    window.requestAnimationFrame(() => {
      noteInputRef.current?.focus();
      noteInputRef.current?.setSelectionRange(cursorPosition, cursorPosition);
    });
  };

  return (
    <main className="recorder-page">
      <header className="recorder-topbar">
        <div className="recorder-brand-nav">
          <span className="recorder-brand">Unisys Training</span>
          <nav className="recorder-tabs" aria-label="Navegación principal">
            <button className="recorder-tab" onClick={onOpenPanel} type="button">Panel</button>
            <button className="recorder-tab recorder-tab--active" type="button">
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

      <section className="recorder-composer" aria-label="Notas del registrador">
        <textarea
          className="recorder-note-input"
          onChange={(event) => setNote(event.target.value)}
          placeholder="Escribe @ para mencionar a un colaborador o usa ! para insertar una plantilla..."
          ref={noteInputRef}
          value={note}
        />
        <div className="recorder-composer-shortcuts" aria-label="Atajos del registrador">
          <button className="recorder-mention" onClick={() => setNote((current) => `${current}${current ? ' ' : ''}@colaborador`)} type="button">
            <span className="recorder-mention-mark">@</span>
            <span>colaborador</span>
          </button>
          <button
            aria-haspopup="dialog"
            className="recorder-mention recorder-template-trigger"
            onClick={() => setIsTemplatesOpen(true)}
            type="button"
          >
            <span aria-hidden="true" className="recorder-mention-mark recorder-template-mark">!</span>
            <span>plantilla</span>
          </button>
        </div>
      </section>

      {isTemplatesOpen && (
        <RecorderTemplatesModal
          onClose={closeTemplates}
          onSelect={insertTemplate}
        />
      )}

      <section className="recorder-workspace" aria-label="Espacio de trabajo">
        <div className="recorder-empty-state">
          <svg className="recorder-empty-icon" viewBox="0 0 48 48" fill="none" aria-hidden="true">
            <rect x="10" y="9" width="28" height="34" rx="4" stroke="currentColor" strokeWidth="3" />
            <rect x="18" y="5" width="12" height="8" rx="3" fill="#dce3e8" stroke="currentColor" strokeWidth="3" />
          </svg>
          <h1>Registrador inteligente</h1>
          <p>Usa <strong>@</strong> para mencionar a un colaborador, <strong>! Plantilla</strong> para insertar una guía o <strong>Crear ticket</strong> para abrir el formulario.</p>
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
              {['Incidente', 'Orden de trabajo', 'Consulta'].map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setTicketType(type);
                    setIsTicketMenuOpen(false);
                    if (type === 'Incidente') onOpenIncident();
                    if (type === 'Orden de trabajo') onOpenWorkOrder();
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