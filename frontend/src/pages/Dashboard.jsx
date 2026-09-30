import { useState } from 'react';
import { PageHeader } from '../components/molecules/searchBar/PageHeader';
import { ProjectGrid } from '../components/organism/ProyectBar/ProjectGrid';
import { DashboardTemplate } from '../components/templates/DashboardTemplate';
import ProjectLogin from './ProjectLogin.jsx';

const INITIAL_PROJECTS = [
	{ id: 'project-1', name: 'Proyecto A', shape: 'square', loginEnabled: true },
	{ id: 'project-2', name: 'Proyecto B', shape: 'circle' },
];

function Dashboard() {
	const [projects, setProjects] = useState(INITIAL_PROJECTS);
	const [isProjectALoginOpen, setIsProjectALoginOpen] = useState(false);

	if (isProjectALoginOpen) {
		return <ProjectLogin onBack={() => setIsProjectALoginOpen(false)} />;
	}

	const handleCreateProject = () => {
		setProjects((currentProjects) => {
			const nextNumber = currentProjects.length + 1;

			return [
				...currentProjects,
				{
					id: `project-${nextNumber}`,
					name: `Proyecto ${nextNumber}`,
					shape: nextNumber % 2 === 0 ? 'circle' : 'square',
				},
			];
		});
	};

	return (
		<DashboardTemplate
			header={<PageHeader eyebrow="Panel de control" title="Mis proyectos" />}
		>
			<ProjectGrid
				projects={projects}
				onCreateProject={handleCreateProject}
				onOpenProject={() => setIsProjectALoginOpen(true)}
			/>
		</DashboardTemplate>
	);
}

export default Dashboard;
