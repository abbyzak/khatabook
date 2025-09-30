import { useState } from 'react'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { Button, Input, Card } from '@sabir-khatabook/ui'
import { loadTranslations, detectLocaleFromCookie } from '@/utils/i18n'
import axios from 'axios'

interface LoginProps {
  translations: any
}

export default function Login({ translations }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const t = (key: string) => {
    const keys = key.split('.')
    let value = translations
    for (const k of keys) {
      value = value?.[k]
    }
    return value || key
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await axios.post('/api/auth/login', { email, password })
      localStorage.setItem('auth_token', response.data.token)
      
      if (response.data.user.role === 'admin') {
        router.push('/admin/dashboard')
      } else {
        router.push('/manager/dashboard')
      }
    } catch (error: any) {
      setError(error.response?.data?.error || t('auth.invalidCredentials'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">صابر کھاتہ بک</h1>
          <p className="text-gray-600">{t('auth.login')}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Input
            label={t('auth.email')}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label={t('auth.password')}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            loading={loading}
            disabled={loading}
          >
            {t('auth.loginButton')}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Demo Credentials:</p>
          <p>Admin: admin@sabirkhatabook.test / Admin123!</p>
          <p>Manager: ahmed@sabirkhatabook.test / Manager123!</p>
        </div>
      </Card>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const locale = detectLocaleFromCookie(context)
  const translations = await loadTranslations(locale)

  return {
    props: {
      translations
    }
  }
}