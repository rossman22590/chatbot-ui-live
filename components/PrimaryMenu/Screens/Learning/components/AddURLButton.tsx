import { IconFilePlus, IconLink } from '@tabler/icons-react';

export const AddURLButton = () => {
  return (
    <button
      className="w-1/2 flex flex-shrink cursor-pointer items-center gap-3 rounded-md border border-white/20 p-3 text-sm text-white transition-colors duration-200 hover:bg-gray-500/10"
      onClick={() => {}}
    >
      <IconLink size={16} />
      Add URL
    </button>
  );
};
