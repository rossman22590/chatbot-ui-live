import { useCallback, useEffect } from 'react';
import { useQuery } from 'react-query';

import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import useErrorService from '@/services/errorService';
import useApiService from '@/services/useApiService';

import {
  cleanConversationHistory,
  cleanSelectedConversation,
} from '@/utils/app/clean';
import {
  DEFAULT_SYSTEM_PROMPT,
  DEFAULT_TEMPERATURE,
  LEARNING_URL,
} from '@/utils/app/const';
import {
  storageCreateConversation,
  storageUpdateConversation,
} from '@/utils/app/storage/conversation';
import {
  storageGetConversations,
  storageUpdateConversations,
} from '@/utils/app/storage/conversations';
import {
  storageCreateFolder,
  storageDeleteFolder,
  storageUpdateFolder,
} from '@/utils/app/storage/folder';
import { storageGetFolders } from '@/utils/app/storage/folders';
import {
  localDeleteAPIKey,
  localGetAPIKey,
} from '@/utils/app/storage/local/apiKey';
import { localGetInstalledPlugins } from '@/utils/app/storage/local/plugins';
import { localGetShowChatBar } from '@/utils/app/storage/local/uiState';
import {
  storageDeleteMessages,
  storageUpdateMessages,
} from '@/utils/app/storage/messages';
import {
  storageGetPrompts,
  storageUpdatePrompts,
} from '@/utils/app/storage/prompts';
import {
  getSelectedConversation,
  saveSelectedConversation,
} from '@/utils/app/storage/selectedConversation';
import {
  deleteSettings,
  getSettings,
  setSettingChoices,
  updateSettingValue,
} from '@/utils/app/storage/settings';
import {
  storageCreateSystemPrompt,
  storageDeleteSystemPrompt,
  storageUpdateSystemPrompt,
} from '@/utils/app/storage/systemPrompt';
import { storageGetSystemPrompts } from '@/utils/app/storage/systemPrompts';
import { getTimestampWithTimezoneOffset } from '@chatbot-ui/core/utils/time';

import { KeyValuePair } from '@/types/data';
import { Namespace } from '@/types/learning';
import { OpenAIModelID, OpenAIModels, fallbackModelID } from '@/types/openai';
import { SettingChoice } from '@/types/settings';
import { Conversation, Message } from '@chatbot-ui/core/types/chat';
import { FolderType } from '@chatbot-ui/core/types/folder';
import { Prompt } from '@chatbot-ui/core/types/prompt';
import { SystemPrompt } from '@chatbot-ui/core/types/system-prompt';

import { ChatZone } from '@/components/ChatZone/ChatZone';
import { Navbar } from '@/components/Mobile/Navbar';
import { PrimaryMenu } from '@/components/PrimaryMenu/PrimaryMenu';

import HomeContext from './home.context';
import { HomeInitialState, initialState } from './home.state';

import { v4 as uuidv4 } from 'uuid';

interface Props {
  serverSideApiKeyIsSet: boolean;
  defaultModelId: OpenAIModelID;
}

