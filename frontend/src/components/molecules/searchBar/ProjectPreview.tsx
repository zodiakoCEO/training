import type { ProjectShape } from '../../../types/project';
import { ShapeMark } from '../../atoms/Button/ShapeMark';

interface ProjectPreviewProps {
  shape: ProjectShape;
}

export const ProjectPreview = ({ shape }: ProjectPreviewProps) => (
  <div className={`project-preview project-preview--${shape}`}>
    <div className="preview-content">
      <ShapeMark shape={shape} />
      <div className="preview-lines" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </div>
  </div>
);