const MainLayout = ({ children, className = "", ...props }) => {
  return (
    <div className="bg-[var(--bg-color)]">
      <div
        className={`container mx-auto flex justify-center items-center w-screen min-h-screen ${className}`}
        {...props}
      >
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
