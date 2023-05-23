import { IconCheck, IconFile, IconLink } from '@tabler/icons-react';
import { MouseEventHandler, useContext, useState } from 'react';

import { LearningFile } from '@/types/learning';

import LearningScreenContext from '../LearningScreen.context';

interface Props {
  file: LearningFile;
  index: number;
  isSelected: boolean;
  handleSelect: (index: number) => void;
}

export const FileComponent = ({
  file,
  index,
  isSelected,
  handleSelect,
}: Props) => {
  // const [isRemoving, setIsRemoving] = useState(false);

  // const handleConfirm: MouseEventHandler<HTMLButtonElement> = (e) => {
  //   e.stopPropagation();
  //   handleRemoveFile(file.id);
  //   setIsRemoving(false);
  // };

  // const handleCancel: MouseEventHandler<HTMLButtonElement> = (e) => {
  //   e.stopPropagation();
  //   setIsRemoving(false);
  // };

  // const handleOpenDeleteModal: MouseEventHandler<HTMLButtonElement> = (e) => {
  //   e.stopPropagation();
  //   setIsRemoving(true);
  // };

  return (
    <div className="relative flex-col select-none">
      <div
        className={`relative flex cursor-pointer items-center p-2 text-sm transition-colors overflow-hidden
         duration-200 rounded-md
         ${!isSelected ? 'hover:bg-[#4c4d5d]/30' : ''}
         ${isSelected ? 'bg-[#4c4d5d]/80' : ''}`}
        onClick={() => handleSelect(index)}
      >
        <div className="relative min-w-[18px] w-[18px]">
          {file.type === 'link' && <IconLink size={18} />}
          {file.type === 'document' && <IconFile size={18} />}
        </div>
        <div className="pl-2 flex-col w-full">
          <div className="text-[15px] font-bold pb-[4px]">{file.name}</div>
          <div className="flex w-full">
            <div className="text-[12px] max-w-[170px] truncate">
              {file.timestamp}
            </div>

            <div className="flex-grow" />
          </div>
        </div>
        {/* <div className="flex shrink-0">
          {isRemoving && (
            <div className="right-1 z-10 flex text-gray-300">
              <SidebarActionButton handleClick={handleConfirm}>
                <IconCheck size={18} />
              </SidebarActionButton>
              <SidebarActionButton handleClick={handleCancel}>
                <IconX size={18} />
              </SidebarActionButton>
            </div>
          )}

          {isSelected && !isRemoving && (
            <div className="right-1 z-10 flex text-gray-300">
              <SidebarActionButton handleClick={handleOpenDeleteModal}>
                <IconTrash size={18} />
              </SidebarActionButton>
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
};
