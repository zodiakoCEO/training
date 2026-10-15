import { useState } from 'react';
import { PageHeader } from '../components/molecules/PageHeader';
import { ProjectGrid } from '../components/organisms/project-bar/ProjectGrid';
import CreateProjectModal from '../components/organisms/project-bar/CreateProjectModal.jsx';
import { DashboardTemplate } from '../components/templates/DashboardTemplate';
import ProjectLogin from './ProjectLogin.jsx';
import CasePanel from './CasePanel.jsx';
import SmartRecorder from './SmartRecorder.jsx';
import IncidentPage from './IncidentPage.jsx';

const INITIAL_PROJECTS = [
	{ id: 'project-1', name: 'Proyecto A', shape: 'square', loginEnabled: true },
	{ id: 'project-2', name: 'Proyecto B', shape: 'circle' },
];

function Dashboard() {
	const [projects, setProjects] = useState(INITIAL_PROJECTS);
	const [isProjectALoginOpen, setIsProjectALoginOpen] = useState(false);
	const [isRecorderOpen, setIsRecorderOpen] = useState(false);
	const [isCasePanelOpen, setIsCasePanelOpen] = useState(false);
	const [isIncidentOpen, setIsIncidentOpen] = useState(false);
	const [isTicketNotificationUnread, setIsTicketNotificationUnread] = useState(true);
	const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
	const [projectToEdit, setProjectToEdit] = useState(null);

	const handleLogout = () => {
		setIsCasePanelOpen(false);
		setIsIncidentOpen(false);
		setIsRecorderOpen(false);
		setIsProjectALoginOpen(false);
		setIsCreateProjectOpen(false);
		setProjectToEdit(null);
	};

	if (isIncidentOpen) {
		return (
			<IncidentPage
				isTicketNotificationUnread={isTicketNotificationUnread}
				onMarkTicketNotificationRead={() => setIsTicketNotificationUnread(false)}
				onLogout={handleLogout}
				onOpenPanel={() => {
					setIsIncidentOpen(false);
					setIsCasePanelOpen(true);
				}}
				onOpenRecorder={() => {
					setIsIncidentOpen(false);
					setIsRecorderOpen(true);
				}}
			/>
		);
	}

	if (isCasePanelOpen) {
		return (
			<CasePanel
				isTicketNotificationUnread={isTicketNotificationUnread}
				onMarkTicketNotificationRead={() => setIsTicketNotificationUnread(false)}
				onLogout={handleLogout}
				onOpenPanel={() => setIsCasePanelOpen(true)}
				onOpenRecorder={() => setIsCasePanelOpen(false)}
			/>
		);
	}

	if (isRecorderOpen) {
		return (
			<SmartRecorder
				isTicketNotificationUnread={isTicketNotificationUnread}
				onMarkTicketNotificationRead={() => setIsTicketNotificationUnread(false)}
				onLogout={handleLogout}
				onOpenPanel={() => setIsCasePanelOpen(true)}
				onOpenRecorder={() => setIsRecorderOpen(true)}
				onOpenIncident={() => {
					setIsRecorderOpen(false);
					setIsIncidentOpen(true);
				}}
			/>
		);
	}

	if (isProjectALoginOpen) {
		return (
			<ProjectLogin
				onBack={() => setIsProjectALoginOpen(false)}
				onLogin={() => {
					setIsProjectALoginOpen(false);
					setIsRecorderOpen(true);
				}}
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
					onOpenProject={() => setIsProjectALoginOpen(true)}
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
