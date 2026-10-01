import type { ReactNode } from 'react';

interface IconBadgeProps {
  children: ReactNode;
}

export const IconBadge = ({ children }: IconBadgeProps) => (
  <span className="icon-badge">
    {children}
  </span>
);