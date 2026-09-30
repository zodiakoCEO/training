import type { Project } from '../../../types/project';
import { ProjectPreview } from '../../molecules/searchBar/ProjectPreview';

interface ProjectCardProps {
  project: Project;
  onOpen?: () => void;
}

export const ProjectCard = ({ project, onOpen }: ProjectCardProps) => {
  const cardContent = (
    <>
      <ProjectPreview shape={project.shape} />
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
    </article>
  );
};