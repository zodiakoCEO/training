import { useEffect, useState } from 'react';
import AppSearch from '../components/molecules/AppSearch.jsx';
import NotificationBell from '../components/molecules/NotificationBell.jsx';
import UserMenu from '../components/molecules/UserMenu.jsx';

function formatDuration(durationMs) {
  const totalSeconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function CasePanel({ onOpenPanel, onOpenRecorder, onOpenIncident, onOpenWorkOrder, onLogout, isTicketNotificationUnread, onMarkTicketNotificationRead, tickets, incidentStartedAt }) {
  const [isTicketMenuOpen, setIsTicketMenuOpen] = useState(false);
  const [ticketType, setTicketType] = useState('');
  const [selectedTicketNumber, setSelectedTicketNumber] = useState('');
  const [chartMetric, setChartMetric] = useState('duration');
  const [currentTime, setCurrentTime] = useState(incidentStartedAt ?? 0);
  const runningDurationMs = incidentStartedAt ? Math.max(0, currentTime - incidentStartedAt) : null;
  const selectedTicket = tickets.find((ticket) => ticket.number === selectedTicketNumber) ?? tickets[0];
  const averageDurationMs = tickets.length
    ? tickets.reduce((total, ticket) => total + ticket.durationMs, 0) / tickets.length
    : 0;
  const getCompletionRate = (ticket) => (
    ticket?.requiredFieldsTotal
      ? (ticket.requiredFieldsCompleted / ticket.requiredFieldsTotal) * 100
      : 0
  );
  const averageCompletionRate = tickets.length
    ? tickets.reduce((total, ticket) => total + getCompletionRate(ticket), 0) / tickets.length
    : 0;
  const hasChartData = Boolean(selectedTicket) || runningDurationMs !== null;
  const selectedMetricValue = chartMetric === 'duration'
    ? selectedTicket?.durationMs ?? runningDurationMs ?? 0
    : getCompletionRate(selectedTicket);
  const averageMetricValue = chartMetric === 'duration' ? averageDurationMs : averageCompletionRate;
  const chartMaxValue = Math.max(selectedMetricValue, averageMetricValue, chartMetric === 'duration' ? 10000 : 100);
  const formatMetricValue = chartMetric === 'duration'
    ? (value) => formatDuration(value)
    : (value) => `${Math.round(value)}%`;
  const selectedCreatedAt = selectedTicket?.createdAt ? new Date(selectedTicket.createdAt) : null;
  const createdAtLabel = selectedCreatedAt && !Number.isNaN(selectedCreatedAt.getTime())
    ? selectedCreatedAt.toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })
    : 'Sin datos';
  const priorityScore = { Baja: 1, Media: 2, Alta: 3, Crítica: 4 }[selectedTicket?.priority] ?? 0;

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Panel | Unisys Training';

    return () => {
      document.title = previousTitle;
    };
  }, []);

  useEffect(() => {
    if (incidentStartedAt === null) return undefined;
    let intervalId;
    const initialTickId = window.setTimeout(() => {
      setCurrentTime(Date.now());
      intervalId = window.setInterval(() => setCurrentTime(Date.now()), 1000);
    }, 0);
    return () => {
      window.clearTimeout(initialTickId);
      window.clearInterval(intervalId);
    };
  }, [incidentStartedAt]);

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
            <p>{tickets.length} {tickets.length === 1 ? 'ticket' : 'tickets'} en total</p>
          </header>
          {tickets.length === 0 ? (
            <div className="case-list-empty">
              <svg className="case-list-empty-icon" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                <rect x="10" y="9" width="28" height="34" rx="4" stroke="currentColor" strokeWidth="3" />
                <rect x="18" y="5" width="12" height="8" rx="3" fill="#dce3e8" stroke="currentColor" strokeWidth="3" />
              </svg>
              <h2>Sin casos guardados</h2>
              <p>Los casos guardados desde el Registrador aparecerán aquí.</p>
            </div>
          ) : (
            <div className="case-ticket-list" aria-label="Tickets guardados">
              {tickets.map((ticket) => (
                <button
                  aria-label={`Ver análisis del ticket ${ticket.number}`}
                  aria-pressed={selectedTicket?.number === ticket.number}
                  className={`case-ticket-item${selectedTicket?.number === ticket.number ? ' case-ticket-item--selected' : ''}`}
                  key={ticket.number}
                  onClick={() => setSelectedTicketNumber(ticket.number)}
                  type="button"
                >
                  <span className="case-ticket-item-heading">
                    <strong>{ticket.summary}</strong>
                    <span>{ticket.number}</span>
                  </span>
                  <span className="case-ticket-item-meta">
                    <span>{ticket.type ?? 'Incidente'}</span>
                    <span>{ticket.status}</span>
                    <span>{ticket.priority}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>

        <aside className="case-panel-insights" aria-label="Análisis del ticket seleccionado">
          <h2>Análisis del ticket</h2>
          {selectedTicket && (
            <p className="case-ticket-selected-label">
              {selectedTicket.number} · {selectedTicket.summary}
            </p>
          )}
          {selectedTicket && (
            <div className="case-ticket-chart-controls" aria-label="Métrica de la gráfica">
              <button
                aria-pressed={chartMetric === 'duration'}
                className={chartMetric === 'duration' ? 'case-ticket-chart-control case-ticket-chart-control--active' : 'case-ticket-chart-control'}
                onClick={() => setChartMetric('duration')}
                type="button"
              >
                Tiempo
              </button>
              <button
                aria-pressed={chartMetric === 'completion'}
                className={chartMetric === 'completion' ? 'case-ticket-chart-control case-ticket-chart-control--active' : 'case-ticket-chart-control'}
                onClick={() => setChartMetric('completion')}
                type="button"
              >
                Campos
              </button>
            </div>
          )}
          <div className="case-ticket-chart">
            <svg
              aria-label={selectedTicket
                ? `${chartMetric === 'duration' ? 'Tiempo de creación' : 'Campos obligatorios completados'} para ${selectedTicket.number}, comparado con el promedio`
                : runningDurationMs !== null
                  ? `Tiempo de creación en curso: ${formatDuration(runningDurationMs)}`
                  : 'No hay datos para mostrar'}
              className="case-ticket-chart-plot"
              role="img"
              viewBox="0 0 360 180"
            >
              {hasChartData && [0, 1, 2, 3, 4].map((index) => {
                const x = 110 + (index * 52);
                return (
                  <g key={index}>
                    <line className="case-ticket-chart-gridline" x1={x} x2={x} y1="30" y2="145" />
                    <text className="case-ticket-chart-axis-label" textAnchor="middle" x={x} y="164">
                      {formatMetricValue((chartMaxValue * index) / 4)}
                    </text>
                  </g>
                );
              })}
              {selectedTicket || runningDurationMs !== null ? (
                <>
                  <text className="case-ticket-chart-row-label" x="4" y="67">
                    {selectedTicket ? 'Este ticket' : 'En curso'}
                  </text>
                  <rect className="case-ticket-chart-track" x="110" y="48" width="208" height="28" rx="8" />
                  <rect
                    className="case-ticket-chart-bar case-ticket-chart-bar--selected"
                    height="28"
                    rx="8"
                    width={Math.max(selectedMetricValue > 0 ? 2 : 0, (selectedMetricValue / chartMaxValue) * 208)}
                    x="110"
                    y="48"
                  >
                    <title>{formatMetricValue(selectedMetricValue)}</title>
                  </rect>
                  <text
                    className="case-ticket-chart-value"
                    x={116 + Math.max(selectedMetricValue > 0 ? 2 : 0, (selectedMetricValue / chartMaxValue) * 208)}
                    y="42"
                  >
                    {formatMetricValue(selectedMetricValue)}
                  </text>
                  {tickets.length > 0 && (
                    <>
                      <text className="case-ticket-chart-row-label" x="4" y="121">Promedio</text>
                      <rect className="case-ticket-chart-track" x="110" y="102" width="208" height="28" rx="8" />
                      <rect
                        className="case-ticket-chart-bar case-ticket-chart-bar--average"
                        height="28"
                        rx="8"
                        width={Math.max(averageMetricValue > 0 ? 2 : 0, (averageMetricValue / chartMaxValue) * 208)}
                        x="110"
                        y="102"
                      >
                        <title>{formatMetricValue(averageMetricValue)}</title>
                      </rect>
                      <text
                        className="case-ticket-chart-value"
                        x={116 + Math.max(averageMetricValue > 0 ? 2 : 0, (averageMetricValue / chartMaxValue) * 208)}
                        y="96"
                      >
                        {formatMetricValue(averageMetricValue)}
                      </text>
                    </>
                  )}
                </>
              ) : (
                <text className="case-ticket-chart-empty" textAnchor="middle" x="210" y="90">
                  Guarda un ticket para ver su gráfica
                </text>
              )}
            </svg>
          </div>
          <p className="case-ticket-chart-caption">
            {selectedTicket
              ? `${chartMetric === 'duration' ? 'Tiempo en mm:ss' : 'Porcentaje de campos completados'} frente al promedio de ${tickets.length} ${tickets.length === 1 ? 'ticket' : 'tickets'}.`
              : 'El tiempo se actualiza mientras completas el ticket.'}
          </p>
          <dl className="case-panel-metrics">
            <div>
              <dt>Tiempo de creación</dt>
              <dd>
                {selectedTicket
                  ? formatDuration(selectedTicket.durationMs)
                  : runningDurationMs !== null
                    ? `${formatDuration(runningDurationMs)} · En curso`
                    : 'Sin datos'}
              </dd>
            </div>
            <div>
              <dt>Campos obligatorios completados</dt>
              <dd>
                {selectedTicket
                  ? `${selectedTicket.requiredFieldsCompleted} de ${selectedTicket.requiredFieldsTotal} (${Math.round(getCompletionRate(selectedTicket))}%)`
                  : 'Sin datos'}
              </dd>
            </div>
            <div>
              <dt>Prioridad</dt>
              <dd>{selectedTicket ? `${selectedTicket.priority}${priorityScore ? ` · ${priorityScore}/4` : ''}` : 'Sin datos'}</dd>
            </div>
            <div>
              <dt>Estado</dt>
              <dd>{selectedTicket?.status ?? 'Sin datos'}</dd>
            </div>
            <div>
              <dt>{selectedTicket?.type === 'Orden de trabajo' ? 'Tipo de ticket' : 'Tipo de incidencia'}</dt>
              <dd>{selectedTicket?.type ?? selectedTicket?.incidentType ?? 'Sin datos'}</dd>
            </div>
            <div>
              <dt>Creado</dt>
              <dd>{selectedTicket ? createdAtLabel : 'Sin datos'}</dd>
            </div>
          </dl>
        </aside>
      </section>

      <footer className="recorder-footer">
        <button className="recorder-reset" onClick={onOpenRecorder} type="button">
          Volver a empezar
        </button>
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

export default CasePanel;
