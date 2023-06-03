import { FC, useContext, useState } from 'react';

import { useTranslation } from 'next-i18next';

import { DEFAULT_TEMPERATURE } from '@/utils/app/const';

import HomeContext from '@/pages/api/home/home.context';

export const TemperatureSlider = () => {
  const { t } = useTranslation('chat');
  const {
    state: { conversations, selectedConversation },
    handleUpdateConversation,
  } = useContext(HomeContext);
  const lastConversation = conversations[conversations.length - 1];
  const [temperature, setTemperature] = useState(
    lastConversation?.temperature ?? DEFAULT_TEMPERATURE,
  );
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value);
    setTemperature(newValue);

    if (selectedConversation) {
      handleUpdateConversation(selectedConversation, {
        key: 'temperature',
        value: temperature,
      });
    }
  };

  return (
    <div className="flex flex-col">
      <span className="mb-1 text-center text-neutral-900 dark:text-neutral-100">
        {temperature.toFixed(1)}
      </span>
      <input
        className="w-full h-1 bg-gradient-to-r from-fuchsia-600 via-violet-900 to-indigo-500
        dark:from-fuchsia-500 dark:via-violet-600 dark:to-indigo-400
        bg-175% animate-bg-pan-fast rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        type="range"
        min={0}
        max={1}
        step={0.1}
        value={temperature}
        onChange={handleChange}
      />
      <ul className="w mt-2 pb-8 flex justify-between px-[24px] text-neutral-900 dark:text-neutral-100">
        <li className="flex justify-center">
          <span className="absolute">{t('Precise')}</span>
        </li>
        <li className="flex justify-center">
          <span className="absolute">{t('Neutral')}</span>
        </li>
        <li className="flex justify-center">
          <span className="absolute">{t('Creative')}</span>
        </li>
      </ul>
    </div>
  );
};
