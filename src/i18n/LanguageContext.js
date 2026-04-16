import React, { createContext, useContext, useState } from 'react';
import { translations } from './translations';

const LanguageContext = createContext();

export const LANGUAGES = [
  { code: 'en', label: 'English',  native: 'English'  },
  { code: 'te', label: 'Telugu',   native: 'తెలుగు'   },
  { code: 'hi', label: 'Hindi',    native: 'हिंदी'    },
  { code: 'ta', label: 'Tamil',    native: 'தமிழ்'    },
  { code: 'kn', label: 'Kannada',  native: 'ಕನ್ನಡ'    },
];

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = (key) => translations[language]?.[key] || translations['en'][key] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);