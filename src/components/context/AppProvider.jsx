import {useState, useContext, createContext, useEffect} from "react";
const CampusContext = createContext();
export function useCampus () {
    return useContext(CampusContext);
}

import translations from "../constants/translations";

const AppProvider = ({children}) => {
  const [language, setLanguage] = useState("");
  const [isActiveModalNavbar, setIsActiveModalNavbar] = useState(false);
  const [isActivePage, setIsActivePage] = useState(false);
  const [lang, setLang] = useState("fr");
  const t = translations[lang]

  useEffect(() => {
    console.log('changed');
  }, [lang]);

  const value = {
    language: language,
    isActiveModalNavbar: isActiveModalNavbar,
    setIsActiveModalNavbar: setIsActiveModalNavbar,
    isActivePage: setIsActivePage,
    lang: lang,
    setLang: setLang,
    t: t
  }

  return (
    <CampusContext.Provider value={value}>
      {children}
    </CampusContext.Provider>
  )
}

export default AppProvider