import { useEffect, useRef, useState } from 'react';

const TEMPLATES = [
  {
    name: 'Red WiFi',
    description: 'Conectividad inalámbrica, cobertura y acceso.',
    content: 'Solicitud: soporte de red WiFi\nUsuario o área:\nUbicación:\nNombre de la red:\nDispositivo:\nDescripción del inconveniente:\nPruebas realizadas:\nImpacto:',
  },
  {
    name: 'Oracle',
    description: 'Incidentes de acceso, operación o rendimiento en Oracle.',
    content: 'Solicitud: soporte Oracle\nSistema o módulo:\nAmbiente:\nUsuario afectado:\nFecha y hora del inconveniente:\nMensaje de error:\nDescripción:\nAcciones realizadas:',
  },
  {
    name: 'Pedidos',
    description: 'Creación, consulta o seguimiento de pedidos.',
    content: 'Solicitud: gestión de pedido\nNúmero de pedido:\nCliente o área solicitante:\nFecha del pedido:\nEstado actual:\nDetalle de la solicitud:\nAcción requerida:',
  },
  {
    name: 'Seguimiento caso Banco',
    description: 'Actualización y próximos pasos de un caso del banco.',
    content: 'Seguimiento de caso - Banco\nNúmero de caso:\nContacto o área:\nFecha de seguimiento:\nEstado actual:\nÚltima actualización:\nPendientes:\nPróxima acción y fecha:',
  },
  {
    name: 'Seguimiento caso Unisys',
    description: 'Actualización y próximos pasos de un caso interno Unisys.',
    content: 'Seguimiento de caso - Unisys\nNúmero de caso:\nEquipo o responsable:\nFecha de seguimiento:\nEstado actual:\nÚltima actualización:\nPendientes:\nPróxima acción y fecha:',
  },
];

function RecorderTemplatesModal({ onClose, onSelect }) {
  const [query, setQuery] = useState('');
  const modalRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previouslyFocusedElement = document.activeElement;
    document.body.style.overflow = 'hidden';
    searchRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusableElements = modalRef.current?.querySelectorAll(
        'button:not(:disabled), input:not(:disabled)',
      );
      if (!focusableElements?.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      previouslyFocusedElement?.focus();
    };
  }, [onClose]);

  const normalizedQuery = query.trim().toLocaleLowerCase('es');
  const filteredTemplates = TEMPLATES.filter(({ name, description }) => (
    `${name} ${description}`.toLocaleLowerCase('es').includes(normalizedQuery)
  ));

  return (
    <div
      className="recorder-template-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="presentation"
    >
      <section
        aria-describedby="recorder-template-description"
        aria-labelledby="recorder-template-title"
        aria-modal="true"
        className="recorder-template-modal"
        ref={modalRef}
        role="dialog"
      >
        <header className="recorder-template-header">
          <div>
            <p className="recorder-template-eyebrow">REGISTRADOR INTELIGENTE</p>
            <h2 id="recorder-template-title">Elegir una plantilla</h2>
            <p id="recorder-template-description">
              Inserta una guía en tus notas y complétala con los detalles del caso.
            </p>
          </div>
          <button
            aria-label="Cerrar plantillas"
            className="recorder-template-close"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </header>

        <label className="recorder-template-search-label" htmlFor="recorder-template-search">
          Buscar plantilla
        </label>
        <input
          autoComplete="off"
          className="recorder-template-search"
          id="recorder-template-search"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ej. Oracle o seguimiento"
          ref={searchRef}
          type="search"
          value={query}
        />

        <div aria-label="Plantillas disponibles" className="recorder-template-list">
          {filteredTemplates.length > 0 ? filteredTemplates.map((template) => (
            <button
              className="recorder-template-option"
              key={template.name}
              onClick={() => onSelect(template.content)}
              type="button"
            >
              <span className="recorder-template-option-copy">
                <strong>{template.name}</strong>
                <span>{template.description}</span>
              </span>
              <span aria-hidden="true" className="recorder-template-insert">Insertar</span>
            </button>
          )) : (
            <p className="recorder-template-empty">No encontramos plantillas con ese nombre.</p>
          )}
        </div>

        <footer className="recorder-template-footer">
          <span>{filteredTemplates.length} {filteredTemplates.length === 1 ? 'plantilla disponible' : 'plantillas disponibles'}</span>
          <button onClick={onClose} type="button">Cancelar</button>
        </footer>
      </section>
    </div>
  );
}

export default RecorderTemplatesModal;
