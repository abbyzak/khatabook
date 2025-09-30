import { useState, useEffect } from 'react'
import type { GetServerSideProps } from 'next'
import { Card } from '@sabir-khatabook/ui'
import Layout from '@/components/Layout'
import { loadTranslations, detectLocaleFromCookie } from '@/utils/i18n'
import axios from 'axios'

interface Client {
  id: number
  name: string
}

interface Product {
  id: number
  name: string
}

interface Transaction {
  id: number
  type: 'sale' | 'payment'
  amount: number
  quantity?: number
  note?: string
  createdAt: string
  client: Client
  product?: Product
}

interface TransactionsProps {
  translations: any
}

export default function Transactions({ translations }: TransactionsProps) {
  const [user, setUser] = useState(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const t = (key: string) => {
    const keys = key.split('.')
    let value = translations
    for (const k of keys) {
      value = value?.[k]
    }
    return value || key
  }

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) return

      const headers = { Authorization: `Bearer ${token}` }
      
      const userResponse = await axios.get('/api/auth/me', { headers })
      setUser(userResponse.data)

      const clientsResponse = await axios.get('/api/manager/clients', { headers })
      const allTransactions = []
      
      for (const client of clientsResponse.data) {
        const transactionsResponse = await axios.get(`/api/manager/clients/${client.id}/transactions`, { headers })
        allTransactions.push(...transactionsResponse.data.map((t: Omit<Transaction, 'client'>) => ({ ...t, client })))
      }
      
      setTransactions(allTransactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    } catch (error) {
      console.error('Failed to fetch data:', error)
    }
  }

  return (
    <Layout user={user} translations={translations}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">{t('transactions.title')}</h1>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('transactions.date')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('transactions.client')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('transactions.type')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('transactions.product')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('transactions.quantity')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('transactions.amount')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('transactions.note')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction: any) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.client.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        transaction.type === 'sale' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {transaction.type === 'sale' ? t('transactions.sale') : t('transactions.payment')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.product?.name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.quantity || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₨{transaction.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.note || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
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