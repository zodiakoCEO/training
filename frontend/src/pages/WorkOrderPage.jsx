import { useEffect, useRef, useState } from 'react';
import AppSearch from '../components/molecules/AppSearch.jsx';
import NotificationBell from '../components/molecules/NotificationBell.jsx';
import UserMenu from '../components/molecules/UserMenu.jsx';

const INITIAL_WORK_ORDER = {
  summary: '',
  status: 'Asignado',
  statusReason: '',
  priority: 'Baja',
  client: '',
  clientPhone: '',
  zone: '',
  company: '',
  clientEmail: '',
  locationGroup: '',
  organization: '',
  location: '',
  contact: '',
  contactPhone: '',
  contactEmail: '',
  service: '',
  differentCompany: false,
  description: '',
  operationalCategory: '',
  productCategory: '',
  assignedSupportGroup: '',
  managerSupportGroup: '',
  assignedUser: '',
  requestManager: '',
  plannedStart: '',
  plannedEnd: '',
  actualStart: '',
  actualEnd: '',
};

const REQUIRED_FIELDS = {
  summary: 'El resumen es obligatorio.',
  status: 'Selecciona un estado.',
  priority: 'Selecciona una prioridad.',
  client: 'El cliente es obligatorio.',
  company: 'La empresa es obligatoria.',
  assignedSupportGroup: 'El grupo de soporte asignado es obligatorio.',
};

const REQUIRED_FIELD_LABELS = [
  ['summary', 'Resumen'],
  ['status', 'Estado'],
  ['priority', 'Prioridad'],
  ['client', 'Cliente'],
  ['company', 'Empresa'],
  ['assignedSupportGroup', 'Grupo de soporte del usuario asignado'],
];

const FIELD_OPTIONS = {
  status: ['Asignado', 'En progreso', 'Pendiente', 'Cerrado'],
  statusReason: ['En espera de cliente', 'Esperando aprobación', 'Esperando repuesto', 'Otro'],
  priority: ['Crítica', 'Alta', 'Media', 'Baja'],
  assignedSupportGroup: ['Mesa de ayuda', 'Soporte de aplicaciones', 'Infraestructura', 'Redes'],
  managerSupportGroup: ['Mesa de ayuda', 'Soporte de aplicaciones', 'Infraestructura', 'Redes'],
};

