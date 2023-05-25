import { useContext } from 'react';

import { useTranslation } from 'next-i18next';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import { LEARNING_URL } from '@/utils/app/const';

import { LearningFile, Namespace } from '@/types/learning';

import HomeContext from '@/pages/api/home/home.context';

import { AddFileButton } from './components/AddFileButton';
import { AddNameSpaceButton } from './components/AddNamespaceButton';
import { AddURLButton } from './components/AddURLButton';
import { NamespaceSelect } from './components/NamespaceSelect';

import LearningScreenContext from './LearningScreen.context';
import {
  LearningScreenInitialState,
  initialState,
} from './LearningScreen.state';

export const LearningScreen = () => {
  const { t } = useTranslation('sidebar');

  const learningScreenContextValue =
    useCreateReducer<LearningScreenInitialState>({
      initialState,
    });

  const {
    state: { searchQuery },
    dispatch: learningScreenDispatch,
  } = learningScreenContextValue;

  const {
    state: { selectedNamespace },
  } = useContext(HomeContext);

  const { handleFetchNamespaces } = useContext(HomeContext);

  // FILE OPERATIONS  --------------------------------------------
  const handleAddFile = async (file: Blob) => {};

  const handleAddURLs = async (urls: string[], recurse: boolean) => {
    console.log('adding namespace');
    const url = `${LEARNING_URL}/upload_webpage_webbase?namespace=${
      selectedNamespace!.namespace
    }&index=secondmuse&crawl=false`;

    console.log({ urls });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(urls),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(response);
      handleFetchNamespaces();
    } else {
      console.log('error');
    }
  };

  const handleRemoveFile = async (fileId: string) => {};

  const handleAddNamespace = async (
    namespace: Namespace,
    file?: File,
    urls?: string[],
  ) => {
    console.log('adding namespace');
    const url = `${LEARNING_URL}/upload_webpage_webbase?namespace=${namespace.namespace}&index=secondmuse&crawl=false`;

    console.log({ urls });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(urls),
    });

    if (response.ok) {
      const data = await response.json();
      console.log({ data });
      handleFetchNamespaces();
    } else {
      const data = await response.json();
      console.log({ data });
    }
  };

  const fetchFiles = async (query: string) => {
    if (!query) {
      const response = await fetch(`${LEARNING_URL}`);
      if (response.ok) {
        const data = await response.json();
        learningScreenDispatch({
          field: 'filteredFiles',
          value: data,
        });
      }
    } else {
      const response = await fetch(`${LEARNING_URL}/search?q=${query}`);
      if (response.ok) {
        const data = await response.json();
        learningScreenDispatch({
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

  // useEffect(() => {
  //   fetchFiles(searchQuery);
  // }, [searchQuery, learningScreenDispatch]);

  const doSearch = (query: string) =>
    learningScreenDispatch({ field: 'searchQuery', value: query });

  return (
    <LearningScreenContext.Provider
      value={{
        ...learningScreenContextValue,
        handleAddFile,
        handleAddURLs,
        handleRemoveFile,
        handleAddNamespace,
      }}
    >
      <div className="flex items-center gap-2 w-full p-0 mb-3">
        <NamespaceSelect />
        <AddNameSpaceButton />
      </div>
      <div className="flex items-center gap-2">
        <AddFileButton />
        <AddURLButton />
      </div>
      {/* <Search
        placeholder={t('Search...') || ''}
        searchTerm={searchQuery}
        onSearch={doSearch}
      />
      <FileList files={files} /> */}
    </LearningScreenContext.Provider>
  );
};
