import { useEffect, useRef, useState } from 'react';
import AppSearch from '../components/molecules/AppSearch.jsx';
import NotificationBell from '../components/molecules/NotificationBell.jsx';
import UserMenu from '../components/molecules/UserMenu.jsx';

const INITIAL_INCIDENT = {
  summary: 'USUARIO EXTERNO',
  impact: '4-Menor/Localizado',
  priority: 'Baja',
  specialTreatment: '',
  status: 'Nuevo',
  client: 'USUARIO EXTERNO',
  clientPhone: '',
  zone: 'Antioquia',
  company: 'BANCOLOMBIA S.A.',
  clientEmail: '',
  locationGroup: 'ANTIOQUIA (BANCO)',
  organization: 'SIN ORGANIZACIÓN',
  providerTicket: '',
  clientSite: 'SIN UBICACIÓN',
  contact: 'USUARIO EXTERNO',
  contactPhone: '',
  contactEmail: '',
  incidentType: '',
  configurationItem: '',
  otherCompanyCategories: false,
  operationalCategory: '',
  resolutionCategory: '',
  service: '',
  reportedSource: '',
  productCategory: '',
  resolutionProductCategory: '',
  description: 'USUARIO EXTERNO',
  affectedCompany: '',
  affectedZone: '',
  affectedLocationGroup: '',
  affectedLocation: '',
  affectedOrganization: '',
  affectedDepartment: '',
  supportGroup: '',
  assignedBy: '',
};

const REQUIRED_FIELDS = {
  summary: 'El resumen es obligatorio.',
  impact: 'Selecciona el impacto.',
  priority: 'Selecciona la prioridad.',
  status: 'Selecciona el estado.',
  client: 'El cliente es obligatorio.',
  clientPhone: 'El teléfono del cliente es obligatorio.',
  company: 'La empresa es obligatoria.',
  incidentType: 'Selecciona el tipo de incidencia.',
};

const REQUIRED_FIELD_LABELS = [
  ['summary', 'Resumen'],
  ['impact', 'Impacto'],
  ['priority', 'Prioridad'],
  ['status', 'Estado'],
  ['client', 'Cliente'],
  ['clientPhone', 'Teléfono del cliente'],
  ['company', 'Empresa'],
  ['incidentType', 'Tipo de incidencia'],
];

const RESOURCE_DOCUMENTS = [
  ['DOC-00020207', 'DWP Ofertas - Registro de empleado Externo en Sap HCM', '100.00%', '418 vistas', '90 tickets'],
  ['DOC-00024596', 'Garantías - Proceso subrogación deuda - Abogado externo', '0.00%', '22 vistas', '0 tickets'],
  ['DOC-00015719', 'SAP HCM - Novedades y Registro de empleados externo', '98.84%', '1196 vistas', '162 tickets'],
  ['DOC-00017366', 'Puerto USB (Desktop) - El puerto USB no reconoce el dispositivo externo', '100.00%', '407 vistas', '53 tickets'],
];

const RECOMMENDED_TICKETS = [
  ['TKT000002365893', 'USUARIO EXTERNO'],
  ['TKT000002365742', 'Error de acceso a servicio corporativo'],
];

const FIELD_OPTIONS = {
  impact: ['1-Crítico/Extenso', '2-Alto/Significativo', '3-Moderado/Limitado', '4-Menor/Localizado'],
  priority: ['Crítica', 'Alta', 'Media', 'Baja'],
  status: ['Nuevo', 'Asignado', 'En progreso', 'Pendiente'],
  incidentType: ['Acceso', 'Aplicación', 'Hardware', 'Red', 'Servicio', 'Otro'],
  reportedSource: ['Teléfono', 'Correo electrónico', 'Portal', 'Monitoreo', 'Registrador inteligente'],
  supportGroup: ['Mesa de ayuda', 'Soporte de aplicaciones', 'Infraestructura', 'Redes'],
};

