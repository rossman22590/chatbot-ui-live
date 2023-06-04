import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';

import { SecondaryButton } from '@/components/Common/Buttons/SecondaryButton';

import { AddNamespaceModal } from './AddNamespaceModal';

export const AddNameSpaceButton = () => {
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <>
      <SecondaryButton
        onClick={(e) => {
          e.stopPropagation();
          setShowModal(true);
        }}
      >
        <IconPlus size={16} />
      </SecondaryButton>

      {showModal && <AddNamespaceModal onClose={() => setShowModal(false)} />}
    </>
  );
};
