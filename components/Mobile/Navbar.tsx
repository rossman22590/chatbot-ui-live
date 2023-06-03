import { IconPlus } from '@tabler/icons-react';
import { FC, useContext } from 'react';

import {
  localSaveShowPrimaryMenu,
  localSaveShowSecondaryMenu,
} from '@/utils/app/storage/local/uiState';

import { Conversation } from '@chatbot-ui/core/types/chat';

import HomeContext from '@/pages/api/home/home.context';

import {
  PrimaryMenuOpener,
  SecondaryMenuOpener,
} from '../Common/Sidebar/components/OpenCloseButton';

interface Props {
  selectedConversation: Conversation;
  onNewConversation: () => void;
}

export const Navbar: FC<Props> = ({
  selectedConversation,
  onNewConversation,
}) => {
  const {
    state: { showPrimaryMenu, showSecondaryMenu, user },
    dispatch: homeDispatch,
  } = useContext(HomeContext);

  const handleShowPrimaryMenu = () => {
    if (!showPrimaryMenu) {
      homeDispatch({ field: 'showPrimaryMenu', value: true });
      homeDispatch({ field: 'showSecondaryMenu', value: false });
    } else {
      homeDispatch({ field: 'showPrimaryMenu', value: false });
    }
    localSaveShowPrimaryMenu(user, showPrimaryMenu);
  };

  const handleShowSecondaryMenu = () => {
    if (!showSecondaryMenu) {
      homeDispatch({ field: 'showPrimaryMenu', value: false });
      homeDispatch({ field: 'showSecondaryMenu', value: true });
    } else {
      homeDispatch({ field: 'showSecondaryMenu', value: false });
    }
    localSaveShowSecondaryMenu(user, showSecondaryMenu);
  };

  return (
    <nav className="h-[50px] flex w-full justify-between bg-[#202123] py-3 px-4">
      {' '}
      <PrimaryMenuOpener
        visible={!showSecondaryMenu}
        onClick={handleShowPrimaryMenu}
        open={showPrimaryMenu}
      />
      <div className="flex w-full justify-between bg-[#202123] px-8">
        <div className="left-[100px] text-black dark:text-white max-w-[280px] overflow-hidden text-ellipsis whitespace-nowrap">
          {selectedConversation.name}
        </div>
        <IconPlus
          className="cursor-pointer hover:text-neutral-400 text-black dark:text-white "
          onClick={onNewConversation}
        />
      </div>
      <SecondaryMenuOpener
        visible={!showPrimaryMenu}
        onClick={handleShowSecondaryMenu}
        open={showSecondaryMenu}
      />
    </nav>
  );
};
