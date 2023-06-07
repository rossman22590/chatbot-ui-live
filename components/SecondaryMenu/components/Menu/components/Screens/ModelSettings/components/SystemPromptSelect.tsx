import { IconDeviceLaptop } from '@tabler/icons-react';
import { FC, useContext, useEffect, useState } from 'react';

import { useTranslation } from 'next-i18next';

import {
  DEFAULT_ANTHROPIC_SYSTEM_PROMPT,
  DEFAULT_OPENAI_SYSTEM_PROMPT,
} from '@/utils/app/const';
import {
  getSavedSettingValue,
  setSavedSetting,
} from '@/utils/app/storage/local/settings';
import { storageCreateSystemPrompt } from '@/utils/app/storage/systemPrompt';

import { AiModel, PossibleAiModels } from '@chatbot-ui/core/types/ai-models';
import { SystemPrompt } from '@chatbot-ui/core/types/system-prompt';

import HomeContext from '@/pages/api/home/home.context';

import { v4 as uuidv4 } from 'uuid';

interface Props {
  systemPrompts: SystemPrompt[];
}

export const SystemPromptSelect = () => {
  const { t } = useTranslation('systemPrompt');

  const [availableSystemPrompts, setAvailableSystemPrompts] = useState<
    SystemPrompt[]
  >([]);
  const [defaultSystemPrompt, setDefaultSystemPrompt] =
    useState<SystemPrompt | null>(null);

  const {
    state: {
      models,
      database,
      user,
      selectedConversation,
      savedSettings,
      settings,
      systemPrompts,
    },
    dispatch: homeDispatch,
    handleUpdateConversation,
  } = useContext(HomeContext);

  const getDefaultSystemPrompt = () => {
    let sysPrompt;

    if (availableSystemPrompts && defaultSystemPrompt) {
      sysPrompt = availableSystemPrompts.filter(
        (prompt) => prompt.id === defaultSystemPrompt.id,
      )[0];
    }

    if (!sysPrompt) {
      const model = selectedConversation!.model;
      const sectionId = model.vendor.toLocaleLowerCase();
      const settingId = `${model.id}_default_system_prompt`;

      let systemPromptId = getSavedSettingValue(
        savedSettings,
        settings,
        sectionId,
        settingId,
      );

      if (systemPromptId) {
        const systemPrompt = systemPrompts.filter(
          (prompt) => prompt.id === systemPromptId,
        )[0];
        setDefaultSystemPrompt(systemPrompt);
      } else {
        let systemPrompt;
        systemPromptId = uuidv4();
        if (model.vendor === 'Anthropic') {
          systemPrompt = {
            id: systemPromptId,
            name: `${t('New System Prompt')}`,
            content: DEFAULT_ANTHROPIC_SYSTEM_PROMPT,
            folderId: null,
            models: [
              'claude-v1',
              'claude-v1-100k',
              'claude-instant-v1',
              'claude-instant-v1-100k',
            ],
          };
        } else {
          systemPrompt = {
            id: systemPromptId,
            name: `${t('New System Prompt')}`,
            content: DEFAULT_OPENAI_SYSTEM_PROMPT,
            folderId: null,
            models: ['gpt-3.5-turbo', 'gpt-35-az', 'gpt-4', 'gpt-4-32k'],
          };
        }
        console.log('creating system prompt', systemPrompt);
        const updatedSystemPrompts = storageCreateSystemPrompt(
          database,
          user,
          systemPrompt,
          systemPrompts,
        );
        setSavedSetting(user, sectionId, settingId, systemPromptId);
        setDefaultSystemPrompt(systemPrompt);
        // homeDispatch({ field: 'systemPrompts', value: updatedSystemPrompts });
      }
    }
  };

  const getAvailableSystemPrompts = () => {
    const model = selectedConversation!.model;

    console.log('model', model);

    const availablePrompts = systemPrompts.filter((prompt) =>
      prompt.models.includes(model.id),
    );

    console.log('systemPrompts', systemPrompts);

    console.log('availablePrompts', availablePrompts);

    setAvailableSystemPrompts(availablePrompts);
  };

  useEffect(() => {
    // getDefaultSystemPrompt();
  }, [availableSystemPrompts]);

  useEffect(() => {
    if (systemPrompts) {
      getAvailableSystemPrompts();
    }
  }, [selectedConversation, systemPrompts]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const systemPrompt = systemPrompts.filter(
      (prompt) => prompt.id === e.target.value,
    )[0].content;

    selectedConversation &&
      handleUpdateConversation(selectedConversation, {
        key: 'systemPrompt',
        value: systemPrompt,
      });
  };

  return (
    <div
      className="
      w-full rounded-sm
      bg-transparent text-white
      bg-gradient-to-r from-fuchsia-600 via-violet-900 to-indigo-500
      dark:from-fuchsia-500 dark:via-violet-600 dark:to-indigo-400
      bg-175% animate-bg-pan-slow appearance-none dark:bg-gray-700 hover:opacity-90
      "
    >
      <select
        className="text-left w-full bg-transparent p-1 text-sm"
        value={selectedConversation?.systemPrompt?.name}
        onChange={handleChange}
      >
        {availableSystemPrompts.map((prompt) => (
          <option
            key={prompt.id}
            value={prompt.id}
            className="bg-theme-primary-menu-light dark:bg-theme-primary-menu-dark text-black dark:text-white"
          >
            {prompt.id === defaultSystemPrompt?.id
              ? `${t('Default')} (${prompt.name})`
              : prompt.name}
          </option>
        ))}
      </select>
    </div>
  );
};
