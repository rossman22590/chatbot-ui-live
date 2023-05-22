import { IconMistOff } from '@tabler/icons-react';
import { useContext, useEffect } from 'react';

import { useTranslation } from 'next-i18next';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import { getTimestampWithTimezoneOffset } from '@/../chatbot-ui-core/utils/time';
import { LEARNING_URL } from '@/utils/app/const';

import { LearningFile } from '@/types/learning';

import HomeContext from '@/pages/api/home/home.context';

import Search from '@/components/Common/Search';

import SettingsContext from './Settings.context';
import { LearningScreenInitialState, initialState } from './Settings.state';

export const Settings = () => {
  const { t } = useTranslation('sidebar');

  const learningScreenContextValue =
    useCreateReducer<LearningScreenInitialState>({
      initialState,
    });

  const {
    state: { searchQuery, filteredFiles },
    dispatch: pluginCatalogDispatch,
  } = learningScreenContextValue;

  const {
    state: { user },
    dispatch: homeDispatch,
  } = useContext(HomeContext);

  // FILE OPERATIONS  --------------------------------------------
  const handleAddFile = async (file: Blob) => {};

  const handleAddLink = async (url: string, recurse: false) => {};

  const handleRemoveFile = async (fileId: string) => {};

  const fetchFiles = async (query: string) => {
    if (!query) {
      const response = await fetch(`${LEARNING_URL}`);
      if (response.ok) {
        const data = await response.json();
        pluginCatalogDispatch({
          field: 'filteredFiles',
          value: data,
        });
      }
    } else {
      const response = await fetch(`${LEARNING_URL}/search?q=${query}`);
      if (response.ok) {
        const data = await response.json();
        pluginCatalogDispatch({
          field: 'filteredFiles',
          value: data,
        });
      }
    }
  };

  const files: LearningFile[] = [
    {
      id: '1',
      name: 'Atari Recursive',
      url: 'https://www.atari.com',
      type: 'link',
      tags: 'test',
      timestamp: 'May 21, 2023',
    },

    {
      id: '2',
      name: 'Research Paper',
      url: 'https://www.google.com',
      type: 'document',
      tags: 'test',
      timestamp: 'May 20, 2023',
    },
  ];

  useEffect(() => {
    fetchFiles(searchQuery);
  }, [searchQuery, pluginCatalogDispatch]);

  const doSearch = (query: string) =>
    pluginCatalogDispatch({ field: 'searchQuery', value: query });

  return (
    <SettingsContext.Provider
      value={{
        ...learningScreenContextValue,
        handleAddFile,
        handleAddLink,
        handleRemoveFile,
      }}
    ></SettingsContext.Provider>
  );
};
