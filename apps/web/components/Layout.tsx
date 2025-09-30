import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Button } from '@sabir-khatabook/ui'

interface LayoutProps {
  children: React.ReactNode
  user?: any
  translations: any
}

export default function Layout({ children, user, translations }: LayoutProps) {
  const router = useRouter()
  const [locale, setLocale] = useState('en')

  useEffect(() => {
    const savedLocale = document.cookie.split('; ')
      .find(row => row.startsWith('NEXT_LOCALE='))
      ?.split('=')[1] || 'en'
    
    setLocale(savedLocale)
    document.documentElement.dir = savedLocale === 'ur' ? 'rtl' : 'ltr'
    document.documentElement.lang = savedLocale
  }, [])

  const switchLanguage = (newLocale: string) => {
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`
    setLocale(newLocale)
    document.documentElement.dir = newLocale === 'ur' ? 'rtl' : 'ltr'
    document.documentElement.lang = newLocale
    window.location.reload()
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    router.push('/login')
  }

  const t = (key: string) => {
    const keys = key.split('.')
    let value = translations
    for (const k of keys) {
      value = value?.[k]
    }
    return value || key
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">{children}</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-blue-600">صابر کھاتہ بک</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => switchLanguage('en')}
                  className={`px-3 py-1 rounded ${locale === 'en' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                >
                  English
                </button>
                <button
                  onClick={() => switchLanguage('ur')}
                  className={`px-3 py-1 rounded ${locale === 'ur' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                >
                  اردو
                </button>
              </div>
              
              <span className="text-gray-700">{user.name}</span>
              <Button variant="secondary" size="sm" onClick={logout}>
                {t('nav.logout')}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        <aside className="w-64 bg-white shadow-lg min-h-screen">
          <nav className="mt-8">
            <div className="px-4 space-y-2">
              {user.role === 'admin' ? (
                <>
                  <a
                    href="/admin/dashboard"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    {t('nav.dashboard')}
                  </a>
                  <a
                    href="/admin/managers"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    {t('nav.managers')}
                  </a>
                  <a
                    href="/admin/reports"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    {t('nav.reports')}
                  </a>
                </>
              ) : (
                <>
                  <a
                    href="/manager/dashboard"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    {t('nav.dashboard')}
                  </a>
                  <a
                    href="/manager/products"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    {t('nav.products')}
                  </a>
                  <a
                    href="/manager/clients"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    {t('nav.clients')}
                  </a>
                  <a
                    href="/manager/transactions"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    {t('nav.transactions')}
                  </a>
                </>
              )}
            </div>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}