const Home = ({ serverSideApiKeyIsSet, defaultModelId }: Props) => {
  const { t } = useTranslation('chat');
  const { getModels } = useApiService();
  const { getModelsError } = useErrorService();

  const contextValue = useCreateReducer<HomeInitialState>({
    initialState,
  });

  const {
    state: {
      apiKey,
      database,
      lightMode,
      folders,
      conversations,
      selectedConversation,
      prompts,
      systemPrompts,
      defaultSystemPromptId,
      user,
      settings,
    },
    dispatch,
  } = contextValue;

  const { data, error, refetch } = useQuery(
    ['GetModels', apiKey, serverSideApiKeyIsSet],
    ({ signal }) => {
      if (!apiKey && !serverSideApiKeyIsSet) return null;

      return getModels(
        {
          key: apiKey,
        },
        signal,
      );
    },
    { enabled: true, refetchOnMount: false },
  );

  useEffect(() => {
    if (data) dispatch({ field: 'models', value: data });
  }, [data, dispatch]);

  useEffect(() => {
    dispatch({ field: 'modelError', value: getModelsError(error) });
  }, [dispatch, error, getModelsError]);

  // FETCH MODELS ----------------------------------------------

  const handleSelectConversation = (conversation: Conversation) => {
    dispatch({
      field: 'selectedConversation',
      value: conversation,
    });

    dispatch({
      field: 'display',
      value: 'chat',
    });

    saveSelectedConversation(user, conversation);
  };

  // FOLDER OPERATIONS  --------------------------------------------

  const handleCreateFolder = async (name: string, type: FolderType) => {
    const updatedFolders = storageCreateFolder(
      database,
      user,
      name,
      type,
      folders,
    );

    dispatch({ field: 'folders', value: updatedFolders });
  };

  const handleDeleteFolder = async (folderId: string) => {
    const updatedFolders = folders.filter((f) => f.id !== folderId);
    dispatch({ field: 'folders', value: updatedFolders });

    const updatedConversations: Conversation[] = conversations.map((c) => {
      if (c.folderId === folderId) {
        return {
          ...c,
          folderId: null,
        };
      }

      return c;
    });

    dispatch({ field: 'conversations', value: updatedConversations });

    const updatedPrompts: Prompt[] = prompts.map((p) => {
      if (p.folderId === folderId) {
        return {
          ...p,
          folderId: null,
        };
      }

      return p;
    });

    dispatch({ field: 'prompts', value: updatedPrompts });

    await storageUpdateConversations(database, user, updatedConversations);
    await storageUpdatePrompts(database, user, updatedPrompts);
    storageDeleteFolder(database, user, folderId, folders);
  };

  const handleUpdateFolder = async (folderId: string, name: string) => {
    const updatedFolders = storageUpdateFolder(
      database,
      user,
      folderId,
      name,
      folders,
    );

    dispatch({ field: 'folders', value: updatedFolders });
  };

  // CONVERSATION OPERATIONS  --------------------------------------------

  const handleNewConversation = async () => {
    const lastConversation = conversations[conversations.length - 1];

    const defaultSystemPrompt = systemPrompts.find(
      (p) => p.id === defaultSystemPromptId,
    );

    let systemPrompt = DEFAULT_SYSTEM_PROMPT;
    if (defaultSystemPrompt) {
      systemPrompt = defaultSystemPrompt.content;
    }

    const newConversation: Conversation = {
      id: uuidv4(),
      name: `${t('New Conversation')}`,
      messages: [],
      model: lastConversation?.model || {
        id: OpenAIModels[defaultModelId].id,
        name: OpenAIModels[defaultModelId].name,
        maxLength: OpenAIModels[defaultModelId].maxLength,
        tokenLimit: OpenAIModels[defaultModelId].tokenLimit,
      },
      prompt: systemPrompt,
      temperature: DEFAULT_TEMPERATURE,
      folderId: null,
      timestamp: getTimestampWithTimezoneOffset(),
    };

    const updatedConversations = storageCreateConversation(
      database,
      user,
      newConversation,
      conversations,
    );
    dispatch({ field: 'selectedConversation', value: newConversation });
    dispatch({ field: 'conversations', value: updatedConversations });

    saveSelectedConversation(user, newConversation);

    dispatch({ field: 'loading', value: false });
  };

  const handleUpdateConversation = (
    conversation: Conversation,
    data: KeyValuePair,
  ) => {
    const updatedConversation = {
      ...conversation,
      [data.key]: data.value,
    };

    let update: {
      single: Conversation;
      all: Conversation[];
    };

    if (data.key === 'messages') {
      const messages = conversation.messages;
      const updatedMessageList = data.value as Message[];

      const deletedMessages = messages.filter(
        (m) => !updatedMessageList.includes(m),
      );

      const updatedMessages = messages.filter((m) =>
        updatedMessageList.includes(m),
      );

      const deletedMessageIds = deletedMessages.map((m) => m.id);

      const cleaned = storageDeleteMessages(
        database,
        user,
        deletedMessageIds,
        conversation,
        messages,
        conversations,
      );

      const cleanConversation = cleaned.single;
      const cleanConversations = cleaned.all;

      update = storageUpdateMessages(
        database,
        user,
        cleanConversation,
        updatedMessages,
        cleanConversations,
      );
    } else {
      update = storageUpdateConversation(
        database,
        user,
        updatedConversation,
        conversations,
      );
    }

    dispatch({ field: 'selectedConversation', value: update.single });
    dispatch({ field: 'conversations', value: update.all });
    saveSelectedConversation(user, update.single);
  };

  // SYSTEM PROMPT OPERATIONS  --------------------------------------------

  const handleCreateSystemPrompt = async () => {
    const newSystemPrompt: SystemPrompt = {
      id: uuidv4(),
      name: `${t('New System Prompt')}`,
      content: DEFAULT_SYSTEM_PROMPT,
    };

    const updatedSystemPrompts = storageCreateSystemPrompt(
      database,
      user,
      newSystemPrompt,
      systemPrompts,
    );

    dispatch({ field: 'systemPrompts', value: updatedSystemPrompts });
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

    dispatch({ field: 'systemPrompts', value: update.all });
  };

  const handleDeleteSystemPrompt = (systemPromptId: string) => {
    const updatedSystemPrompts = systemPrompts.filter(
      (s) => s.id !== systemPromptId,
    );

    if (defaultSystemPromptId === systemPromptId) {
      // Resetting default system prompt to built-in
      updateSettingValue(user, 'general', 'defaultSystemPromptId', '0');
      dispatch({ field: 'defaultSystemPromptId', value: '0' });
    }
    dispatch({ field: 'systemPrompts', value: updatedSystemPrompts });

    storageDeleteSystemPrompt(database, user, systemPromptId, systemPrompts);
  };

  // EFFECTS  --------------------------------------------

  useEffect(() => {
    if (window.innerWidth < 640) {
      dispatch({ field: 'showPrimaryMenu', value: false });
    }
  }, [dispatch, selectedConversation]);

  useEffect(() => {
    defaultModelId &&
      dispatch({ field: 'defaultModelId', value: defaultModelId });
    database && dispatch({ field: 'database', value: database });
    serverSideApiKeyIsSet &&
      dispatch({
        field: 'serverSideApiKeyIsSet',
        value: serverSideApiKeyIsSet,
      });
  }, [defaultModelId, database, serverSideApiKeyIsSet, dispatch]);

  // ON LOAD --------------------------------------------

  useEffect(() => {
    dispatch({
      field: 'installedPlugins',
      value: localGetInstalledPlugins(user),
    });

    const apiKey = localGetAPIKey(user);

    if (serverSideApiKeyIsSet) {
      dispatch({ field: 'apiKey', value: '' });

      localDeleteAPIKey(user);
    } else if (apiKey) {
      dispatch({ field: 'apiKey', value: apiKey });
    }

    if (window.innerWidth < 640) {
      dispatch({ field: 'showPrimaryMenu', value: false });
    }

    const showPrimaryMenu = localGetShowChatBar(user);
    if (showPrimaryMenu) {
      dispatch({ field: 'showPrimaryMenu', value: showPrimaryMenu });
    }

    storageGetFolders(database, user).then((folders) => {
      if (folders) {
        dispatch({ field: 'folders', value: folders });
      }
    });

    storageGetPrompts(database, user).then((prompts) => {
      if (prompts) {
        dispatch({ field: 'prompts', value: prompts });
      }
    });

    storageGetSystemPrompts(database, user).then((systemPrompts) => {
      const choices: SettingChoice[] = systemPrompts.map((sp) => {
        return { name: sp.name, value: sp.id };
      });
      choices.push({ name: 'Built-In', value: '0', default: true });
      const settings = setSettingChoices(
        user,
        'general',
        'defaultSystemPromptId',
        choices,
      );

      dispatch({ field: 'settings', value: settings });
      dispatch({ field: 'systemPrompts', value: systemPrompts });
    });

    storageGetConversations(database, user).then((conversationHistory) => {
      if (conversationHistory) {
        const parsedConversationHistory: Conversation[] = conversationHistory;
        const cleanedConversationHistory = cleanConversationHistory(
          parsedConversationHistory,
        );

        dispatch({ field: 'conversations', value: cleanedConversationHistory });
      }
    });

    const selectedConversation = getSelectedConversation(user);
    if (selectedConversation) {
      const parsedSelectedConversation: Conversation =
        JSON.parse(selectedConversation);
      const cleanedSelectedConversation = cleanSelectedConversation(
        parsedSelectedConversation,
      );

      dispatch({
        field: 'selectedConversation',
        value: cleanedSelectedConversation,
      });
    } else {
      dispatch({
        field: 'selectedConversation',
        value: {
          id: uuidv4(),
          name: 'New conversation',
          messages: [],
          model: OpenAIModels[defaultModelId],
          prompt: DEFAULT_SYSTEM_PROMPT,
          temperature: DEFAULT_TEMPERATURE,
          folderId: null,
        },
      });
    }
  }, [user, defaultModelId, database, dispatch, serverSideApiKeyIsSet]);

  // SETTINGS --------------------------------------------

  useEffect(() => {
    if (!settings) {
      dispatch({
        field: 'settings',
        value: getSettings(user),
      });
    }
  }, [dispatch, settings, user]);

  useEffect(() => {
    if (settings) {
      dispatch({
        field: 'lightMode',
        value: settings['personalization'].settings['theme'].value,
      });

      dispatch({
        field: 'defaultSystemPromptId',
        value: settings['general'].settings['defaultSystemPromptId'].value,
      });
    }
  }, [settings, dispatch]);

  // NAMESPACES --------------------------------------------
  const handleFetchNamespaces = useCallback(async () => {
    const url = `${LEARNING_URL}/list_namespaces?index=secondmuse`;
    const response = await fetch(url);
    if (response.ok) {
      const body = await response.json();
      const namespaces = body.message as Namespace[];
      namespaces.sort((a, b) => a.namespace.localeCompare(b.namespace));
      namespaces.unshift({ namespace: 'none' });
      dispatch({
        field: 'namespaces',
        value: namespaces,
      });
    }
  }, [dispatch]);

  useEffect(() => {
    handleFetchNamespaces();
  }, [handleFetchNamespaces]);

  return (
    <HomeContext.Provider
      value={{
        ...contextValue,
        handleNewConversation,
        handleCreateFolder,
        handleDeleteFolder,
        handleUpdateFolder,
        handleSelectConversation,
        handleUpdateConversation,
        handleCreateSystemPrompt,
        handleUpdateSystemPrompt,
        handleDeleteSystemPrompt,
        handleFetchNamespaces,
      }}
    >
      <Head>
        <title>Chatbot UI</title>
        <meta name="description" content="ChatGPT but better." />
        <meta
          name="viewport"
          content="height=device-height, width=device-width, initial-scale=1, user-scalable=no"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {selectedConversation && (
        <main
          className={`relative flex-col text-sm overflow-y-hidden
          text-black dark:text-white ${lightMode} m-0 p-0 overflow-hidden`}
        >
          <div className="fixed top-0 z-50 w-full sm:hidden">
            <Navbar
              selectedConversation={selectedConversation}
              onNewConversation={handleNewConversation}
            />
          </div>
          <div className="flex h-screen w-screen pt-[50px] sm:pt-0">
            <PrimaryMenu />

            <ChatZone />
          </div>
        </main>
      )}
    </HomeContext.Provider>
  );
};
export default Home;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const defaultModelId =
    (process.env.DEFAULT_MODEL &&
      Object.values(OpenAIModelID).includes(
        process.env.DEFAULT_MODEL as OpenAIModelID,
      ) &&
      process.env.DEFAULT_MODEL) ||
    fallbackModelID;

  return {
    props: {
      serverSideApiKeyIsSet: !!process.env.OPENAI_API_KEY,
      defaultModelId,
      ...(await serverSideTranslations(locale ?? 'en', [
        'common',
        'chat',
        'sidebar',
        'markdown',
        'promptbar',
      ])),
    },
  };
};
