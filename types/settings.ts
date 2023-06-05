export interface SettingChoice {
  name: string;
  value: string;
  default?: boolean;
}

export interface Setting {
  id: string;
  name: string;
  description: string;
  type: 'choice' | 'string' | 'number' | 'boolean';
  value?: any;
  defaultValue?: any;
  choices?: SettingChoice[];
  min?: number;
  max?: number;
  storage: 'local' | HttpOnlyCookie;
}

export interface HttpOnlyCookie {
  domain: string;
  path: string;
}

export interface SettingsSection {
  id: string;
  name: string;
  settings: Setting[];
}

export interface SavedSetting {
  sectionId: string;
  settingId: string;
  value: any;
}

export const SystemSettings: SettingsSection[] = [
  {
    id: 'personalization',
    name: 'Personalization',
    settings: [
      {
        id: 'theme',
        name: 'Theme',
        description: 'Choose your theme',
        type: 'choice',
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
        storage: 'local',
      },
    ],
  },

  {
    id: 'openai',
    name: 'OpenAI',
    settings: [
      {
        id: 'api_key',
        name: 'API Key',
        description: 'The API key to use for OpenAI',
        type: 'string',
        storage: 'local',
      },
    ],
  },
  {
    id: 'general',
    name: 'General',
    settings: [
      {
        id: 'defaultSystemPromptId',
        name: 'Default System Prompt',
        description: 'Choose your default system prompt',
        type: 'choice',
        choices: [
          {
            name: 'Default',
            value: 'default',
          },
        ],
        storage: 'local',
      },
    ],
  },
];
