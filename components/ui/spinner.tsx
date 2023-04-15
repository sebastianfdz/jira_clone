const Spinner = () => {
  return (
    <div
      aria-label="loading"
      className="absolute bottom-1/2 right-1/2  translate-x-1/2 translate-y-1/2 transform "
    >
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-500 border-t-transparent"></div>
    </div>
  );
};

export { Spinner };
