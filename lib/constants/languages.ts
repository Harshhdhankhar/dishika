export const SUPPORTED_LANGUAGES = [
  {
    code: 'hi',
    name: 'हिंदी (Hindi)',
    sttLanguage: 'hi-IN',
    ttsLanguage: 'hi-IN',
  },
  {
    code: 'en',
    name: 'English',
    sttLanguage: 'en-IN',
    ttsLanguage: 'en-IN',
  },
  {
    code: 'hinglish',
    name: 'Hinglish',
    sttLanguage: 'hi-IN',
    ttsLanguage: 'hi-IN',
  },
] as const;

export const DEFAULT_LANGUAGE = 'hi' as const;

export const getLanguageConfig = (code: string) => {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code) || SUPPORTED_LANGUAGES[0];
};
