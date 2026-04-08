
export interface SystemSettings {
  general: {
    businessName: string;
    email: string;
    phone: string;
    address: string;
    logo?: string;
  };
  account: {
    name: string;
    email: string;
    avatar?: string;
  };
  security: {
    twoFactorEnabled: boolean;
    passwordChangedAt?: string;
  };
  preferences: {
    theme: 'light' | 'dark';
    language: string;
    currency: string;
    notificationsEnabled: boolean;
  };
}

let settings: SystemSettings = {
  general: {
    businessName: "Barako Store",
    email: "contact@barako.com",
    phone: "+252 63 444 5555",
    address: "Burao, Somaliland",
    logo: "https://api.dicebear.com/7.x/identicon/svg?seed=Barako"
  },
  account: {
    name: "Mohamed Barako",
    email: "mohamed@barako.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mohamed"
  },
  security: {
    twoFactorEnabled: false,
    passwordChangedAt: new Date().toISOString()
  },
  preferences: {
    theme: 'light',
    language: 'English',
    currency: 'USD',
    notificationsEnabled: true
  }
};

export const getSettings = () => settings;

export const updateSettings = (section: keyof SystemSettings, data: any) => {
  settings = {
    ...settings,
    [section]: {
      ...settings[section],
      ...data
    }
  };
  return settings;
};
