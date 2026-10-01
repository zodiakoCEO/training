import type { Project } from '../../../types/project';
import { ProjectPreview } from '../../molecules/ProjectPreview';

interface ProjectCardProps {
  project: Project;
  onOpen?: () => void;
  onEdit: () => void;
}

export const ProjectCard = ({ project, onOpen, onEdit }: ProjectCardProps) => {
  const cardContent = (
    <>
      <ProjectPreview imageUrl={project.imageUrl} shape={project.shape} />
      <div className="project-card-footer">
        <h2>{project.name}</h2>
      </div>
    </>
  );

  return (
    <article className={`project-card${onOpen ? ' project-card--interactive' : ''}`}>
      {cardContent}
      {onOpen && (
        <button
          aria-label={`Abrir ${project.name}`}
          className="project-card-hit-area"
          onClick={onOpen}
          type="button"
        />
      )}
      <button
        aria-label={`Editar ${project.name}`}
        className="project-card-edit"
        onClick={onEdit}
        type="button"
      >
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
          <path d="m13.8 3.2 3 3M4 16l3.7-.8L16.2 6.7a2.1 2.1 0 0 0-3-3L4.7 12.2 4 16Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </article>
  );
};