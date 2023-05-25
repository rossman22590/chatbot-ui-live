import { IconPlus } from '@tabler/icons-react';

export const AddNameSpaceButton = () => {
  return (
    <button
      className="flex flex-shrink cursor-pointer items-center gap-3 rounded-md border
      border-theme-border-light dark:border-theme-border-dark p-3 text-sm
      text-black dark:text-white transition-colors
      duration-200 hover:bg-theme-hover-light dark:hover:bg-theme-hover-dark"
    >
      <IconPlus size={16} />
    </button>
  );
};
