import { SavedSetting, SettingsSection } from '@/types/settings';
import { User } from '@chatbot-ui/core/types/auth';

const STORAGE_KEY = 'saved_settings';

export const getSavedSettings = (user: User): SavedSetting[] => {
  const itemName = `${STORAGE_KEY}-${user.email}`;
  const savedSettingsRaw = localStorage.getItem(itemName);
  if (savedSettingsRaw) {
    try {
      return JSON.parse(savedSettingsRaw) as SavedSetting[];
    } catch (e) {
      return [];
    }
  }
  return [];
};

// export const getSavedSettings = (user: User): Settings => {
//   const itemName = `${STORAGE_KEY}-${user.email}`;
//   const settingsSectionsRaw = localStorage.getItem(itemName);
//   let savedSettings = systemSettings;
//   if (settingsSectionsRaw) {
//     try {
//       const tmp = JSON.parse(settingsSectionsRaw) as Settings;
//       if (tmp) {
//         savedSettings = tmp;
//       }
//     } catch (e) {
//       console.error(e);
//     }
//   }
//   return savedSettings;
// };

export const setSavedSettings = (user: User, savedSettings: SavedSetting[]) => {
  const itemName = `${STORAGE_KEY}-${user.email}`;
  localStorage.setItem(itemName, JSON.stringify(savedSettings));
};

export const deleteSettings = (user: User) => {
  const itemName = `${STORAGE_KEY}-${user.email}`;
  localStorage.removeItem(itemName);
};

export const getDefaultValue = (
  settings: SettingsSection[],
  sectionId: string,
  settingId: string,
) => {
  if (!settings) {
    return;
  }
  const section = settings.find((section) => section.id === sectionId);

  if (!section) {
    console.error(`Section ${sectionId} not found`);
    return;
  }

  const setting = section.settings.find((setting) => setting.id === settingId);

  if (!setting) {
    console.error(`Setting ${sectionId}.${settingId} not found`);
    return;
  }

  if (setting.type === 'choice') {
    if (setting.choices) {
      const defaultChoice = setting.choices.find((choice) => choice.default);
      return defaultChoice?.value;
    } else {
      console.error(`Setting ${sectionId}.${settingId} has no choices`);
    }
  } else {
    return setting.defaultValue;
  }
};

export const getSavedSettingValue = (
  savedSettings: SavedSetting[],
  settings: SettingsSection[],
  sectionId: string,
  settingId: string,
) => {
  const savedSetting = savedSettings.find(
    (savedSetting) =>
      savedSetting.sectionId === sectionId &&
      savedSetting.settingId === settingId,
  );
  if (savedSetting) {
    return savedSetting.value;
  }
  // Return default value if available
  else {
    return getDefaultValue(settings, sectionId, settingId);
  }
};

export const setSavedSetting = (
  user: User,
  sectionId: string,
  settingId: string,
  value: any,
) => {
  const savedSettings = getSavedSettings(user);

  const setting = savedSettings.find(
    (savedSetting) =>
      savedSetting.sectionId === sectionId &&
      savedSetting.settingId === settingId,
  );

  if (!setting) {
    savedSettings.push({
      sectionId,
      settingId,
      value,
    });
    setSavedSettings(user, savedSettings);
    return savedSettings;
  } else {
    const newSavedSettings = savedSettings.map((savedSetting) => {
      if (
        savedSetting.sectionId === sectionId &&
        savedSetting.settingId === settingId
      ) {
        return {
          ...savedSetting,
          value: value,
        };
      }
      return savedSetting;
    });
    setSavedSettings(user, newSavedSettings);
    return newSavedSettings;
  }
};

// export const addSettingChoice = (
//   user: User,
//   section: string,
//   setting: string,
//   choice: SettingChoice,
// ) => {
//   const settings = getSavedSettings(user);

//   const choices = settings[section].settings[setting].choices;

//   let newChoices = [choice];
//   if (choices !== undefined) {
//     newChoices = [...choices, choice];
//   } else {
//     newChoices = [choice];
//   }

//   const newSettings: Settings = {
//     ...settings,
//     [section]: {
//       ...settings[section],
//       settings: {
//         ...settings[section].settings,
//         [setting]: {
//           ...settings[section].settings[setting],
//           choices: newChoices,
//         },
//       },
//     },
//   };

//   saveSettings(user, newSettings);

//   return newSettings;
// };

//   saveSettings(user, newSettings);

//   return newSettings;
// };
