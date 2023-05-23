export interface SettingChoice {
  name: string;
  value: string;
  default?: boolean;
}

export interface Setting {
  id: string;
  name: string;
  description: string;
  type: string;
  value?: any;
  choices?: SettingChoice[];
  min?: number;
  max?: number;
}
export interface SettingsSection {
  id: string;
  name: string;
  settings: { [key: string]: Setting };
}

export interface Settings {
  [key: string]: SettingsSection;
}
