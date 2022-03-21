import { EN } from 'config/localization';

const publicUrl = process.env.PUBLIC_URL;

export const LS_KEY = 'storage_language';
export const fetchLocale = async (locale: string) => {
  const response = await fetch(`${publicUrl}/locales/${locale}.json`);
  const data = await response.json();
  return data;
};
export const getLanguageCodeFromLS = () => {
  // return EN.locale
  try {
    const codeFromStorage = localStorage.getItem(LS_KEY);
    return codeFromStorage || EN.locale;
  } catch {
    return EN.locale;
  }
};
