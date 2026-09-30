import type { ReactNode } from 'react';

interface DashboardTemplateProps {
  header: ReactNode;
  children: ReactNode;
}

export const DashboardTemplate = ({ header, children }: DashboardTemplateProps) => (
  <div className="dashboard-shell">
    <main className="dashboard-main">
      {header}
      {children}
    </main>
  </div>
);