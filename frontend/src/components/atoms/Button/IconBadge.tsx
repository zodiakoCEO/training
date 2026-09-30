import type { ReactNode } from 'react';

interface IconBadgeProps {
  children: ReactNode;
}

export const IconBadge = ({ children }: IconBadgeProps) => (
  <span className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#E3F3F0] text-[#0F7A69]">
    {children}
  </span>
);