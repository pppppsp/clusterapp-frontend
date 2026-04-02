import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  description: string;
  aside?: ReactNode;
}

export function SectionHeader({ title, description, aside }: SectionHeaderProps) {
  return (
    <div className="section-heading">
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {aside}
    </div>
  );
}
