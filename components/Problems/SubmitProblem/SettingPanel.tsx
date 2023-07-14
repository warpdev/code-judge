"use client";

import { ILanguage } from "@/types/common";
import { baseSelect } from "@/style/baseComponent";

const SettingPanel = ({
  currentLanguage,
  allLanguages,
  setLanguage,
}: {
  currentLanguage: ILanguage;
  allLanguages: ILanguage[];
  setLanguage: (lang: ILanguage) => void;
}) => {
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLang = allLanguages.find(
      (lang) => lang.id === parseInt(e.target.value),
    );
    if (selectedLang) {
      setLanguage(selectedLang);
    }
  };

  return (
    <div className="flex justify-between">
      <select
        onChange={handleLanguageChange}
        value={currentLanguage.id}
        className={baseSelect}
      >
        {allLanguages.map((lang) => {
          return (
            <option key={lang.id} value={lang.id}>
              {lang.name}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default SettingPanel;
