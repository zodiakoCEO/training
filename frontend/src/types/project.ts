export type ProjectShape = 'square' | 'circle';

export interface Project {
  id: string;
  name: string;
  shape: ProjectShape;
  imageUrl?: string;
  loginEnabled?: boolean;
}