import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';

import { AddNamespaceModal } from './AddNamespaceModal';

export const AddNameSpaceButton = () => {
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <>
      <button
        className="flex flex-shrink cursor-pointer items-center gap-3 rounded-md border
      border-theme-border-light dark:border-theme-border-dark p-3 text-sm
      text-black dark:text-white transition-colors
      duration-200 hover:bg-theme-hover-light dark:hover:bg-theme-hover-dark"
        onClick={(e) => {
          e.stopPropagation();
          setShowModal(true);
        }}
      >
        <IconPlus size={16} />
      </button>

      {showModal && <AddNamespaceModal onClose={() => setShowModal(false)} />}
    </>
  );
};
