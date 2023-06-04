import { IconMinus } from '@tabler/icons-react';
import { useState } from 'react';

import { SecondaryButton } from '@/components/Common/Buttons/SecondaryButton';

import { DeleteNamespaceModal } from './DeleteNamespaceModal';

export const DeleteNamespaceButton = () => {
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <>
      <SecondaryButton
        onClick={(e) => {
          e.stopPropagation();
          setShowModal(true);
        }}
      >
        <IconMinus size={16} />
      </SecondaryButton>

      {showModal && (
        <DeleteNamespaceModal onClose={() => setShowModal(false)} />
      )}
    </>
  );
};
