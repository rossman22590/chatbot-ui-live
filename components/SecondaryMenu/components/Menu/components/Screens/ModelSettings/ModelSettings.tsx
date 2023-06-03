import { IconInfoCircle } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import { ModelSelect } from './components/ModelSelect';
import { SystemPromptSelect } from './components/SystemPromptSelect';
import { TemperatureSlider } from './components/Temperature';

export const ModelSettings = () => {
  const { t } = useTranslation('modelSettings');

  return (
    <div className="pt-2 px-1 space-y-1">
      <label className="flex items-center text-left pl-1 text-black dark:text-white">
        {t('Model')}
        <InfoCircle />
      </label>
      <ModelSelect />

      <label className="pt-3 flex items-center text-left pl-1 text-black dark:text-white">
        {t('System Prompt')}
        <InfoCircle />
      </label>
      <SystemPromptSelect />

      <label className="pt-3 flex items-center text-left pl-1 pr-1 text-black dark:text-white">
        {t('Temperature')}
        <InfoCircle />
      </label>

      <TemperatureSlider />
    </div>
  );
};

const InfoCircle = ({ children }: any) => {
  return <IconInfoCircle height={18} width={18} className="ml-1" />;
};
