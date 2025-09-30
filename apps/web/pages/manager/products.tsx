import { useState, useEffect } from 'react'
import { GetServerSideProps } from 'next/router'
import { Button, Input, Card } from '@sabir-khatabook/ui'
import Layout from '@/components/Layout'
import { loadTranslations, detectLocaleFromCookie } from '@/utils/i18n'
import axios from 'axios'

interface ProductsProps {
  translations: any
}

export default function Products({ translations }: ProductsProps) {
  const [user, setUser] = useState(null)
  const [products, setProducts] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'fertilizer',
    unit: '',
    price: '',
    stock: ''
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

      const productsResponse = await axios.get('/api/manager/products', { headers })
      setProducts(productsResponse.data)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('auth_token')
      const headers = { Authorization: `Bearer ${token}` }

      if (editingProduct) {
        await axios.put(`/api/manager/products/${editingProduct.id}`, formData, { headers })
      } else {
        await axios.post('/api/manager/products', formData, { headers })
      }

      setShowModal(false)
      setEditingProduct(null)
      setFormData({ name: '', type: 'fertilizer', unit: '', price: '', stock: '' })
      fetchData()
    } catch (error) {
      console.error('Failed to save product:', error)
    }
  }

  const handleEdit = (product: any) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      type: product.type,
      unit: product.unit,
      price: product.price.toString(),
      stock: product.stock.toString()
    })
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return

    try {
      const token = localStorage.getItem('auth_token')
      const headers = { Authorization: `Bearer ${token}` }
      await axios.delete(`/api/manager/products/${id}`, { headers })
      fetchData()
    } catch (error) {
      console.error('Failed to delete product:', error)
    }
  }

  return (
    <Layout user={user} translations={translations}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">{t('products.title')}</h1>
          <Button onClick={() => setShowModal(true)}>{t('products.add')}</Button>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('products.name')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('products.type')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('products.unit')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('products.price')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('products.stock')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('products.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product: any) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {t(`products.${product.type}`)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₨{product.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        product.stock < 10 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                      <Button size="sm" variant="secondary" onClick={() => handleEdit(product)}>
                        {t('products.edit')}
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(product.id)}>
                        {t('products.delete')}
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
                {editingProduct ? t('products.edit') : t('products.add')}
              </h2>
              
              <form onSubmit={handleSubmit}>
                <Input
                  label={t('products.name')}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('products.type')}
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="fertilizer">{t('products.fertilizer')}</option>
                    <option value="seed">{t('products.seed')}</option>
                    <option value="spray">{t('products.spray')}</option>
                  </select>
                </div>

                <Input
                  label={t('products.unit')}
                  value={formData.unit}
                  onChange={(e) => setFormData({...formData, unit: e.target.value})}
                  required
                />

                <Input
                  label={t('products.price')}
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  required
                />

                <Input
                  label={t('products.stock')}
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  required
                />

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowModal(false)
                      setEditingProduct(null)
                      setFormData({ name: '', type: 'fertilizer', unit: '', price: '', stock: '' })
                    }}
                  >
                    {t('products.cancel')}
                  </Button>
                  <Button type="submit">{t('products.save')}</Button>
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