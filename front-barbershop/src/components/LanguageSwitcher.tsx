import { useTranslation } from "react-i18next";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggle = () => {
    i18n.changeLanguage(i18n.language === "es" ? "en" : "es");
  };

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm
                 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700
                 text-gray-700 dark:text-gray-300 transition-colors font-medium"
    >
      {i18n.language === "es" ? "🇨🇴 ES" : "🇺🇸 EN"}
    </button>
  );
}
