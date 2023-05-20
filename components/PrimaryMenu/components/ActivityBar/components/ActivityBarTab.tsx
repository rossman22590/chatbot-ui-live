export const ActivityBarTab = ({
  children,
  index,
  isSelected,
  handleSelect,
}: {
  children: JSX.Element;
  index: number;
  isSelected: boolean;
  handleSelect: (index: number) => void;
}) => {
  return (
    <>
      <button
        className={`${isSelected ? 'text-gray-200' : 'text-gray-500'} hover:${
          isSelected ? 'text-gray-200' : 'text-gray-400'
        }`}
        onClick={() => handleSelect(index)}
      >
        {children}
      </button>
    </>
  );
};
