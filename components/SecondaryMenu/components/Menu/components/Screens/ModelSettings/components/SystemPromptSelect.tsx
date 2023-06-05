import { IconDeviceLaptop } from '@tabler/icons-react';
import { FC, useContext, useState } from 'react';

import { useTranslation } from 'next-i18next';

import { DEFAULT_SYSTEM_PROMPT } from '@/utils/app/const';

import { SystemPrompt } from '@chatbot-ui/core/types/system-prompt';

import HomeContext from '@/pages/api/home/home.context';

interface Props {
  systemPrompts: SystemPrompt[];
}

export const SystemPromptSelect = () => {
  const { t } = useTranslation('systemPrompt');

  const {
    state: { selectedConversation, defaultSystemPromptId, systemPrompts },
    handleUpdateConversation,
  } = useContext(HomeContext);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const content = injectedSystemPrompts.filter(
      (prompt) => prompt.id === e.target.value,
    )[0].content;

    selectedConversation &&
      handleUpdateConversation(selectedConversation, {
        key: 'prompt',
        value: content,
      });
  };

  const builtInSystemPrompt: SystemPrompt = {
    id: '0',
    name: 'Built-in',
    content: DEFAULT_SYSTEM_PROMPT,
    models: [
      // Allowing the default system prompt to be used with all models
      'gpt-3.5-turbo',
      'gpt-35-az',
      'gpt-4',
      'gpt-4-32k',
      'claude-v1',
      'claude-v1-100k',
      'claude-instant-v1',
      'claude-instant-v1-100k',
    ],
  };
  const injectedSystemPrompts = [builtInSystemPrompt, ...systemPrompts];

  const conversationPromptId =
    injectedSystemPrompts.filter(
      (prompt) => prompt.content === selectedConversation?.systemPrompt,
    )[0]?.id || builtInSystemPrompt.id;
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
        value={conversationPromptId}
        onChange={handleChange}
      >
        {injectedSystemPrompts.map((prompt) => (
          <option
            key={prompt.id}
            value={prompt.id}
            className="bg-theme-primary-menu-light dark:bg-theme-primary-menu-dark text-black dark:text-white"
          >
            {prompt.id === defaultSystemPromptId
              ? `${t('Default')} (${prompt.name})`
              : prompt.name}
          </option>
        ))}
      </select>
    </div>
  );
};
