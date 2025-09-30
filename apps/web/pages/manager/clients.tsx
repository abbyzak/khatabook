import { useState, useEffect } from 'react'
import { GetServerSideProps } from 'next/router'
import { Button, Input, Card } from '@sabir-khatabook/ui'
import Layout from '@/components/Layout'
import { loadTranslations, detectLocaleFromCookie } from '@/utils/i18n'
import axios from 'axios'

interface ClientsProps {
  translations: any
}

export default function Clients({ translations }: ClientsProps) {
  const [user, setUser] = useState(null)
  const [clients, setClients] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingClient, setEditingClient] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
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
      setClients(clientsResponse.data)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('auth_token')
      const headers = { Authorization: `Bearer ${token}` }

      if (editingClient) {
        await axios.put(`/api/manager/clients/${editingClient.id}`, formData, { headers })
      } else {
        await axios.post('/api/manager/clients', formData, { headers })
      }

      setShowModal(false)
      setEditingClient(null)
      setFormData({ name: '', phone: '', address: '' })
      fetchData()
    } catch (error) {
      console.error('Failed to save client:', error)
    }
  }

  const handleEdit = (client: any) => {
    setEditingClient(client)
    setFormData({
      name: client.name,
      phone: client.phone || '',
      address: client.address || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return

    try {
      const token = localStorage.getItem('auth_token')
      const headers = { Authorization: `Bearer ${token}` }
      await axios.delete(`/api/manager/clients/${id}`, { headers })
      fetchData()
    } catch (error) {
      console.error('Failed to delete client:', error)
    }
  }

  return (
    <Layout user={user} translations={translations}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">{t('clients.title')}</h1>
          <Button onClick={() => setShowModal(true)}>{t('clients.add')}</Button>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('clients.name')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('clients.phone')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('clients.address')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('clients.balance')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('clients.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clients.map((client: any) => (
                  <tr key={client.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {client.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {client.phone || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {client.address || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`font-semibold ${client.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        ₨{client.balance.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                      <Button 
                        size="sm" 
                        variant="primary" 
                        onClick={() => window.location.href = `/manager/clients/${client.id}`}
                      >
                        {t('clients.viewTransactions')}
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => handleEdit(client)}>
                        {t('clients.edit')}
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(client.id)}>
                        {t('clients.delete')}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-semibold mb-4">
                {editingClient ? t('clients.edit') : t('clients.add')}
              </h2>
              
              <form onSubmit={handleSubmit}>
                <Input
                  label={t('clients.name')}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />

                <Input
                  label={t('clients.phone')}
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />

                <Input
                  label={t('clients.address')}
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowModal(false)
                      setEditingClient(null)
                      setFormData({ name: '', phone: '', address: '' })
                    }}
                  >
                    {t('clients.cancel')}
                  </Button>
                  <Button type="submit">{t('clients.save')}</Button>
                </div>
              </form>
            </div>
          </div>
        )}
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