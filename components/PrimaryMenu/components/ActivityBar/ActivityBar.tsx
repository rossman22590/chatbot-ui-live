import { IconLogout, IconSettings } from '@tabler/icons-react';
import { signOut } from 'next-auth/react';
import { useContext, useState } from 'react';

import { deleteSelectedConversation } from '@/utils/app/storage/selectedConversation';
import { AUTH_ENABLED } from '@chatbot-ui/core/utils/const';

import HomeContext from '@/pages/api/home/home.context';

import { ActivityBarButton } from './components/ActivityBarButton';
import { ActivityBarTab } from './components/ActivityBarTab';

import PrimaryMenuContext from '../../PrimaryMenu.context';

const ActivityBar = ({ icons }: { icons: JSX.Element[] }) => {
  const {
    state: { user, database, showPrimaryMenu },
    dispatch: homeDispatch,
  } = useContext(HomeContext);

  const {
    state: { selectedIndex },
    dispatch: primaryMenuDispatch,
  } = useContext(PrimaryMenuContext);

  const handleSelect = (index: number) => {
    if (selectedIndex === index) {
      homeDispatch({ field: 'showPrimaryMenu', value: !showPrimaryMenu });
    }

    if (!showPrimaryMenu) {
      homeDispatch({ field: 'showPrimaryMenu', value: !showPrimaryMenu });
    }
    primaryMenuDispatch({ field: 'selectedIndex', value: index });
    // homeDispatch({ field: 'showSettings', value: false });
    // homeDispatch({ field: 'selectedPlugin', value: null });
  };

  const handleSignOut = () => {
    if (database.name !== 'local') {
      deleteSelectedConversation(user);
      // localDeleteAPIKey(user);
      // localDeletePluginKeys(user);
    }

    signOut();
  };

  const handleShowSettings = () => {
    homeDispatch({ field: 'display', value: 'settings' });
  };

  // VS Code Activity Bar with tabs at the top and setting button at the bottom
  return (
    <div
      className={`relative border-r border-unsaged-border top-0 z-40 flex h-full w-[48px] flex-none flex-col
          ${showPrimaryMenu ? 'left-[0]' : 'hidden sm:flex'}
          space-y-6 bg-unsaged items-center align-middle py-4 text-[14px] transition-all sm:relative sm:top-0
          sm:left-[0]
          justify-between`}
    >
      {/* Tabs aligns to top */}
      <div className="flex flex-col items-center">
        {icons.map((icon, index) => (
          <ActivityBarTab
            handleSelect={handleSelect}
            isSelected={index === selectedIndex}
            index={index}
            key={index}
          >
            {icon}
          </ActivityBarTab>
        ))}
      </div>

      {/* Settings buttons align to bottom */}
      <div className="flex flex-col items-center space-y-6">
        {AUTH_ENABLED && (
          <ActivityBarButton handleClick={handleSignOut}>
            <IconLogout size={28} />
          </ActivityBarButton>
        )}
        <ActivityBarButton handleClick={handleShowSettings}>
          <IconSettings size={28} />
        </ActivityBarButton>
      </div>
    </div>
  );
};

export default ActivityBar;