function IncidentPage({
  onOpenPanel,
  onOpenRecorder,
  onLogout,
  isTicketNotificationUnread,
  onMarkTicketNotificationRead,
  onSaveIncident,
  ticketNumber,
}) {
  const [incident, setIncident] = useState(INITIAL_INCIDENT);
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState('');
  const [activeTab, setActiveTab] = useState('resources');
  const [documentPage, setDocumentPage] = useState(1);
  const [ticketPage, setTicketPage] = useState(1);
  const [attachments, setAttachments] = useState([]);
  const [affectedAreas, setAffectedAreas] = useState([]);
  const [commentDraft, setCommentDraft] = useState('');
  const [isCommentPublic, setIsCommentPublic] = useState(false);
  const [comments, setComments] = useState([]);
  const fileInputRef = useRef(null);
  const departmentRef = useRef(null);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Crear incidencia | Unisys Training';
    return () => {
      document.title = previousTitle;
    };
  }, []);

  const updateField = (event) => {
    const { name, type, checked, value } = event.target;
    setIncident((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setFeedback('');
  };

  const resetIncident = () => {
    setIncident(INITIAL_INCIDENT);
    setErrors({});
    setFeedback('');
    setAttachments([]);
    setAffectedAreas([]);
    setCommentDraft('');
    setIsCommentPublic(false);
    setComments([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFiles = (event) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    setAttachments((current) => [...current, ...selectedFiles]);
    event.target.value = '';
  };

  const addAffectedArea = () => {
    const department = incident.affectedDepartment.trim();
    if (!department) {
      departmentRef.current?.focus();
      setErrors((current) => ({ ...current, affectedDepartment: 'Escribe un departamento para agregarlo.' }));
      return;
    }
    setAffectedAreas((current) => [...current, department]);
    setIncident((current) => ({ ...current, affectedDepartment: '' }));
    setErrors((current) => ({ ...current, affectedDepartment: '' }));
  };

  const publishComment = (event) => {
    event.preventDefault();
    const text = commentDraft.trim();
    if (!text) return;

    setComments((current) => [
      { id: `${Date.now()}-${current.length}`, text, isPublic: isCommentPublic },
      ...current,
    ]);
    setCommentDraft('');
    setIsCommentPublic(false);
  };

  const isRequiredFieldComplete = (field) => {
    if (!String(incident[field]).trim()) return false;
    if (field === 'clientPhone') return /^[+\d\s().-]{7,20}$/.test(incident.clientPhone.trim());
    return true;
  };

  const saveIncident = (event) => {
    event.preventDefault();
    const nextErrors = {};
    Object.entries(REQUIRED_FIELDS).forEach(([field, message]) => {
      if (!String(incident[field]).trim()) nextErrors[field] = message;
    });
    if (incident.clientPhone && !/^[+\d\s().-]{7,20}$/.test(incident.clientPhone.trim())) {
      nextErrors.clientPhone = 'Ingresa un teléfono válido.';
    }
    if (incident.clientEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(incident.clientEmail.trim())) {
      nextErrors.clientEmail = 'Ingresa un correo electrónico válido.';
    }
    if (incident.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(incident.contactEmail.trim())) {
      nextErrors.contactEmail = 'Ingresa un correo electrónico válido.';
    }
    setErrors(nextErrors);

    const firstInvalid = Object.keys(nextErrors)[0];
    if (firstInvalid) {
      document.querySelector(`[name="${firstInvalid}"]`)?.focus();
      setFeedback('Revisa los campos marcados para continuar.');
      return;
    }
    onSaveIncident({
      ...incident,
      number: ticketNumber,
      requiredFieldsCompleted: REQUIRED_FIELD_LABELS.filter(([field]) => isRequiredFieldComplete(field)).length,
      requiredFieldsTotal: REQUIRED_FIELD_LABELS.length,
      createdAt: new Date().toISOString(),
    });
  };

  const renderField = (name, label, options = {}) => {
    const {
      required = false,
      placeholder = '',
      type = 'text',
      selectOptions,
      className = '',
      inputRef,
      rows,
    } = options;
    const error = errors[name];

    return (
      <label className={`incident-page-field${className ? ` ${className}` : ''}`} key={name}>
        <span className="incident-page-label">
          {label}{required && <b> (obligatorio)</b>}
        </span>
        {selectOptions ? (
          <select
            aria-describedby={error ? `${name}-error` : undefined}
            aria-invalid={Boolean(error)}
            name={name}
            onChange={updateField}
            required={required}
            value={incident[name]}
          >
            {!incident[name] && <option value="">Seleccionar</option>}
            {selectOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        ) : rows ? (
          <textarea
            aria-describedby={error ? `${name}-error` : undefined}
            aria-invalid={Boolean(error)}
            maxLength={2000}
            name={name}
            onChange={updateField}
            placeholder={placeholder}
            required={required}
            rows={rows}
            value={incident[name]}
          />
        ) : (
          <input
            aria-describedby={error ? `${name}-error` : undefined}
            aria-invalid={Boolean(error)}
            autoComplete={type === 'email' ? 'email' : undefined}
            maxLength={type === 'tel' ? 20 : 160}
            name={name}
            onChange={updateField}
            placeholder={placeholder}
            ref={inputRef}
            required={required}
            type={type}
            value={incident[name]}
          />
        )}
        {error && <small className="incident-page-error" id={`${name}-error`}>{error}</small>}
      </label>
    );
  };

  const renderOptions = (name, label, required = false) => {
    const error = errors[name];

    return (
      <label className="incident-page-field" key={name}>
        <span className="incident-page-label">
          {label}{required && <b> (obligatorio)</b>}
        </span>
        <select
          aria-describedby={error ? `${name}-error` : undefined}
          aria-invalid={Boolean(error)}
          name={name}
          onChange={updateField}
          required={required}
          value={incident[name]}
        >
        <option value="">Seleccionar</option>
        {FIELD_OPTIONS[name].map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
        {error && <small className="incident-page-error" id={`${name}-error`}>{error}</small>}
      </label>
    );
  };

  const renderSectionHeading = (title) => <h2 className="incident-section-heading">{title}</h2>;

  return (
    <main className="incident-page">
      <header className="recorder-topbar">
        <div className="recorder-brand-nav">
          <span className="recorder-brand">Unisys Training</span>
          <nav className="recorder-tabs" aria-label="Navegación principal">
            <button className="recorder-tab" onClick={onOpenPanel} type="button">Panel</button>
            <button className="recorder-tab recorder-tab--active" onClick={onOpenRecorder} type="button">
              Registrador inteligente
            </button>
          </nav>
        </div>
        <div className="recorder-user-nav">
          <AppSearch
            onCreateTicket={onOpenRecorder}
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

      <div className="incident-page-titlebar">
        <h1>Crear incidencia</h1>
        <span>{ticketNumber}</span>
      </div>

      <div className="incident-page-workspace">
        <form className="incident-details-form" noValidate onSubmit={saveIncident}>
          <section className="incident-form-section incident-form-section--summary">
            {renderField('summary', 'Resumen', {
              required: true,
              placeholder: 'Escribe un resumen de la incidencia',
            })}
          </section>

          <section className="incident-form-section incident-form-grid incident-form-grid--three">
            {renderOptions('impact', 'Impacto', true)}
            {renderOptions('priority', 'Prioridad', true)}
            {renderField('specialTreatment', 'Tratamiento Especial')}
          </section>

          <section className="incident-form-section incident-form-grid incident-form-grid--three incident-form-grid--status">
            {renderOptions('status', 'Estado', true)}
          </section>

          <section className="incident-form-section incident-form-grid incident-form-grid--three">
            {renderField('client', 'Cliente', { required: true })}
            {renderField('clientPhone', 'Teléfono del cliente', { required: true, type: 'tel', placeholder: '###' })}
            {renderField('zone', 'Zona')}
            {renderField('company', 'Empresa', { required: true })}
            {renderField('clientEmail', 'Correo electrónico del cliente', { type: 'email' })}
            {renderField('locationGroup', 'Grupo de ubicaciones')}
            {renderField('organization', 'Organización')}
            {renderField('providerTicket', 'Número ticket proveedor')}
            {renderField('clientSite', 'Sitio del cliente')}
            {renderField('contact', 'Contacto')}
            {renderField('contactPhone', 'Teléfono de contacto', { type: 'tel' })}
            {renderField('contactEmail', 'Correo electrónico de contacto', { type: 'email' })}
          </section>

          <section className="incident-form-section incident-form-grid incident-form-grid--three incident-form-grid--classify">
            {renderField('incidentType', 'Tipo de incidencia', {
              required: true,
              selectOptions: FIELD_OPTIONS.incidentType,
            })}
            {renderField('configurationItem', 'CI', { placeholder: 'Escriba el nombre de un activo' })}
            <label className="incident-page-checkbox">
              <input
                checked={incident.otherCompanyCategories}
                name="otherCompanyCategories"
                onChange={updateField}
                type="checkbox"
              />
              <span>Seleccionar categorías de otra empresa</span>
            </label>
            {renderField('operationalCategory', 'Categoría operacional', { placeholder: 'Empiece a escribir...' })}
            {renderField('resolutionCategory', 'Categoría de resolución', { placeholder: 'Empiece a escribir...' })}
            {renderField('service', 'Servicio', { placeholder: 'Escriba el nombre de un servicio' })}
            {renderOptions('reportedSource', 'Fuente reportada')}
            {renderField('productCategory', 'Categoría de productos', { placeholder: 'Empiece a escribir...' })}
            {renderField('resolutionProductCategory', 'Categoría de producto de resolución', { placeholder: 'Empiece a escribir...' })}
            <div className="incident-description-row">
              {renderField('description', 'Descripción', { className: 'incident-page-field--description', rows: 5 })}
              <aside className="incident-required-legend" aria-label="Leyenda de campos obligatorios">
                <h3>Campos obligatorios</h3>
                <ul>
                  {REQUIRED_FIELD_LABELS.map(([field, label]) => {
                    const isComplete = isRequiredFieldComplete(field);
                    return (
                      <li className={isComplete ? 'incident-required-item incident-required-item--complete' : 'incident-required-item'} key={field}>
                        <span aria-label={isComplete ? 'Completo' : 'Pendiente'} className="incident-required-indicator" />
                        <span>{label} es un campo obligatorio</span>
                      </li>
                    );
                  })}
                </ul>
              </aside>
            </div>
            <div className="incident-attachment-area">
              <input
                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.txt"
                className="incident-file-input"
                multiple
                onChange={handleFiles}
                ref={fileInputRef}
                type="file"
              />
              <button className="incident-attach-button" onClick={() => fileInputRef.current?.click()} type="button">
                <span aria-hidden="true">⌁</span> Adjuntar archivos
              </button>
              {attachments.length > 0 && (
                <ul className="incident-attachment-list" aria-label="Archivos adjuntos">
                  {attachments.map((file, index) => (
                    <li key={`${file.name}-${file.lastModified}-${index}`}>
                      <span>{file.name}</span>
                      <button
                        aria-label={`Quitar ${file.name}`}
                        onClick={() => setAttachments((current) => current.filter((_, fileIndex) => fileIndex !== index))}
                        type="button"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <section className="incident-form-section incident-areas-section">
            {renderSectionHeading('Áreas impactadas')}
            <div className="incident-form-grid incident-form-grid--three">
              {renderField('affectedCompany', 'Empresa', { placeholder: 'Empiece a escribir el nombre de la empresa' })}
              {renderField('affectedZone', 'Zona', { placeholder: 'Empiece a escribir la región' })}
              {renderField('affectedLocationGroup', 'Grupo de ubicaciones', { placeholder: 'Empiece a escribir el grupo' })}
              {renderField('affectedLocation', 'Ubicación', { className: 'incident-page-field--wide', placeholder: 'Empiece a escribir el sitio' })}
              {renderField('affectedOrganization', 'Organización', { placeholder: 'Empiece a escribir la organización' })}
              <div className="incident-add-department">
                {renderField('affectedDepartment', 'Departamento', {
                  inputRef: departmentRef,
                  placeholder: 'Empiece a escribir el departamento',
                })}
                <button className="incident-inline-add" onClick={addAffectedArea} type="button">Agregar</button>
              </div>
            </div>
            {affectedAreas.length > 0 && (
              <ul className="incident-area-chips" aria-label="Departamentos agregados">
                {affectedAreas.map((area, index) => (
                  <li key={`${area}-${index}`}>
                    {area}
                    <button
                      aria-label={`Quitar ${area}`}
                      onClick={() => setAffectedAreas((current) => current.filter((_, areaIndex) => areaIndex !== index))}
                      type="button"
                    >×</button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="incident-form-section incident-assigned-section">
            {renderSectionHeading('Usuario asignado')}
            <div className="incident-form-grid incident-form-grid--three">
              {renderOptions('supportGroup', 'Grupo de soporte')}
              {renderField('assignedBy', 'Diligenciado por', { placeholder: 'Nombre de quien diligencia...' })}
            </div>
          </section>
        </form>

        <aside className="incident-resources-panel" aria-label="Actividad y recursos">
          <div className="incident-resource-tabs" role="tablist" aria-label="Panel lateral">
            <button
              aria-selected={activeTab === 'activity'}
              className={activeTab === 'activity' ? 'incident-resource-tab incident-resource-tab--active' : 'incident-resource-tab'}
              onClick={() => setActiveTab('activity')}
              role="tab"
              type="button"
            >
              Actividad
            </button>
            <button
              aria-selected={activeTab === 'resources'}
              className={activeTab === 'resources' ? 'incident-resource-tab incident-resource-tab--active' : 'incident-resource-tab'}
              onClick={() => setActiveTab('resources')}
              role="tab"
              type="button"
            >
              Recursos
            </button>
          </div>
          <div className="incident-resource-content">
            {activeTab === 'activity' ? (
              <div className="incident-activity-content" role="tabpanel">
                <form className="incident-comment-form" onSubmit={publishComment}>
                  <label htmlFor="incident-comment">Agregar comentario</label>
                  <textarea
                    id="incident-comment"
                    maxLength={2000}
                    onChange={(event) => setCommentDraft(event.target.value)}
                    placeholder="Escribe un comentario sobre este caso..."
                    rows={4}
                    value={commentDraft}
                  />
                  <div className="incident-comment-actions">
                    <label className="incident-comment-public">
                      <input
                        checked={isCommentPublic}
                        onChange={(event) => setIsCommentPublic(event.target.checked)}
                        type="checkbox"
                      />
                      <span>Público</span>
                    </label>
                    <button disabled={!commentDraft.trim()} type="submit">Publicar</button>
                  </div>
                </form>
                <div className="incident-comment-list" aria-live="polite">
                  {comments.length > 0 ? comments.map((comment) => (
                    <article className="incident-comment" key={comment.id}>
                      <div className="incident-comment-meta">
                        <strong>Jhon Pulido</strong>
                        <span>{comment.isPublic ? 'Público' : 'Interno'} · Ahora</span>
                      </div>
                      <p>{comment.text}</p>
                    </article>
                  )) : (
                    <p className="incident-comment-empty">Los comentarios y actualizaciones aparecerán aquí.</p>
                  )}
                </div>
              </div>
            ) : (
              <div role="tabpanel">
                <section className="incident-resource-section">
                  <button className="incident-resource-action" onClick={() => setFeedback('Buscando posibles causas relacionadas con la incidencia.')} type="button">
                    Explorar posibles causas
                  </button>
                  <h2>Interrupciones de servicio</h2>
                  <p>No se encontraron interrupciones de servicio</p>
                </section>
                <section className="incident-resource-section">
                  <div className="incident-resource-heading">
                    <h2>Documentos recomendados (15)</h2>
                  </div>
                  <button className="incident-resource-action" onClick={() => setFeedback('Búsqueda de recursos de conocimiento lista.')} type="button">
                    Buscar recursos de conocimientos
                  </button>
                  <div className="incident-resource-pagination">
                    <span>Registros desde {(documentPage - 1) * 4 + 1} hasta {Math.min(documentPage * 4, 15)} de 15</span>
                    <button type="button">▽ Todo</button>
                  </div>
                  <ul className="incident-resource-list">
                    {RESOURCE_DOCUMENTS.map(([id, title, score, views, tickets]) => (
                      <li key={id}>
                        <span className="incident-resource-checkbox" aria-hidden="true" />
                        <div>
                          <strong>{id}</strong>
                          <a href="#incident-resources" onClick={(event) => event.preventDefault()}>{title}</a>
                          <span className="incident-resource-meta">Estado: Publicado</span>
                          <span className="incident-resource-meta">Version 1 · 15/10/2026</span>
                          <span className="incident-resource-stats">{score} &nbsp; {views} &nbsp; {tickets}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="incident-pagination-controls" aria-label="Páginas de documentos">
                    <button disabled={documentPage === 1} onClick={() => setDocumentPage((page) => Math.max(1, page - 1))} type="button">‹</button>
                    {[1, 2, 3, 4].map((page) => (
                      <button
                        aria-current={documentPage === page ? 'page' : undefined}
                        className={documentPage === page ? 'incident-page-number incident-page-number--active' : 'incident-page-number'}
                        key={page}
                        onClick={() => setDocumentPage(page)}
                        type="button"
                      >{page}</button>
                    ))}
                    <button disabled={documentPage === 4} onClick={() => setDocumentPage((page) => Math.min(4, page + 1))} type="button">›</button>
                  </div>
                </section>
                <section className="incident-resource-section incident-recommended-tickets">
                  <div className="incident-resource-heading">
                    <h2>Tickets recomendados (15)</h2>
                    <button type="button">Avanzado</button>
                  </div>
                  <div className="incident-resource-pagination">
                    <span>Registros desde {(ticketPage - 1) * 4 + 1} hasta {ticketPage * 4} de 15</span>
                    <button type="button">Marcar como duplicado</button>
                  </div>
                  {RECOMMENDED_TICKETS.map(([id, title]) => (
                    <article className="incident-ticket-card" key={id}>
                      <span className="incident-ticket-radio" aria-hidden="true" />
                      <div><strong>{id}</strong><span>{title}</span><small>Actualizado: 15/10/2026</small></div>
                    </article>
                  ))}
                  <div className="incident-pagination-controls" aria-label="Páginas de tickets">
                    <button disabled={ticketPage === 1} onClick={() => setTicketPage((page) => Math.max(1, page - 1))} type="button">‹</button>
                    {[1, 2, 3, 4].map((page) => (
                      <button
                        aria-current={ticketPage === page ? 'page' : undefined}
                        className={ticketPage === page ? 'incident-page-number incident-page-number--active' : 'incident-page-number'}
                        key={page}
                        onClick={() => setTicketPage(page)}
                        type="button"
                      >{page}</button>
                    ))}
                    <button disabled={ticketPage === 4} onClick={() => setTicketPage((page) => Math.min(4, page + 1))} type="button">›</button>
                  </div>
                </section>
              </div>
            )}
          </div>
        </aside>
      </div>

      {feedback && (
        <div className={errors && Object.keys(errors).length ? 'incident-page-feedback incident-page-feedback--error' : 'incident-page-feedback'} role="status">
          <span aria-hidden="true">{Object.keys(errors).length ? '!' : '✓'}</span>
          {feedback}
          <button aria-label="Cerrar mensaje" onClick={() => setFeedback('')} type="button">×</button>
        </div>
      )}
      <footer className="incident-page-footer">
        <button className="incident-page-reset" onClick={resetIncident} type="button">Volver a empezar</button>
        <button className="incident-page-save" onClick={saveIncident} type="button">
          <span aria-hidden="true">✓</span> Guardar
        </button>
      </footer>
    </main>
  );
}

export default IncidentPage;
