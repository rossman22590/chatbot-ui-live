import { IconCheck } from '@tabler/icons-react';

export const Chip = ({ children, isSelected, handleSelect, id }: any) => {
  return (
    <div
      className={`
      flex flex-row items-center justify-center rounded-full
      text-black dark:text-neutral-300
      border border-neutral-500  text-[12px]
      whitespace-nowrap px-2 py-1 cursor-pointer select-none
      mt-2 mr-2"
      ${
        isSelected
          ? 'bg-green-200 dark:bg-[#389359] border-transparent dark:border-transparent'
          : ''
      }
      `}
      onClick={() => handleSelect(id)}
    >
      {isSelected && (
        <IconCheck width={15} height={15} className="mr-1 select-none" />
      )}
      {children}
    </div>
  );
};
