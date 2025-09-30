import { useState, useEffect } from 'react'
import type { GetServerSideProps } from 'next'
import { Card } from '@sabir-khatabook/ui'
import Layout from '@/components/Layout'
import { loadTranslations, detectLocaleFromCookie } from '@/utils/i18n'
import axios from 'axios'

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'manager';
}

interface DashboardProps {
  translations: any
}

export default function ManagerDashboard({ translations }: DashboardProps) {
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState({
    totalSales: 0,
    totalDues: 0,
    lowStockItems: 0,
    recentTransactions: []
  })

  const t = (key: string) => {
    const keys = key.split('.')
    let value = translations
    for (const k of keys) {
      value = value?.[k]
    }
    return value || key
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        if (!token) return

        const headers = { Authorization: `Bearer ${token}` }
        
        const userResponse = await axios.get('/api/auth/me', { headers })
        setUser(userResponse.data)

        const reportsResponse = await axios.get('/api/manager/reports/summary', { headers })
        setStats(reportsResponse.data)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <Layout user={user} translations={translations}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('dashboard.welcome')}, {user?.name}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">₨</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{t('dashboard.totalSales')}</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ₨{stats.totalSales.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">₨</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{t('dashboard.totalDues')}</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ₨{stats.totalDues.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">!</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{t('dashboard.lowStock')}</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.lowStockItems}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title={t('dashboard.recentTransactions')}>
            <div className="space-y-3">
              {stats.recentTransactions.slice(0, 5).map((transaction: any) => (
                <div key={transaction.id} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <p className="font-medium">{transaction.client.name}</p>
                    <p className="text-sm text-gray-500">
                      {transaction.type === 'sale' ? t('transactions.sale') : t('transactions.payment')}
                    </p>
                  </div>
                  <p className="font-semibold">₨{transaction.amount.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card title={t('dashboard.quickActions')}>
            <div className="space-y-3">
              <a
                href="/manager/products"
                className="block w-full p-3 text-center bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {t('dashboard.addProduct')}
              </a>
              <a
                href="/manager/clients"
                className="block w-full p-3 text-center bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                {t('dashboard.addClient')}
              </a>
              <a
                href="/manager/transactions"
                className="block w-full p-3 text-center bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                {t('dashboard.newTransaction')}
              </a>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
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