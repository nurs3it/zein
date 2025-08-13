export interface User {
  id: number;
  email: string;
  name: string;
  avatar?: string;
  date_joined: string;
  is_active: boolean;
}

export interface UserProfile extends User {
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}
