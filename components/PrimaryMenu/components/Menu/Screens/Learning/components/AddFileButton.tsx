import { IconFilePlus } from '@tabler/icons-react';

export const AddFileButton = () => {
  return (
    <label
      className="flex flex-shrink w-1/2 cursor-pointer items-center gap-3 rounded-md border
    border-theme-border-light dark:border-theme-border-dark p-3 text-sm
    text-black dark:text-white transition-colors duration-200
    hover:bg-theme-hover-light dark:hover:bg-theme-hover-dark"
    >
      <IconFilePlus size={16} />
      Add File
      <input
        type="file"
        id="addedFile"
        name="filename"
        className="hidden"
        accept=".pdf"
      ></input>
    </label>
  );
};
