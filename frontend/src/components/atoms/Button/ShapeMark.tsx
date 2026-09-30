import type { ProjectShape } from '../../../types/project';

interface ShapeMarkProps {
  shape: ProjectShape;
}

export const ShapeMark = ({ shape }: ShapeMarkProps) => (
  <span aria-hidden="true" className={`shape-mark shape-mark--${shape}`} />
);