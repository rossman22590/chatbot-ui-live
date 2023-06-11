import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';

import { SecondaryButton } from '@/components/Common/Buttons/SecondaryButton';

import { InstallFromUrlsModal } from './InstallFromUrlModal';

export const InstallFromUrlButton = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  return (
    <div className="relative text-right">
      <SecondaryButton
        onClick={(e) => {
          e.stopPropagation();
          setShowModal(true);
        }}
      >
        <IconPlus size={16} />
      </SecondaryButton>
      {showModal && (
        <InstallFromUrlsModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};
