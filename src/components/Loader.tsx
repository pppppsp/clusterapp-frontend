interface LoaderProps {
  label: string;
}

export function Loader({ label }: LoaderProps) {
  return <div className="loader">{label}</div>;
}
