import { IconDeviceFloppy, IconX } from '@tabler/icons-react';
import { useContext, useEffect } from 'react';

import { useTranslation } from 'next-i18next';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import { getSettings, updateSettingValue } from '@/utils/app/storage/settings';

import { Setting, SettingsSection } from '@/types/settings';

import HomeContext from '@/pages/api/home/home.context';

import { SettingsSectionComponent } from './components/SettingsSectionComponent';

import SettingsContext from './Settings.context';
import { SettingsInitialState, initialState } from './Settings.state';

export const Settings = () => {
  const { t } = useTranslation('settings');

  const settingsContextValue = useCreateReducer<SettingsInitialState>({
    initialState,
  });

  const {
    state: { searchQuery, selectedSection },
    dispatch: settingsDispatch,
  } = settingsContextValue;

  const {
    state: { user, settings },
    dispatch: homeDispatch,
  } = useContext(HomeContext);

  useEffect(() => {
    // fetchFiles(searchQuery);
  }, [searchQuery, settingsDispatch]);

  const doSearch = (query: string) =>
    settingsDispatch({ field: 'searchQuery', value: query });

  const handleSave = (
    section: SettingsSection,
    setting: Setting,
    value: any,
  ) => {
    const newSettings = updateSettingValue(user, section.id, setting.id, value);
    homeDispatch({ field: 'settings', value: newSettings });
  };

  const handleSelect = (section: SettingsSection, setting: Setting) => {
    settingsDispatch({
      field: 'selectedSection',
      value: section,
    });
    settingsDispatch({
      field: 'selectedSetting',
      value: setting,
    });
  };

  const handleClose = () => {
    homeDispatch({ field: 'display', value: 'chat' });
  };

  return (
    <SettingsContext.Provider
      value={{
        ...settingsContextValue,
        handleSelect,
        handleSave,
      }}
    >
      <div className="relative flex-1 overflow-hidden bg-theme-light dark:bg-theme-dark">
        <div className="max-h-full overflow-x-hidden"></div>
        <div
          className={`group md:px-4 bg-theme-light text-gray-800
       dark:border-gray-900/50 dark:bg-theme-dark dark:text-gray-100'`}
          style={{ overflowWrap: 'anywhere' }}
        >
          <div className="relative m-auto flex p-4 text-base md:max-w-2xl md:gap-6 md:py-6 lg:max-w-2xl lg:px-0 xl:max-w-3xl">
            <div className="prose mt-[-2px] w-full dark:prose-invert">
              <div className="block">
                <h1 className="pl-3 text-center">Settings</h1>
                {settings &&
                  Object.values(settings).map((section, index) => (
                    <SettingsSectionComponent
                      isSelected={selectedSection?.id === section.id}
                      key={index}
                      section={section}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <button
          className="absolute top-2 right-2 w-6 h-6 m-2 cursor-pointer text-gray-700
         dark:hover:bg-theme-hover-dark dark:text-gray-100 hover:bg-theme-hover-dark"
          onClick={handleClose}
        >
          <IconX />
        </button>
      </div>
    </SettingsContext.Provider>
  );
};
