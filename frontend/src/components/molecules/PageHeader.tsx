interface PageHeaderProps {
  eyebrow: string;
  title: string;
}

export const PageHeader = ({ eyebrow, title }: PageHeaderProps) => (
  <header className="page-header">
    <p className="page-eyebrow">{eyebrow}</p>
    <h1>{title}</h1>
  </header>
);