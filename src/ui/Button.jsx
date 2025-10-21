export function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}