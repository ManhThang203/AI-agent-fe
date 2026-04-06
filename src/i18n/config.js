import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import HttpBackend from 'i18next-http-backend'

const fallbackLng = 'vi'

void i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    lng: fallbackLng,
    fallbackLng,
    supportedLngs: ['vi', 'en'],
    ns: ['common', 'auth', 'chat', 'account', 'landing'],
    defaultNS: 'common',
    backend: { loadPath: '/locales/{{lng}}/{{ns}}.json' },
    interpolation: { escapeValue: false },
  })

export default i18n
