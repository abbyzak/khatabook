import { GetServerSidePropsContext } from 'next'

interface Translations {
  [key: string]: any
}

let translations: { [locale: string]: Translations } = {}

export const loadTranslations = async (locale: string): Promise<Translations> => {
  if (translations[locale]) {
    return translations[locale]
  }

  try {
    const common = await import(`../../../locales/${locale}/common.json`)
    translations[locale] = common.default || common
    return translations[locale]
  } catch (error) {
    console.error(`Failed to load translations for locale: ${locale}`)
    const fallback = await import('../../../locales/en/common.json')
    return fallback.default || fallback
  }
}

export const getTranslations = (locale: string = 'en'): Translations => {
  return translations[locale] || {}
}

export const t = (key: string, locale: string = 'en'): string => {
  const keys = key.split('.')
  let value = translations[locale]
  
  for (const k of keys) {
    value = value?.[k]
  }
  
  return typeof value === 'string' ? value : key
}

export const detectLocaleFromCookie = (context: GetServerSidePropsContext): string => {
  const locale = context.req.cookies.NEXT_LOCALE
  return locale === 'ur' ? 'ur' : 'en'
}