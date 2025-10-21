export function Card({ children, className = "" }) {
  return <div className={`rounded-xl border p-4 bg-white/5 shadow ${className}`}>{children}</div>;
}
export function CardHeader({ children }) { return <div className="mb-2">{children}</div>; }
export function CardContent({ children }) { return <div>{children}</div>; }
export function CardTitle({ children }) { return <h2 className="font-semibold">{children}</h2>; }