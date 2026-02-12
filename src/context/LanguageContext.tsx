import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, Language } from "@/lib/translations";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [language, setLanguage] = useState<Language>(() => {
        return (localStorage.getItem("app-language") as Language) || "English";
    });

    useEffect(() => {
        localStorage.setItem("app-language", language);
    }, [language]);

    const t = (key: string): string => {
        const langData = translations[language] as Record<string, string>;
        return langData[key] || key; // Fallback to key if translation missing
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};
