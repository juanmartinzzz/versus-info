import React, { useState } from 'react';
import { constants } from '../data/constants';

const changeLanguage = ({ lang , setSelectedLanguage }) => {
  setSelectedLanguage(lang);
  localStorage.setItem(constants.localStorageKeys.languageCode, lang);

  // Ideally all re-renders post language change, but it's such a big change it's proly not worth using React for it.
  window.location.reload();
}

const MenuBar = () => {
  const languageCode = localStorage.getItem(constants.localStorageKeys.languageCode);
  const [selectedLanguage, setSelectedLanguage] = useState(languageCode);

  return (
    <div className="sticky top-2 right-0 z-10">
      <div className="relative m-2">
        <div className="absolute right-0 p-1 pl-2 flex items-center gap-2 text-secondary text-sm bg-accent1/10 rounded-full">
          <span>Lang</span>
          {constants.languages.map((lang) => (
            <div key={lang} className={`${selectedLanguage === lang ? 'bg-accent1/66 text-black rounded-full font-bold' : ''} w-6 h-6 p-1 flex items-center justify-center`}>
              <button onClick={() => changeLanguage({ lang, setSelectedLanguage })}>
                {lang}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuBar;