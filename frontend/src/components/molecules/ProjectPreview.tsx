import type { ProjectShape } from '../../../types/project';
import { ShapeMark } from '../atoms/ShapeMark';

interface ProjectPreviewProps {
  shape: ProjectShape;
  imageUrl?: string;
}

export const ProjectPreview = ({ shape, imageUrl }: ProjectPreviewProps) => (
  <div
    className={`project-preview project-preview--${shape}${imageUrl ? ' project-preview--image' : ''}`}
    style={imageUrl ? { backgroundImage: `url("${imageUrl}")` } : undefined}
    role={imageUrl ? 'img' : undefined}
    aria-label={imageUrl ? 'Imagen de portada del proyecto' : undefined}
  >
    {!imageUrl && (
      <div className="preview-content">
        <ShapeMark shape={shape} />
        <div className="preview-lines" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    )}
  </div>
);