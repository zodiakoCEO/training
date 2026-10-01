import { IconBadge } from '../../atoms/IconBadge';
import { PlusIcon } from '../../atoms/PlusIcon';

interface AddProjectCardProps {
  onClick: () => void;
}

export const AddProjectCard = ({ onClick }: AddProjectCardProps) => (
  <article className="add-project-card">
    <div className="add-project-content">
      <IconBadge>
        <PlusIcon />
      </IconBadge>
      <h2 className="add-project-title">Agregar proyecto</h2>
      <p className="add-project-caption">Crea un nuevo proyecto</p>
      <button className="add-project-action" type="button" onClick={onClick}>
        Crear proyecto
      </button>
    </div>
  </article>
);