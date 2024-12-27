const MainLayout = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`bg-[var(--bg-color)] flex justify-center items-center w-screen min-h-screen ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default MainLayout;
