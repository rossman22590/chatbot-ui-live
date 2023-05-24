import { IconPlus } from '@tabler/icons-react';
import { FC, useContext } from 'react';

import { localSaveShowPrimaryMenu } from '@/utils/app/storage/local/uiState';

import { Conversation } from '@chatbot-ui/core/types/chat';

import HomeContext from '@/pages/api/home/home.context';

import { PrimaryMenuOpener } from '../Common/Sidebar/components/OpenCloseButton';

interface Props {
  selectedConversation: Conversation;
  onNewConversation: () => void;
}

export const Navbar: FC<Props> = ({
  selectedConversation,
  onNewConversation,
}) => {
  const {
    state: { showPrimaryMenu, user },
    dispatch: homeDispatch,
  } = useContext(HomeContext);

  const handleShowPrimaryMenu = () => {
    homeDispatch({ field: 'showPrimaryMenu', value: !showPrimaryMenu });
    localSaveShowPrimaryMenu(user, showPrimaryMenu);
  };

  return (
    <nav className="h-[50px] flex w-full justify-between bg-[#202123] py-3 px-4">
      {' '}
      <PrimaryMenuOpener
        onClick={handleShowPrimaryMenu}
        open={showPrimaryMenu}
      />
      <div className="flex w-full justify-between bg-[#202123] px-8">
        <div className="left-[100px] max-w-[280px] overflow-hidden text-ellipsis whitespace-nowrap">
          {selectedConversation.name}
        </div>
        <IconPlus
          className="cursor-pointer hover:text-neutral-400"
          onClick={onNewConversation}
        />
      </div>
      <PrimaryMenuOpener onClick={() => {}} open={false} />
    </nav>
  );
};
