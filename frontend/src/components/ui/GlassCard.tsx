interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function GlassCard({ children, className = "", hover = false }: GlassCardProps) {
  return (
    <div
      className={`glass-card ${hover ? "" : "static"} p-6 ${className}`}
    >
      {children}
    </div>
  );
}
