import { IconLink } from '@tabler/icons-react';
import { useState } from 'react';

import { PrimaryButtonAlt } from '@/components/Common/Buttons/PrimaryButton';

import { AddURLModal } from './AddURLModal';

export const AddURLButton = () => {
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <>
      <PrimaryButtonAlt
        onClick={(e) => {
          e.stopPropagation();
          setShowModal(true);
        }}
      >
        <IconLink size={16} />
        Add URL
      </PrimaryButtonAlt>

      {showModal && <AddURLModal onClose={() => setShowModal(false)} />}
    </>
  );
};
