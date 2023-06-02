import { useContext } from 'react';

import { OpenAIModel, OpenAIModelID, OpenAIModels } from '@/types/openai';

import HomeContext from '@/pages/api/home/home.context';

export const ModelSelect = () => {
  const {
    state: { selectedConversation, models, defaultModelId },
    handleUpdateConversation,
  } = useContext(HomeContext);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const model_id = e.target.value as keyof typeof OpenAIModelID;
    const model: OpenAIModel = (OpenAIModels as any)[model_id];
    selectedConversation &&
      handleUpdateConversation(selectedConversation, {
        key: 'model',
        value: model,
      });
  };

  return (
    <div
      className={`w-full rounded-sm border border-theme-border-light dark:border-theme-border-dark
      bg-transparent text-black dark:text-white`}
    >
      <select
        className="text-left w-full bg-transparent p-1"
        value={selectedConversation?.model?.id || defaultModelId}
        onChange={handleChange}
      >
        {models.map((model) => (
          <option
            key={model.id}
            value={model.id}
            className="bg-theme-primary-menu-light dark:bg-theme-primary-menu-dark text-black dark:text-white"
          >
            {model.name}
          </option>
        ))}
      </select>
    </div>
  );
};
