import { IconFilePlus, IconLink } from '@tabler/icons-react';

export const AddURLButton = () => {
  return (
    <button
      className="w-1/2 flex flex-shrink cursor-pointer items-center gap-3 rounded-md border
      border-theme-border-light dark:border-theme-border-dark p-3 text-sm
      text-black dark:text-white transition-colors duration-200 
      hover:bg-theme-hover-light dark:hover:bg-theme-hover-dark"
      onClick={() => {}}
    >
      <IconLink size={16} />
      Add URL
    </button>
  );
};
