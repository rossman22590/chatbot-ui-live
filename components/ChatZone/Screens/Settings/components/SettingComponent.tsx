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
      <div className="w-full">
        <p className="m-1">
          {section.name}: <b>{setting.name}</b>
        </p>
        <p className="m-1">{setting.description}</p>
        <div className="relative h-fit flex w-full flex-col gap-1">
          <input
            type="text"
            className={`w-full flex-1 rounded-md border border-theme-border-light dark:border-theme-border-dark
            bg-theme-light dark:bg-theme-dark px-4 py-3 pr-10 text-[14px] leading-3 text-black dark:text-white`}
            onChange={(event) =>
              handleSave(section, setting, event.target.value)
            }
          />
        </div>
      </div>
    );
  } else if (setting.type === 'select') {
    component = (
      <>
        <p className="m-1">
          {section.name}: <b>{setting.name}</b>
        </p>
        <p className="m-1">{setting.description}</p>
        <div className="w-1/2 p-0 m-0">
          <select
            className={`p-[2px] text-sm w-full bg-theme-light dark:bg-theme-dark cursor-pointer text-neutral-700
          dark:text-neutral-200 border border-theme-border-light dark:border-theme-border-dark`}
            value={setting.value}
            onChange={(event) =>
              handleSave(section, setting, event.target.value)
            }
          >
            {setting.choices!.map((choice, index) => (
              <option
                key={index}
                value={choice.value}
                className="bg-theme-light dark:bg-theme-dark dark:text-white "
              >
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
      className={`block w-full p-4 pt-2 ${
        isSelected
          ? 'bg-theme-select-light dark:bg-theme-select-dark'
          : 'bg-bg-theme-light dark:bg-theme-dark  hover:bg-theme-hover-light dark:hover:bg-theme-hover-dark'
      } 
      rounded-lg `}
      onClick={() => handleSelect(section, setting)}
    >
      {component}
    </div>
  );
};
