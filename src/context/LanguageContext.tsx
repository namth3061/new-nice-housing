"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import en from '../i18n/en.json';
import vi from '../i18n/vi.json';

type Language = 'en' | 'vi';

interface LanguageContextProps {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string, vars?: Record<string, string | number>) => string;
}

const dictionaries = { en, vi };

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguageState] = useState<Language>('en');

    useEffect(() => {
        const savedLang = localStorage.getItem('appLang') as Language;
        if (savedLang && (savedLang === 'en' || savedLang === 'vi')) {
            setLanguageState(savedLang);
        }
    }, []);

    useEffect(() => {
        if (typeof document !== 'undefined') {
            document.documentElement.lang = language;
        }
    }, [language]);

    // Memoize setLanguage so its reference stays stable
    const setLanguage = React.useCallback((lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('appLang', lang);
    }, []);

    // Memoize t so its reference only changes when language changes
    const t = React.useCallback((key: string, vars?: Record<string, string | number>): string => {
        const keys = key.split('.');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let current: any = dictionaries[language];
        for (const k of keys) {
            if (current[k] === undefined) {
                return key;
            }
            current = current[k];
        }
        let str = current as string;
        if (vars && typeof str === 'string') {
            Object.entries(vars).forEach(([k, v]) => {
                str = str.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), String(v));
            });
        }
        return str;
    }, [language]);

    // Memoize context value to prevent unnecessary consumer re-renders
    const contextValue = React.useMemo(
        () => ({ language, setLanguage, t }),
        [language, setLanguage, t]
    );

    // Always render Provider so t() resolves keys from first paint (no more "common.home" raw keys)
    // Server & client both start with 'en' → no hydration mismatch
    return (
        <LanguageContext.Provider value={contextValue}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        return {
            language: 'en' as Language,
            setLanguage: () => { },
            t: (key: string) => key,
        };
    }
    return context;
};
