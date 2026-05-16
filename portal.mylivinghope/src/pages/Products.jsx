import { useState } from 'react'
import { useCollection } from '../hooks/useCollection'
import { useAuth } from '../hooks/useAuth'
import { Card, Button, Table, Badge, Modal, Input, Select } from '../components/ui'
import { Textarea } from '../components/ui/Input'
import { Plus, Package, Pencil, Trash2, Search } from 'lucide-react'

const PRODUCT_TYPES = [
  { value: 'Prayer Cards', label: 'Prayer Cards' },
  { value: 'Kairos Cards', label: 'Kairos Cards' },
  { value: 'Merch', label: 'Merch' },
  { value: 'Digital Content', label: 'Digital Content' },
  { value: 'Product', label: 'Product' },
]

const PRODUCT_STATUSES = [
  { value: 'In stock', label: 'In stock' },
  { value: 'Temporarily unavailable', label: 'Temporarily unavailable' },
  { value: 'Re-purchase needed', label: 'Re-purchase needed' },
  { value: 'Brainstormed', label: 'Brainstormed' },
]

const initialFormState = {
  name: '',
  type: '',
  orderCost: '',
  salePrice: '',
  status: 'Brainstormed',
  notes: '',
}

export default function Products() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState(initialFormState)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const { data: products, loading, add, update, remove } = useCollection('products')
  const { isEditor, isAdmin } = useAuth()

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = !filterStatus || product.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name || '',
        type: product.type || '',
        orderCost: product.orderCost || '',
        salePrice: product.salePrice || '',
        status: product.status || 'Brainstormed',
        notes: product.notes || '',
      })
    } else {
      setEditingProduct(null)
      setFormData(initialFormState)
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
    setFormData(initialFormState)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const data = {
        ...formData,
        orderCost: formData.orderCost ? parseFloat(formData.orderCost) : null,
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
      }

      if (editingProduct) {
        await update(editingProduct.id, data)
      } else {
        await add(data)
      }
      closeModal()
    } catch (error) {
      console.error('Error saving product:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await remove(deleteId)
      setDeleteId(null)
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="page-subtitle">Manage your product inventory</p>
        </div>
        {isEditor && (
          <Button onClick={() => openModal()}>
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <Card.Body className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[{ value: '', label: 'All Statuses' }, ...PRODUCT_STATUSES]}
            className="sm:w-48"
          />
        </Card.Body>
      </Card>

      {/* Products table */}
      <Card>
        <Table>
          <Table.Head>
            <tr>
              <Table.HeaderCell>Product</Table.HeaderCell>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>Cost</Table.HeaderCell>
              <Table.HeaderCell>Price</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              {isEditor && <Table.HeaderCell className="w-20">Actions</Table.HeaderCell>}
            </tr>
          </Table.Head>
          <Table.Body>
            {loading ? (
              <Table.Loading columns={isEditor ? 6 : 5} />
            ) : filteredProducts.length === 0 ? (
              <Table.Empty
                icon={Package}
                title="No products found"
                description={search || filterStatus ? 'Try adjusting your filters' : 'Add your first product to get started'}
                action={
                  isEditor && !search && !filterStatus ? (
                    <Button onClick={() => openModal()} size="sm">
                      <Plus className="w-4 h-4" />
                      Add Product
                    </Button>
                  ) : null
                }
              />
            ) : (
              filteredProducts.map((product) => (
                <Table.Row key={product.id}>
                  <Table.Cell>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      {product.notes && (
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {product.notes}
                        </p>
                      )}
                    </div>
                  </Table.Cell>
                  <Table.Cell>{product.type}</Table.Cell>
                  <Table.Cell>
                    {product.orderCost ? `$${product.orderCost.toFixed(2)}` : '-'}
                  </Table.Cell>
                  <Table.Cell>
                    {product.salePrice ? `$${product.salePrice.toFixed(2)}` : '-'}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge status={product.status}>{product.status}</Badge>
                  </Table.Cell>
                  {isEditor && (
                    <Table.Cell>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openModal(product)}
                          className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => setDeleteId(product.id)}
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </Table.Cell>
                  )}
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table>
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingProduct ? 'Edit Product' : 'Add Product'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Product Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Prayer Cards Vol. 1"
            required
          />

          <Select
            label="Type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            options={PRODUCT_TYPES}
            placeholder="Select type"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Order Cost ($)"
              type="number"
              step="0.01"
              value={formData.orderCost}
              onChange={(e) => setFormData({ ...formData, orderCost: e.target.value })}
              placeholder="0.00"
            />
            <Input
              label="Sale Price ($)"
              type="number"
              step="0.01"
              value={formData.salePrice}
              onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
              placeholder="0.00"
            />
          </div>

          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={PRODUCT_STATUSES}
          />

          <Textarea
            label="Notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Additional notes..."
            rows={3}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {editingProduct ? 'Save Changes' : 'Add Product'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Product"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-gray-600">
          Are you sure you want to delete this product? This action cannot be undone.
        </p>
      </Modal>
    </div>
  )
}
