import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const SEARCH_ITEMS = [
  {
    id: 'panel',
    label: 'Panel de casos',
    description: 'Ver los casos registrados',
    keywords: 'panel casos registrados tickets',
    action: 'panel',
  },
  {
    id: 'recorder',
    label: 'Registrador inteligente',
    description: 'Volver a tus notas',
    keywords: 'registrador inteligente notas recorder',
    action: 'recorder',
  },
  {
    id: 'create-ticket',
    label: 'Crear ticket',
    description: 'Elegir el tipo de ticket',
    keywords: 'crear ticket incidente orden de trabajo consulta',
    action: 'createTicket',
  },
];

function normalizeSearchText(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es');
}

function AppSearch({ onOpenPanel, onOpenRecorder, onCreateTicket }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  const results = useMemo(() => {
    const normalizedQuery = normalizeSearchText(query.trim());
    if (!normalizedQuery) return SEARCH_ITEMS;

    return SEARCH_ITEMS.filter((item) => (
      normalizeSearchText(`${item.label} ${item.description} ${item.keywords}`)
        .includes(normalizedQuery)
    ));
  }, [query]);

  const handleSelect = useCallback((action) => {
    setIsOpen(false);
    setQuery('');

    if (action === 'panel') onOpenPanel();
    if (action === 'recorder') onOpenRecorder();
    if (action === 'createTicket') onCreateTicket();
  }, [onCreateTicket, onOpenPanel, onOpenRecorder]);

  useEffect(() => {
    if (!isOpen) return undefined;

    inputRef.current?.focus();

    const handlePointerDown = (event) => {
      if (!searchRef.current?.contains(event.target)) {
        setIsOpen(false);
        setQuery('');
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
      }
      if (event.key === 'Enter' && results.length > 0) {
        event.preventDefault();
        handleSelect(results[0].action);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleSelect, isOpen, results]);

  return (
    <div className={`app-search${isOpen ? ' app-search--open' : ''}`} ref={searchRef}>
      <button
        aria-label={isOpen ? 'Buscar opciones' : 'Abrir búsqueda'}
        className="app-search-trigger"
        onClick={() => {
          if (isOpen) {
            inputRef.current?.focus();
          } else {
            setIsOpen(true);
          }
        }}
        type="button"
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="10.8" cy="10.8" r="6.3" stroke="currentColor" strokeWidth="1.8" />
          <path d="m15.5 15.5 4.2 4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>

      <input
        aria-label="Buscar en Unisys Training"
        autoComplete="off"
        className="app-search-input"
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Busca una opción..."
        ref={inputRef}
        role="combobox"
        aria-expanded={isOpen}
        aria-controls="app-search-results"
        aria-autocomplete="list"
        value={query}
      />

      {isOpen && (
        <button
          aria-label="Cerrar búsqueda"
          className="app-search-close"
          onClick={() => {
            setIsOpen(false);
            setQuery('');
          }}
          type="button"
        >
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </button>
      )}

      {isOpen && (
        <div
          className="app-search-results"
          id="app-search-results"
          role="listbox"
        >
          <p className="app-search-caption">
            {query.trim() ? 'Resultados' : 'Accesos rápidos'}
          </p>
          {results.length > 0 ? results.map((item, index) => (
            <button
              aria-selected="false"
              className="app-search-result"
              key={item.id}
              onClick={() => handleSelect(item.action)}
              role="option"
              style={{ '--search-result-index': index }}
              type="button"
            >
              <span className="app-search-result-icon" aria-hidden="true">
                {item.action === 'panel' && (
                  <svg viewBox="0 0 20 20" fill="none">
                    <rect x="3" y="3" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="11.5" y="3" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="3" y="11.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="11.5" y="11.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                )}
                {item.action === 'recorder' && (
                  <svg viewBox="0 0 20 20" fill="none">
                    <path d="M5 2.8h7l3.2 3.3v11.1H5V2.8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M12 3v3.5h3.2M7.5 10h5M7.5 13h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                )}
                {item.action === 'createTicket' && (
                  <svg viewBox="0 0 20 20" fill="none">
                    <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  </svg>
                )}
              </span>
              <span className="app-search-result-copy">
                <strong>{item.label}</strong>
                <span>{item.description}</span>
              </span>
              <svg className="app-search-result-arrow" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="m8 5 5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )) : (
            <p className="app-search-empty">
              No encontramos opciones para “{query}”.
            </p>
          )}
          <div className="app-search-hint">
            <kbd>ESC</kbd>
            <span>para cerrar</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppSearch;
