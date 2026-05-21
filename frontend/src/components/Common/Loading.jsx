const Loading = ({ size = 'md', fullPage = false }) => {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const spinner = (
    <div
      className={`${sizes[size]} border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin`}
    />
  );

  if (fullPage) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          {spinner}
          <p className="mt-3 text-gray-500 text-sm">Đang tải...</p>
        </div>
      </div>
    );
  }

  return <div className="flex items-center justify-center p-8">{spinner}</div>;
};

export default Loading;
