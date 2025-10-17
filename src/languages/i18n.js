import i18next from "i18next";
import english from './eng/eng.json'
import turkish from './tr/tr.json'
import { getLocales } from "react-native-localize";
import { initReactI18next } from "react-i18next";


const languageDetector = {
    type:'languageDetector',
    async:true,
    detect:(callback)=>{
        return callback(getLocales()[0].languageCode)
    },
    init:()=>{},
    cacheUserLanguage:()=>{}


}

i18next.use(languageDetector)
    .use(initReactI18next)

    .init({
        compatibilityJSON:"v3",
        resources: {
            en: english,
            tr: turkish
        },

        fallbackLng: 'en'
    });

export default i18next