function WorkOrderPage({
  onOpenPanel,
  onOpenRecorder,
  onLogout,
  isTicketNotificationUnread,
  onMarkTicketNotificationRead,
  onSaveWorkOrder,
  ticketNumber,
}) {
  const [workOrder, setWorkOrder] = useState(INITIAL_WORK_ORDER);
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState('');
  const [activeTab, setActiveTab] = useState('activity');
  const [activeRelatedTab, setActiveRelatedTab] = useState('tasks');
  const [attachments, setAttachments] = useState([]);
  const [taskDraft, setTaskDraft] = useState('');
  const [tasks, setTasks] = useState([]);
  const [commentDraft, setCommentDraft] = useState('');
  const [isCommentPublic, setIsCommentPublic] = useState(false);
  const [comments, setComments] = useState([]);
  const fileInputRef = useRef(null);
  const startedAtRef = useRef(0);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Crear orden de trabajo | Unisys Training';
    startedAtRef.current = Date.now();
    return () => {
      document.title = previousTitle;
    };
  }, []);

  const updateField = (event) => {
    const { name, type, checked, value } = event.target;
    setWorkOrder((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setFeedback('');
  };

  const resetWorkOrder = () => {
    setWorkOrder(INITIAL_WORK_ORDER);
    setErrors({});
    setFeedback('');
    setAttachments([]);
    setTasks([]);
    setTaskDraft('');
    setCommentDraft('');
    setIsCommentPublic(false);
    setComments([]);
    startedAtRef.current = Date.now();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFiles = (event) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    setAttachments((current) => [...current, ...selectedFiles]);
    event.target.value = '';
  };

  const addTask = () => {
    const title = taskDraft.trim();
    if (!title) return;
    setTasks((current) => [...current, { id: `${Date.now()}-${current.length}`, title, done: false }]);
    setTaskDraft('');
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

  const saveWorkOrder = (event) => {
    event.preventDefault();
    const nextErrors = {};
    Object.entries(REQUIRED_FIELDS).forEach(([field, message]) => {
      if (!String(workOrder[field]).trim()) nextErrors[field] = message;
    });
    if (workOrder.clientEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(workOrder.clientEmail.trim())) {
      nextErrors.clientEmail = 'Ingresa un correo electrónico válido.';
    }
    if (workOrder.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(workOrder.contactEmail.trim())) {
      nextErrors.contactEmail = 'Ingresa un correo electrónico válido.';
    }
    setErrors(nextErrors);

    const firstInvalid = Object.keys(nextErrors)[0];
    if (firstInvalid) {
      document.querySelector(`[name="${firstInvalid}"]`)?.focus();
      setFeedback('Revisa los campos marcados para continuar.');
      return;
    }

    onSaveWorkOrder({
      ...workOrder,
      type: 'Orden de trabajo',
      number: ticketNumber,
      durationMs: Date.now() - (startedAtRef.current || Date.now()),
      attachments,
      comments,
      requiredFieldsCompleted: REQUIRED_FIELD_LABELS.length,
      requiredFieldsTotal: REQUIRED_FIELD_LABELS.length,
      tasks,
      createdAt: new Date().toISOString(),
    });
  };

  const renderField = (name, label, options = {}) => {
    const {
      required = false,
      placeholder = '',
      type = 'text',
      selectOptions,
      rows,
      wide = false,
    } = options;
    const error = errors[name];

    return (
      <label className={`incident-page-field${wide ? ' incident-page-field--wide' : ''}`} key={name}>
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
            value={workOrder[name]}
          >
            {!workOrder[name] && <option value="">Seleccionar</option>}
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
            value={workOrder[name]}
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
            required={required}
            type={type}
            value={workOrder[name]}
          />
        )}
        {error && <small className="incident-page-error" id={`${name}-error`}>{error}</small>}
      </label>
    );
  };

  const renderSelect = (name, label, required = false) => renderField(name, label, {
    required,
    selectOptions: FIELD_OPTIONS[name],
  });

  return (
    <main className="incident-page work-order-page">
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
        <h1>Crear orden de trabajo</h1>
        <span>{ticketNumber}</span>
      </div>

      <div className="incident-page-workspace">
        <form className="incident-details-form" noValidate onSubmit={saveWorkOrder}>
          <section className="incident-form-section incident-form-section--summary">
            {renderField('summary', 'Resumen', {
              required: true,
              placeholder: 'Escribe un resumen de la orden de trabajo',
            })}
          </section>

          <section className="incident-form-section incident-form-grid incident-form-grid--three">
            {renderSelect('status', 'Estado', true)}
            {renderSelect('statusReason', 'Motivo del estado')}
            {renderSelect('priority', 'Prioridad', true)}
          </section>

          <section className="incident-form-section incident-form-grid incident-form-grid--three">
            {renderField('client', 'Cliente', { required: true, placeholder: 'Nombre del cliente' })}
            {renderField('clientPhone', 'Teléfono del cliente', { type: 'tel', placeholder: 'Número de teléfono' })}
            {renderField('zone', 'Zona', { placeholder: 'Región o ciudad' })}
            {renderField('company', 'Empresa', { required: true, placeholder: 'Nombre de la empresa' })}
            {renderField('clientEmail', 'Correo electrónico del cliente', { type: 'email', placeholder: 'correo@empresa.com' })}
            {renderField('locationGroup', 'Grupo de ubicaciones', { placeholder: 'Grupo de ubicaciones' })}
            {renderField('organization', 'Organización', { placeholder: 'Organización' })}
            {renderField('location', 'Ubicación', { placeholder: 'Ubicación del servicio' })}
          </section>

          <section className="incident-form-section incident-form-grid incident-form-grid--three">
            {renderField('contact', 'Contacto', { placeholder: 'Nombre del contacto' })}
            {renderField('contactPhone', 'Teléfono de contacto', { type: 'tel', placeholder: 'Número de teléfono' })}
            {renderField('contactEmail', 'Correo electrónico de contacto', { type: 'email', placeholder: 'correo@empresa.com' })}
          </section>

          <section className="incident-form-section work-order-details-section">
            <div className="incident-form-grid incident-form-grid--three">
              {renderField('service', 'Servicio', { placeholder: 'Escriba el nombre de un servicio' })}
              <label className="incident-page-checkbox">
                <input
                  checked={workOrder.differentCompany}
                  name="differentCompany"
                  onChange={updateField}
                  type="checkbox"
                />
                <span>Utilizar una empresa distinta</span>
              </label>
            </div>
            <div className="work-order-description-grid">
              {renderField('description', 'Descripción', {
                placeholder: 'Describe el trabajo solicitado',
                rows: 5,
              })}
              <div className="work-order-categories">
                {renderField('operationalCategory', 'Categoría operacional', { placeholder: 'Empiece a escribir para ver las categorías' })}
                {renderField('productCategory', 'Categoría de productos', { placeholder: 'Empiece a escribir para ver las categorías' })}
              </div>
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

          <section className="incident-form-section">
            <h2 className="incident-section-heading">Asignación</h2>
            <div className="incident-form-grid incident-form-grid--two">
              {renderSelect('assignedSupportGroup', 'Grupo de soporte del usuario asignado', true)}
              {renderSelect('managerSupportGroup', 'Grupo de soporte de gestor')}
              {renderField('assignedUser', 'Usuario asignado a petición', { placeholder: 'Empiece a escribir para buscar un usuario' })}
              {renderField('requestManager', 'Gestor de peticiones', { placeholder: 'Empiece a escribir para buscar un gestor' })}
            </div>
          </section>

          <section className="incident-form-section">
            <div className="work-order-date-grid">
              <fieldset className="work-order-date-group">
                <legend>Fechas programadas</legend>
                {renderField('plannedStart', 'Fecha de inicio', { type: 'date' })}
                {renderField('plannedEnd', 'Fecha de fin', { type: 'date' })}
              </fieldset>
              <fieldset className="work-order-date-group">
                <legend>Fechas reales</legend>
                {renderField('actualStart', 'Fecha de inicio', { type: 'date' })}
                {renderField('actualEnd', 'Fecha de fin', { type: 'date' })}
              </fieldset>
            </div>
          </section>

          <section className="incident-form-section work-order-related-section">
            <div className="work-order-related-tabs" role="tablist" aria-label="Elementos relacionados">
              {[
                ['tasks', 'Tareas', tasks.length],
                ['configuration', 'Elementos de configuración', 0],
                ['related', 'Elementos relacionados', 0],
              ].map(([tab, label]) => (
                <button
                  aria-selected={activeRelatedTab === tab}
                  className={activeRelatedTab === tab ? 'work-order-related-tab work-order-related-tab--active' : 'work-order-related-tab'}
                  key={tab}
                  onClick={() => setActiveRelatedTab(tab)}
                  role="tab"
                  type="button"
                >
                  {label}<span>{tab === 'tasks' ? tasks.length : 0}</span>
                </button>
              ))}
            </div>
            {activeRelatedTab === 'tasks' ? (
              <div className="work-order-tasks" role="tabpanel">
                <div className="work-order-task-form">
                  <input
                    aria-label="Nombre de la tarea"
                    onChange={(event) => setTaskDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        addTask();
                      }
                    }}
                    placeholder="Agregar una tarea a esta orden"
                    value={taskDraft}
                  />
                  <button disabled={!taskDraft.trim()} onClick={addTask} type="button">+ Agregar tarea</button>
                </div>
                {tasks.length > 0 && (
                  <ul className="work-order-task-list">
                    {tasks.map((task) => (
                      <li key={task.id}>
                        <label>
                          <input
                            checked={task.done}
                            onChange={(event) => setTasks((current) => current.map((item) => (
                              item.id === task.id ? { ...item, done: event.target.checked } : item
                            )))}
                            type="checkbox"
                          />
                          <span>{task.title}</span>
                        </label>
                        <button
                          aria-label={`Eliminar tarea ${task.title}`}
                          onClick={() => setTasks((current) => current.filter((item) => item.id !== task.id))}
                          type="button"
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <p className="work-order-related-empty" role="tabpanel">
                {activeRelatedTab === 'configuration'
                  ? 'No hay elementos de configuración vinculados.'
                  : 'No hay elementos relacionados.'}
              </p>
            )}
          </section>
        </form>

        <aside className="incident-resources-panel" aria-label="Actividad y recursos">
          <div className="incident-resource-tabs" role="tablist" aria-label="Panel lateral">
            {['activity', 'resources'].map((tab) => (
              <button
                aria-selected={activeTab === tab}
                className={activeTab === tab ? 'incident-resource-tab incident-resource-tab--active' : 'incident-resource-tab'}
                key={tab}
                onClick={() => setActiveTab(tab)}
                role="tab"
                type="button"
              >
                {tab === 'activity' ? 'Actividad' : 'Recursos'}
              </button>
            ))}
          </div>
          <div className="incident-resource-content">
            {activeTab === 'activity' ? (
              <div className="incident-activity-content" role="tabpanel">
                <form className="incident-comment-form" onSubmit={publishComment}>
                  <label htmlFor="work-order-comment">Nueva nota</label>
                  <textarea
                    id="work-order-comment"
                    maxLength={2000}
                    onChange={(event) => setCommentDraft(event.target.value)}
                    placeholder="Empiece a escribir para agregar una nota. Utilice @ para buscar personas o activos."
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
                    <p className="incident-comment-empty">Ninguna actividad</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="incident-activity-content" role="tabpanel">
                <section className="incident-resource-section">
                  <h2>Recursos</h2>
                  <p>Los recursos relacionados con esta orden de trabajo aparecerán aquí.</p>
                </section>
              </div>
            )}
          </div>
        </aside>
      </div>

      {feedback && (
        <div className={Object.keys(errors).length ? 'incident-page-feedback incident-page-feedback--error' : 'incident-page-feedback'} role="status">
          <span aria-hidden="true">{Object.keys(errors).length ? '!' : 'i'}</span>
          {feedback}
          <button aria-label="Cerrar mensaje" onClick={() => setFeedback('')} type="button">×</button>
        </div>
      )}

      <footer className="incident-page-footer">
        <button className="incident-page-reset" onClick={resetWorkOrder} type="button">Limpiar formulario</button>
        <button className="incident-page-save" onClick={saveWorkOrder} type="button">Crear orden de trabajo</button>
      </footer>
    </main>
  );
}

export default WorkOrderPage;
