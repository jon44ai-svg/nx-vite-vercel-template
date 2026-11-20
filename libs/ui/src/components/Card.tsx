import type { ReactNode } from 'react';

export interface CardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function Card({ title, subtitle, children, className = '' }: CardProps) {
  return (
    <section className={`ui-card ${className}`.trim()}>
      {title ? <h2 className="ui-card-title">{title}</h2> : null}
      {subtitle ? <p className="ui-card-subtitle">{subtitle}</p> : null}
      {children}
    </section>
  );
}
