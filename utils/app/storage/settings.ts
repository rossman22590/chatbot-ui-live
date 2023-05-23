import { SettingChoice, Settings } from '@/types/settings';
import { User } from '@chatbot-ui/core/types/auth';

const STORAGE_KEY = 'settings';

const defaultSettings: Settings = {
  personalization: {
    id: 'personalization',
    name: 'Personalization',
    settings: {
      theme: {
        id: 'theme',
        name: 'Theme',
        description: 'Choose your theme',
        type: 'select',
        choices: [
          {
            name: 'Light',
            value: 'light',
          },
          {
            name: 'Dark',
            value: 'dark',
            default: true,
          },
        ],
      },
    },
  },
  general: {
    id: 'general',
    name: 'General',
    settings: {
      defaultSystemPromptId: {
        id: 'defaultSystemPromptId',
        name: 'Default System Prompt',
        description: 'Choose your default system prompt',
        type: 'select',
        choices: [
          {
            name: 'Default',
            value: 'default',
          },
        ],
      },
    },
  },
};

export const getSettings = (user: User): Settings => {
  const itemName = `${STORAGE_KEY}-${user.email}`;
  const settingsSectionsRaw = localStorage.getItem(itemName);
  let savedSettings = defaultSettings;
  if (settingsSectionsRaw) {
    try {
      const tmp = JSON.parse(settingsSectionsRaw) as Settings;
      if (tmp) {
        savedSettings = tmp;
      }
    } catch (e) {
      console.error(e);
    }
  }
  return savedSettings;
};

export const saveSettings = (user: User, settings: Settings) => {
  const itemName = `${STORAGE_KEY}-${user.email}`;
  localStorage.setItem(itemName, JSON.stringify(settings));
};

export const deleteSettings = (user: User) => {
  const itemName = `${STORAGE_KEY}-${user.email}`;
  localStorage.removeItem(itemName);
};

export const updateSettingValue = (
  user: User,
  section: string,
  setting: string,
  value: string,
) => {
  const settings = getSettings(user);

  const newSettings: Settings = {
    ...settings,
    [section]: {
      ...settings[section],
      settings: {
        ...settings[section].settings,
        [setting]: {
          ...settings[section].settings[setting],
          value: value,
        },
      },
    },
  };

  saveSettings(user, newSettings);

  return newSettings;
};

export const addSettingChoice = (
  user: User,
  section: string,
  setting: string,
  choice: SettingChoice,
) => {
  const settings = getSettings(user);

  const choices = settings[section].settings[setting].choices;

  let newChoices = [choice];
  if (choices !== undefined) {
    newChoices = [...choices, choice];
  } else {
    newChoices = [choice];
  }

  const newSettings: Settings = {
    ...settings,
    [section]: {
      ...settings[section],
      settings: {
        ...settings[section].settings,
        [setting]: {
          ...settings[section].settings[setting],
          choices: newChoices,
        },
      },
    },
  };

  saveSettings(user, newSettings);

  return newSettings;
};

export const setSettingChoices = (
  user: User,
  section: string,
  setting: string,
  newChoices: SettingChoice[],
) => {
  const settings = getSettings(user);

  const newSettings: Settings = {
    ...settings,
    [section]: {
      ...settings[section],
      settings: {
        ...settings[section].settings,
        [setting]: {
          ...settings[section].settings[setting],
          choices: newChoices,
        },
      },
    },
  };

  saveSettings(user, newSettings);

  return newSettings;
};

export const getSetting = (user: User, section: string, setting: string) => {
  const settings = getSettings(user);
  return settings[section].settings[setting];
};
