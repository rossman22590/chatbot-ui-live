import { IconLogout, IconSettings } from '@tabler/icons-react';
import { signOut } from 'next-auth/react';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { localDeleteAPIKey } from '@/utils/app/storage/local/apiKey';
import { localDeletePluginKeys } from '@/utils/app/storage/local/pluginKeys';
import { deleteSelectedConversation } from '@/utils/app/storage/selectedConversation';
import { AUTH_ENABLED } from '@chatbot-ui/core/utils/const';

import HomeContext from '@/pages/api/home/home.context';

import { ActivityBarButton } from './components/ActivityBarButton';
import { ActivityBarTab } from './components/ActivityBarTab';
import { SidebarButton } from '@/components/Common/Sidebar/SidebarButton';
import { SettingDialog } from '@/components/Settings/SettingDialog';

import PrimaryMenuContext from '../../PrimaryMenu.context';

const ActivityBar = ({ icons }: { icons: JSX.Element[] }) => {
  const [isSettingDialogOpen, setIsSettingDialog] = useState<boolean>(false);

  const {
    state: { user, database },
  } = useContext(HomeContext);

  const {
    state: { selectedIndex },
    dispatch: homeDispatch,
  } = useContext(PrimaryMenuContext);

  const handleSelect = (index: number) => {
    homeDispatch({ field: 'selectedIndex', value: index });
  };

  const handleSignOut = () => {
    if (database.name !== 'local') {
      deleteSelectedConversation(user);
      localDeleteAPIKey(user);
      localDeletePluginKeys(user);
    }

    signOut();
  };

  // VS Code Activity Bar with tabs at the top and setting button at the bottom
  return (
    <div
      className="fixed border-r border-[#121314] top-0 z-50 flex h-full w-[50px] flex-none flex-col
          space-y-6 bg-[#363739] items-center align-middle py-4 text-[14px] transition-all sm:relative sm:top-0
          justify-between"
    >
      {/* Tabs aligns to top */}
      <div className="flex flex-col items-center space-y-6">
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
            <IconLogout size={30} />
          </ActivityBarButton>
        )}
        <ActivityBarButton handleClick={() => setIsSettingDialog(true)}>
          <IconSettings size={30} />
        </ActivityBarButton>
      </div>

      <SettingDialog
        open={isSettingDialogOpen}
        onClose={() => {
          setIsSettingDialog(false);
        }}
      />
    </div>
  );
};

export default ActivityBar;
