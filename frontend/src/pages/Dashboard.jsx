import { useEffect, useRef, useState } from 'react';
import { PageHeader } from '../components/molecules/PageHeader';
import { ProjectGrid } from '../components/organisms/project-bar/ProjectGrid';
import CreateProjectModal from '../components/organisms/project-bar/CreateProjectModal.jsx';
import { DashboardTemplate } from '../components/templates/DashboardTemplate';
import ProjectLogin from './ProjectLogin.jsx';
import CasePanel from './CasePanel.jsx';
import SmartRecorder from './SmartRecorder.jsx';
import IncidentPage from './IncidentPage.jsx';
import WorkOrderPage from './WorkOrderPage.jsx';

const INITIAL_PROJECTS = [
	{ id: 'project-1', name: 'Proyecto A', shape: 'square', loginEnabled: true },
	{ id: 'project-2', name: 'Proyecto B', shape: 'circle' },
];

function Dashboard() {
	const [projects, setProjects] = useState(INITIAL_PROJECTS);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const [currentPage, setCurrentPage] = useState('projects');
	const [tickets, setTickets] = useState([]);
	const [incidentStartedAt, setIncidentStartedAt] = useState(null);
	const [isTicketNotificationUnread, setIsTicketNotificationUnread] = useState(true);
	const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
	const [projectToEdit, setProjectToEdit] = useState(null);
	const logoutTimerRef = useRef(null);

	const handleLogout = () => {
		if (logoutTimerRef.current !== null) return;

		setIsLoggingOut(true);
		logoutTimerRef.current = window.setTimeout(() => {
			setIsAuthenticated(false);
			setCurrentPage('projects');
			setTickets([]);
			setIncidentStartedAt(null);
			setIsTicketNotificationUnread(true);
			setIsCreateProjectOpen(false);
			setProjectToEdit(null);
			logoutTimerRef.current = null;
			setIsLoggingOut(false);
		}, 2500);
	};

	useEffect(() => () => {
		if (logoutTimerRef.current !== null) {
			window.clearTimeout(logoutTimerRef.current);
		}
	}, []);

	const openPage = (page) => setCurrentPage(page);

	const handleSaveIncident = (incident) => {
		setTickets((currentTickets) => [incident, ...currentTickets]);
		setIncidentStartedAt(null);
		setCurrentPage('panel');
	};

	const handleSaveWorkOrder = (workOrder) => {
		setTickets((currentTickets) => [workOrder, ...currentTickets]);
		setCurrentPage('panel');
	};

	const startIncident = () => {
		setIncidentStartedAt(Date.now());
		setCurrentPage('incident');
	};

	const startWorkOrder = () => setCurrentPage('work-order');

	const nextTicketNumber = `Ticket${String(381268 + tickets.length).padStart(9, '0')}`;

	if (isLoggingOut) {
		return (
			<main aria-atomic="true" aria-busy="true" aria-live="polite" className="logout-screen" role="status">
				<section className="logout-card">
					<p className="logout-eyebrow">HASTA PRONTO</p>
					<h1>Cerrando sesión</h1>
					<p className="logout-message">Estamos cerrando tu sesión y preparando tus proyectos.</p>
					<div aria-hidden="true" className="logout-progress">
						<span />
					</div>
					<p className="logout-caption">Esto solo tomará unos segundos</p>
				</section>
			</main>
		);
	}

	if (currentPage === 'login' && !isAuthenticated) {
		return (
			<ProjectLogin
				onBack={() => openPage('projects')}
				onLogin={() => {
					setIsAuthenticated(true);
					openPage('recorder');
				}}
			/>
		);
	}

	if (isAuthenticated && currentPage === 'incident') {
		return (
			<IncidentPage
				isTicketNotificationUnread={isTicketNotificationUnread}
				onMarkTicketNotificationRead={() => setIsTicketNotificationUnread(false)}
				onLogout={handleLogout}
				onOpenPanel={() => openPage('panel')}
				onOpenRecorder={() => openPage('recorder')}
				onSaveIncident={(incident) => handleSaveIncident({
					...incident,
					durationMs: Date.now() - incidentStartedAt,
				})}
				ticketNumber={nextTicketNumber}
			/>
		);
	}

	if (isAuthenticated && currentPage === 'work-order') {
		return (
			<WorkOrderPage
				isTicketNotificationUnread={isTicketNotificationUnread}
				onMarkTicketNotificationRead={() => setIsTicketNotificationUnread(false)}
				onLogout={handleLogout}
				onOpenPanel={() => openPage('panel')}
				onOpenRecorder={() => openPage('recorder')}
				onSaveWorkOrder={handleSaveWorkOrder}
				ticketNumber={nextTicketNumber}
			/>
		);
	}

	if (isAuthenticated && currentPage === 'recorder') {
		return (
			<SmartRecorder
				isTicketNotificationUnread={isTicketNotificationUnread}
				onMarkTicketNotificationRead={() => setIsTicketNotificationUnread(false)}
				onLogout={handleLogout}
				onOpenPanel={() => openPage('panel')}
				onOpenRecorder={() => openPage('recorder')}
				onOpenIncident={startIncident}
				onOpenWorkOrder={startWorkOrder}
			/>
		);
	}

	if (isAuthenticated) {
		return (
			<CasePanel
				isTicketNotificationUnread={isTicketNotificationUnread}
				onMarkTicketNotificationRead={() => setIsTicketNotificationUnread(false)}
				onLogout={handleLogout}
				onOpenPanel={() => openPage('panel')}
				onOpenRecorder={() => openPage('recorder')}
				onOpenIncident={startIncident}
				onOpenWorkOrder={startWorkOrder}
				incidentStartedAt={incidentStartedAt}
				tickets={tickets}
			/>
		);
	}

	const handleSaveProject = ({ name, imageUrl }) => {
		if (projectToEdit) {
			setProjects((currentProjects) => currentProjects.map((project) => (
				project.id === projectToEdit.id
					? { ...project, name, imageUrl }
					: project
			)));
			setProjectToEdit(null);
			return;
		}

		setProjects((currentProjects) => {
			return [
				...currentProjects,
				{
					id: `project-${Date.now()}`,
					name,
					imageUrl,
					shape: currentProjects.length % 2 === 0 ? 'circle' : 'square',
				},
			];
		});
		setIsCreateProjectOpen(false);
	};

	return (
		<>
			<DashboardTemplate
				header={<PageHeader eyebrow="Panel de control" title="Mis proyectos" />}
			>
				<ProjectGrid
					projects={projects}
					onCreateProject={() => setIsCreateProjectOpen(true)}
					onEditProject={setProjectToEdit}
					onOpenProject={() => openPage('login')}
				/>
			</DashboardTemplate>
			{(isCreateProjectOpen || projectToEdit) && (
				<CreateProjectModal
					key={projectToEdit?.id ?? 'create-project'}
					onClose={() => {
						setIsCreateProjectOpen(false);
						setProjectToEdit(null);
					}}
					onSave={handleSaveProject}
					project={projectToEdit}
				/>
			)}
		</>
	);
}

export default Dashboard;
