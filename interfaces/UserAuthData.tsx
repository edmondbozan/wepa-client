interface UserAuthData {
    userId: string;
    email?: string | null;
    fullName?: {
      givenName?: string | null;
      familyName?: string | null;
      middleName?: string | null;
    };
    idToken: string;
    provider: 'apple' | 'google';
  }

  interface PatchModel {
    key: string;
    value: any;
  }
  