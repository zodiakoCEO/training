import type { Project } from '../../../types/project';
import { AddProjectCard } from './AddProjectCard';
import { ProjectCard } from './ProjectCard';

interface ProjectGridProps {
  projects: Project[];
  onCreateProject: () => void;
  onOpenProject: () => void;
}

export const ProjectGrid = ({ projects, onCreateProject, onOpenProject }: ProjectGridProps) => (
  <section className="project-section" aria-label="Proyectos">
    <div className="project-grid">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          onOpen={project.loginEnabled ? onOpenProject : undefined}
          project={project}
        />
      ))}
      <AddProjectCard onClick={onCreateProject} />
    </div>
  </section>
);