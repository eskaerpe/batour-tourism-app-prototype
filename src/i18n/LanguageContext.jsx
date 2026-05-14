import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { defaultLanguage, supportedLanguages, translations } from "./translations";

const LanguageContext = createContext(null);

function resolveInitialLanguage(initialLanguage) {
	if (initialLanguage && translations[initialLanguage]) {
		return initialLanguage;
	}
	if (typeof window === "undefined") {
		return defaultLanguage;
	}
	const stored = window.localStorage.getItem("batour-language");
	if (stored && translations[stored]) {
		return stored;
	}
	return defaultLanguage;
}

export function LanguageProvider({ children, initialLanguage }) {
	const [language, setLanguageState] = useState(() => resolveInitialLanguage(initialLanguage));

	const setLanguage = useCallback((nextLanguage) => {
		if (!translations[nextLanguage]) {
			return;
		}
		setLanguageState(nextLanguage);
		if (typeof window !== "undefined") {
			window.localStorage.setItem("batour-language", nextLanguage);
		}
	}, []);

	const toggleLanguage = useCallback(() => {
		setLanguageState((current) => {
			const ordered = supportedLanguages;
			const index = ordered.indexOf(current);
			const next = ordered[(index + 1) % ordered.length] || defaultLanguage;
			if (typeof window !== "undefined") {
				window.localStorage.setItem("batour-language", next);
			}
			return next;
		});
	}, []);

	const t = useCallback(
		(key, fallback) => {
			const segments = key.split(".");
			let value = translations[language];
			for (const segment of segments) {
				if (!value || typeof value !== "object") {
					value = undefined;
					break;
				}
				value = value[segment];
			}
			if (typeof value === "string") {
				return value;
			}
			return fallback ?? key;
		},
		[language],
	);

	const contextValue = useMemo(() => ({ language, setLanguage, toggleLanguage, t }), [language, setLanguage, toggleLanguage, t]);

	return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>;
}

export function useTranslation() {
	const context = useContext(LanguageContext);
	if (!context) {
		throw new Error("useTranslation must be used within a LanguageProvider");
	}
	return context;
}
