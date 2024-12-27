export default function Button({ children, ...props }) {
  return (
    <button
      className="uppercase p-2 text-center text-xl bg-[var(--accent-color)] rounded-lg border-2 border-white focus:outline-none focus:border-[var(--accent-color)] hover:opacity-[0.85] hover:shadow-none"
      {...props}
    >
      {children}
    </button>
  );
}
