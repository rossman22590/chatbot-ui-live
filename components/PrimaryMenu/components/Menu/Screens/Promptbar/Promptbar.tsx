import { IconFolderPlus, IconMistOff, IconPlus } from '@tabler/icons-react';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import {
  storageCreatePrompt,
  storageDeletePrompt,
  storageUpdatePrompt,
} from '@/utils/app/storage/prompt';

import { OpenAIModels } from '@/types/openai';
import { Prompt } from '@chatbot-ui/core/types/prompt';

import HomeContext from '@/pages/api/home/home.context';

import { PromptFolders } from './components/PromptFolders';
import { Prompts } from './components/Prompts';
import Search from '@/components/Common/Search';

import PromptbarContext from './PromptBar.context';
import { PromptbarInitialState, initialState } from './Promptbar.state';

import { v4 as uuidv4 } from 'uuid';

const Promptbar = () => {
  const { t } = useTranslation('promptbar');

  const promptBarContextValue = useCreateReducer<PromptbarInitialState>({
    initialState,
  });

  const {
    state: { prompts, defaultModelId, database, user },
    dispatch: homeDispatch,
    handleCreateFolder,
  } = useContext(HomeContext);

  const {
    state: { searchTerm, filteredPrompts },
    dispatch: promptDispatch,
  } = promptBarContextValue;

  const handleCreatePrompt = () => {
    if (defaultModelId) {
      const newPrompt: Prompt = {
        id: uuidv4(),
        name: `Prompt ${prompts.length + 1}`,
        description: '',
        content: '',
        model: OpenAIModels[defaultModelId],
        folderId: null,
      };

      const updatedPrompts = storageCreatePrompt(
        database,
        user,
        newPrompt,
        prompts,
      );

      homeDispatch({ field: 'prompts', value: updatedPrompts });
    }
  };

  const handleDeletePrompt = (prompt: Prompt) => {
    const updatedPrompts = storageDeletePrompt(
      database,
      user,
      prompt.id,
      prompts,
    );
    homeDispatch({ field: 'prompts', value: updatedPrompts });
  };

  const handleUpdatePrompt = (prompt: Prompt) => {
    const updated = storageUpdatePrompt(database, user, prompt, prompts);

    homeDispatch({ field: 'prompts', value: updated.all });
  };

  const handleDrop = (e: any) => {
    if (e.dataTransfer) {
      const prompt = JSON.parse(e.dataTransfer.getData('prompt'));

      const updatedPrompt = {
        ...prompt,
        folderId: e.target.dataset.folderId,
      };

      handleUpdatePrompt(updatedPrompt);

      e.target.style.background = 'none';
    }
  };

  useEffect(() => {
    if (searchTerm) {
      promptDispatch({
        field: 'filteredPrompts',
        value: prompts.filter((prompt) => {
          const searchable =
            prompt.name.toLowerCase() +
            ' ' +
            prompt.description.toLowerCase() +
            ' ' +
            prompt.content.toLowerCase();
          return searchable.includes(searchTerm.toLowerCase());
        }),
      });
    } else {
      promptDispatch({ field: 'filteredPrompts', value: prompts });
    }
  }, [searchTerm, prompts, promptDispatch]);

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

  const createFolder = () => handleCreateFolder(t('New folder'), 'prompt');

  return (
    <PromptbarContext.Provider
      value={{
        ...promptBarContextValue,
        handleCreatePrompt,
        handleDeletePrompt,
        handleUpdatePrompt,
      }}
    >
      <div className="flex items-center">
        <button
          className="text-sidebar flex w-[214px] flex-shrink-0 cursor-pointer select-none items-center gap-3
          rounded-md border border-theme-border-light dark:border-theme-border-dark p-3
          text-black dark:text-white transition-colors duration-200
          hover:bg-theme-hover-light dark:hover:bg-theme-hover-dark"
          onClick={() => {
            handleCreatePrompt();
            doSearch('');
          }}
        >
          <IconPlus size={16} />
          {t('New prompt')}
        </button>

        <button
          className="ml-2 flex flex-shrink-0 cursor-pointer items-center gap-3 rounded-md border
          border-theme-border-light dark:border-theme-border-dark p-3 text-sm
          text-black dark:text-white transition-colors duration-200
          hover:bg-theme-hover-light dark:hover:bg-theme-hover-dark"
          onClick={createFolder}
        >
          <IconFolderPlus size={16} />
        </button>
      </div>
      <Search
        placeholder={t('Search...') || ''}
        searchTerm={searchTerm}
        onSearch={doSearch}
      />

      <div className="flex-grow overflow-auto">
        {filteredPrompts?.length > 0 && (
          <div className="flex border-b border-theme-border-light dark:border-theme-border-dark pb-2">
            <PromptFolders />
          </div>
        )}

        {filteredPrompts?.length > 0 ? (
          <div
            className="pt-2"
            onDrop={handleDrop}
            onDragOver={allowDrop}
            onDragEnter={highlightDrop}
            onDragLeave={removeHighlight}
          >
            <Prompts
              prompts={filteredPrompts.filter((prompt) => !prompt.folderId)}
            />
          </div>
        ) : (
          <div className="mt-8 select-none text-center text-black dark:text-white opacity-50">
            <IconMistOff className="mx-auto mb-3" />
            <span className="text-[14px] leading-normal">{t('No data.')}</span>
          </div>
        )}
      </div>
    </PromptbarContext.Provider>
  );
};

export default Promptbar;
