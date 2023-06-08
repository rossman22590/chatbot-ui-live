import { IconFolderPlus, IconMistOff } from '@tabler/icons-react';
import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import {
  getSavedSettingValue,
  setSavedSetting,
} from '@/utils/app/storage/local/settings';
import {
  storageCreateSystemPrompt,
  storageDeleteSystemPrompt,
  storageUpdateSystemPrompt,
} from '@/utils/app/storage/systemPrompt';

import { SystemPrompt } from '@chatbot-ui/core/types/system-prompt';

import HomeContext from '@/pages/api/home/home.context';

import { SystemPromptFolders } from './components/Folders';
import { SystemPromptList } from './components/SystemPromptList';
import { PrimaryButton } from '@/components/Common/Buttons/PrimaryButton';
import { SecondaryButton } from '@/components/Common/Buttons/SecondaryButton';
import Search from '@/components/Common/Search';

import SystemPromptsContext from './SystemPrompts.context';
import { SystemPromptsInitialState, initialState } from './SystemPrompts.state';

import { v4 as uuidv4 } from 'uuid';

const SystemPrompts = () => {
  const { t } = useTranslation('systemPrompts');

  const systemPromptsContextValue = useCreateReducer<SystemPromptsInitialState>(
    {
      initialState,
    },
  );

  const {
    state: { systemPrompts, database, user, savedSettings, settings, models },
    dispatch: homeDispatch,
    handleCreateFolder,
  } = useContext(HomeContext);

  const {
    state: { searchTerm, filteredSystemPrompts },
    dispatch: promptDispatch,
  } = systemPromptsContextValue;

  const handleCreateSystemPrompt = async () => {
    const newSystemPrompt: SystemPrompt = {
      id: uuidv4(),
      name: `${t('New System Prompt')}`,
      content: '',
      folderId: null,
      models: [],
    };

    const updatedSystemPrompts = storageCreateSystemPrompt(
      database,
      user,
      newSystemPrompt,
      systemPrompts,
    );

    homeDispatch({ field: 'systemPrompts', value: updatedSystemPrompts });
  };

  const handleUpdateSystemPrompt = (updatedSystemPrompt: SystemPrompt) => {
    let update: {
      single: SystemPrompt;
      all: SystemPrompt[];
    };

    update = storageUpdateSystemPrompt(
      database,
      user,
      updatedSystemPrompt,
      systemPrompts,
    );

    homeDispatch({ field: 'systemPrompts', value: update.all });
  };

  const handleDeleteSystemPrompt = (systemPromptId: string) => {
    const updatedSystemPrompts = systemPrompts.filter(
      (s) => s.id !== systemPromptId,
    );

    storageDeleteSystemPrompt(database, user, systemPromptId, systemPrompts);

    for (const model of models) {
      const sectionId = model.vendor.toLowerCase();
      const settingId = `${model.id}_default_system_prompt`;
      const modelDefaultSystemPromptId = getSavedSettingValue(
        savedSettings,
        settings,
        sectionId,
        settingId,
      );

      if (modelDefaultSystemPromptId === systemPromptId) {
        // Resetting default system prompt to built-in
        setSavedSetting(user, sectionId, sectionId, null);
      }
      homeDispatch({ field: 'systemPrompts', value: updatedSystemPrompts });
    }
  };

  const handleDrop = (e: any) => {
    if (e.dataTransfer) {
      const systemPrompt = JSON.parse(e.dataTransfer.getData('system_prompt'));

      const updatedSystemPrompt = {
        ...systemPrompt,
        folderId: e.target.dataset.folderId,
      };

      handleUpdateSystemPrompt(updatedSystemPrompt);

      e.target.style.background = 'none';
    }
  };

  useEffect(() => {
    if (searchTerm) {
      promptDispatch({
        field: 'filteredSystemPrompts',
        value: systemPrompts.filter((systemPrompt) => {
          const searchable =
            systemPrompt.name.toLowerCase() +
            ' ' +
            systemPrompt.models.join(' ').toLowerCase() +
            ' ' +
            systemPrompt.content.toLowerCase();
          return searchable.includes(searchTerm.toLowerCase());
        }),
      });
    } else {
      promptDispatch({ field: 'filteredSystemPrompts', value: systemPrompts });
    }
  }, [searchTerm, systemPrompts, promptDispatch]);

  const allowDrop = (e: any) => {
    e.preventDefault();
  };

  const highlightDrop = (e: any) => {
    e.target.style.background = '#343541';
  };

  const removeHighlight = (e: any) => {
    e.target.style.background = 'none';
  };

  const doSearch = (term: string) =>
    promptDispatch({ field: 'searchTerm', value: term });

  const createFolder = () =>
    handleCreateFolder(t('New folder'), 'system_prompt');

  return (
    <SystemPromptsContext.Provider
      value={{
        ...systemPromptsContextValue,
        handleCreateSystemPrompt,
        handleUpdateSystemPrompt,
        handleDeleteSystemPrompt,
      }}
    >
      <div className="flex items-center gap-x-2">
        <PrimaryButton
          onClick={() => {
            handleCreateSystemPrompt();
            doSearch('');
          }}
        >
          {t('New system prompt')}
        </PrimaryButton>
        <SecondaryButton onClick={createFolder}>
          <IconFolderPlus size={16} />
        </SecondaryButton>
      </div>
      <Search
        placeholder={t('Search...') || ''}
        searchTerm={searchTerm}
        onSearch={doSearch}
      />

      <div className="flex-grow overflow-auto">
        {filteredSystemPrompts?.length > 0 && (
          <div
            className="flex border-b pb-2
          border-theme-button-border-light dark:border-theme-button-border-dark"
          >
            <SystemPromptFolders />
          </div>
        )}

        {filteredSystemPrompts?.length > 0 ? (
          <div
            className="pt-2"
            onDrop={handleDrop}
            onDragOver={allowDrop}
            onDragEnter={highlightDrop}
            onDragLeave={removeHighlight}
          >
            <SystemPromptList
              systemPrompts={filteredSystemPrompts.filter(
                (systemPrompt) => !systemPrompt.folderId,
              )}
            />
          </div>
        ) : (
          <div className="mt-8 select-none text-center text-black dark:text-white opacity-50">
            <IconMistOff className="mx-auto mb-3" />
            <span className="text-[14px] leading-normal">{t('No data.')}</span>
          </div>
        )}
      </div>
    </SystemPromptsContext.Provider>
  );
};

export default SystemPrompts;
