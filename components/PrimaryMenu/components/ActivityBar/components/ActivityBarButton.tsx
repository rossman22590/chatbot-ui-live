export const ActivityBarButton = ({
  children,
  handleClick,
}: {
  children: JSX.Element;
  handleClick: () => void;
}) => {
  return (
    <>
      <button
        className="text-gray-500 hover:text-gray-400"
        onClick={handleClick}
      >
        {children}
      </button>
    </>
  );
};
