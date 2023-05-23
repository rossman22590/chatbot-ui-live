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
            className={`w-full flex-1 rounded-md border bg-[#343541] border-neutral-600 px-4 py-3 pr-10 text-[14px] leading-3 text-white`}
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
            className={`p-[2px] text-sm w-full bg-[#343541] cursor-pointer text-neutral-700
          dark:text-neutral-200 border`}
            value={setting.value}
            onChange={(event) =>
              handleSave(section, setting, event.target.value)
            }
          >
            {setting.choices!.map((choice, index) => (
              <option
                key={index}
                value={choice.value}
                className="dark:bg-[#343541] dark:text-white "
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
        isSelected ? 'bg-[#505163]' : 'bg-[#343541] hover:bg-[#444554]'
      } 
      rounded-lg `}
      onClick={() => handleSelect(section, setting)}
    >
      {component}
    </div>
  );
};
