import { useContext } from 'react';

import { Setting, SettingsSection } from '@/types/settings';

import SettingsContext from '../Settings.context';

interface Props {
  section: SettingsSection;
  setting: Setting;
  isSelected: boolean;
}

export const SettingComponent = ({ section, setting, isSelected }: Props) => {
  const { handleSelect, handleSave } = useContext(SettingsContext);

  let component = <></>;
  if (setting.type === 'string') {
    component = (
      <div className="relative h-fit flex w-full flex-col gap-1">
        <input
          type="text"
          className={`w-full flex-1 rounded-md border border-theme-border-light dark:border-theme-border-dark
            bg-theme-light dark:bg-theme-dark px-4 py-3 pr-10 text-[14px] leading-3 text-black dark:text-white`}
          onChange={(event) => handleSave(section, setting, event.target.value)}
        />
      </div>
    );
  } else if (setting.type === 'select') {
    component = (
      <>
        <div className="w-1/2 p-0 m-0">
          <select
            className={`p-1 text-sm w-full bg-theme-light dark:bg-theme-select-dark cursor-pointer text-neutral-700
          dark:text-neutral-200 border border-theme-border-light dark:border-theme-border-dark`}
            value={setting.value}
            onChange={(event) =>
              handleSave(section, setting, event.target.value)
            }
          >
            {setting.choices!.map((choice, index) => (
              <option key={index} value={choice.value}>
                {choice.default ? `Default(${choice.name})` : choice.name}
              </option>
            ))}
          </select>
        </div>
      </>
    );
  }
  return (
    <div
      className={`block w-full p-4 pt-2 border ${
        isSelected
          ? `
            bg-theme-setting-selected-light dark:bg-theme-setting-selected-dark
            border-[#005cc5]
            `
          : `
            bg-theme-light dark:bg-theme-dark border-transparent
            hover:bg-theme-setting-hover-light dark:hover:bg-theme-setting-hover-dark
            `
      } 
       `}
      onClick={() => handleSelect(section, setting)}
    >
      <div className="ml-1 my-2 flex">
        <div className="text-sm font-medium text-black dark:text-neutral-100">
          {section.name}:
        </div>
        &nbsp;
        <div className="text-sm font-semibold text-black dark:text-white">
          {setting.name}
        </div>
      </div>
      <p className="ml-1 mb-4 text-sm text-black dark:text-white">
        {setting.description}
      </p>
      {component}
    </div>
  );
};
