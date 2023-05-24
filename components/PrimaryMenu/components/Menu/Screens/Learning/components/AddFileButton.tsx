import { IconFilePlus } from '@tabler/icons-react';

export const AddFileButton = () => {
  return (
    <label className="flex flex-shrink w-1/2 cursor-pointer items-center gap-3 rounded-md border border-white/20 p-3 text-sm text-white transition-colors duration-200 hover:bg-gray-500/10">
      <IconFilePlus size={16} />
      Add File
      <input
        type="file"
        id="addedFile"
        name="filename"
        className="hidden"
      ></input>
    </label>
  );
};
