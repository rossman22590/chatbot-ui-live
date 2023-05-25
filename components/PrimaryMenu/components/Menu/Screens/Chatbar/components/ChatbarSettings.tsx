import { IconFileExport, IconLogout, IconSettings } from '@tabler/icons-react';
import { useContext } from 'react';

import { useTranslation } from 'next-i18next';

import HomeContext from '@/pages/api/home/home.context';

import { SidebarButton } from '@/components/Common/Sidebar/SidebarButton';
import { Import } from '@/components/Settings/Import';
import { Key } from '@/components/Settings/Key';

import ChatbarContext from '../Chatbar.context';
import { ClearConversations } from './ClearConversations';

export const ChatbarSettings = () => {
  const { t } = useTranslation('sidebar');

  const {
    state: { apiKey, database, serverSideApiKeyIsSet, conversations },
  } = useContext(HomeContext);

  const {
    handleClearConversations,
    handleImportConversations,
    handleExportData,
    handleApiKeyChange,
  } = useContext(ChatbarContext);

  return (
    <div
      className="flex flex-col items-center space-y-1 border-t
    border-theme-border-light dark:border-theme-border-dark pt-1 text-sm"
    >
      {conversations.length > 0 ? (
        <ClearConversations onClearConversations={handleClearConversations} />
      ) : null}

      <Import onImport={handleImportConversations} />

      <SidebarButton
        text={t('Export data')}
        icon={<IconFileExport size={18} />}
        onClick={() => handleExportData(database)}
      />

      {!serverSideApiKeyIsSet ? (
        <Key apiKey={apiKey} onApiKeyChange={handleApiKeyChange} />
      ) : null}
    </div>
  );
};
