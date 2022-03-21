import React, { createContext, useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { EN, ZHTW, Language, languages } from 'config/localization';
import translations from 'config/localization/translations.json';
import { ContextApi, ContextData, ProviderState } from './types';
import { LS_KEY, fetchLocale, getLanguageCodeFromLS } from './helpers';

import 'dayjs/locale/zh-tw';
import 'dayjs/locale/en';

const initialState: ProviderState = {
  isFetching: true,
  currentLanguage: EN,
};

// Export the translations directly
export const languageMap = new Map<
  Language['locale'],
  Record<string, string>
>();
languageMap.set(EN.locale, translations);

export const LanguageContext = createContext({} as ContextApi);
export const LanguageProvider: React.FC = ({ children }) => {
  const codeFromStorage = getLanguageCodeFromLS();
  const [state, setState] = useState<ProviderState>({
    ...initialState,
    currentLanguage: languages[codeFromStorage],
  });
  const { currentLanguage } = state;

  useEffect(() => {
    dayjs.locale(currentLanguage?.dayjsCode || 'en');
  }, [currentLanguage?.dayjsCode]);

  useEffect(() => {
    const fetchInitialLocales = async () => {
      const code = getLanguageCodeFromLS();

      if (code !== EN.locale) {
        const enLocale = languageMap.get(EN.locale);
        const currentLocale = await fetchLocale(code);
        languageMap.set(code, { ...enLocale, ...currentLocale });
      }

      // codeFromStorage !== EN.locale
      //   ? dayjs.locale('zh-tw')
      //   : dayjs.locale('en');

      setState(prevState => ({
        ...prevState,
        isFetching: false,
      }));
    };

    fetchInitialLocales();
  }, [setState]);

  const setLanguage = async (language: Language) => {
    if (!languageMap.has(language.locale)) {
      setState(prevState => ({
        ...prevState,
        isFetching: true,
      }));

      const locale = await fetchLocale(language.locale);
      const enLocale = languageMap.get(EN.locale);

      // Merge the EN locale to ensure that any locale fetched has all the keys
      languageMap.set(language.locale, { ...enLocale, ...locale });
      localStorage.setItem(LS_KEY, language.locale);

      setState(prevState => ({
        ...prevState,
        isFetching: false,
        currentLanguage: language,
      }));
    } else {
      localStorage.setItem(LS_KEY, language.locale);
      setState(prevState => ({
        ...prevState,
        isFetching: false,
        currentLanguage: language,
      }));
    }

    // language.locale === ZHTW.locale
    //   ? dayjs.locale('zh-tw')
    //   : dayjs.locale('en');
  };

  const translate = useCallback(
    (key: string, data?: ContextData) => {
      const translationSet = languageMap.has(currentLanguage.locale)
        ? languageMap.get(currentLanguage.locale)
        : languageMap.get(EN.locale);

      const translatedText =
        (translationSet && translationSet[key]) || key || '';

      // Check the existence of at least one combination of %%, separated by 1 or more non space characters
      const includesVariable = translatedText.match(/%\S+?%/gm);

      if (includesVariable && data) {
        let interpolatedText = translatedText;
        Object.keys(data).forEach(dataKey => {
          const templateKey = new RegExp(`%${dataKey}%`, 'g');
          interpolatedText = interpolatedText.replace(
            templateKey,
            data[dataKey].toString(),
          );
        });

        return interpolatedText;
      }

      return translatedText;
    },
    [currentLanguage],
  );

  const getHTML = useCallback(
    (key: string, data?: ContextData) => {
      const translationSet = languageMap.has(currentLanguage.locale)
        ? languageMap.get(currentLanguage.locale)
        : languageMap.get(EN.locale);
      const translatedText = (translationSet && translationSet[key]) || key;

      // Check the existence of at least one combination of %%, separated by 1 or more non space characters
      const includesVariable = translatedText.match(/%\S+?%/gm);

      if (includesVariable && data) {
        let interpolatedText = translatedText;
        Object.keys(data).forEach(dataKey => {
          const templateKey = new RegExp(`%${dataKey}%`, 'g');
          interpolatedText = interpolatedText.replace(
            templateKey,
            data[dataKey].toString(),
          );
        });

        const el = React.createElement('span', {
          dangerouslySetInnerHTML: {
            __html: interpolatedText,
          },
        });
        // when key exists, it should still return element if there's defaultMessage() after getHTML()
        return el;
      }

      return translatedText;
    },
    [currentLanguage],
  );

  return (
    <LanguageContext.Provider
      value={{ ...state, setLanguage, getHTML, t: translate }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
