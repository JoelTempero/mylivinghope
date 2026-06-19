import { useState, useRef } from 'react'
import { useCollection } from '../hooks/useCollection'
import { useAuth } from '../hooks/useAuth'
import { storage } from '../lib/firebase'
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { Card, Button, Table, Badge, Modal, Input, Select } from '../components/ui'
import { Textarea } from '../components/ui/Input'
import { slugify, dollarsToCents, centsToDollars } from '../lib/utils'
import { Plus, ShoppingBag, Pencil, Trash2, Search, Upload, X, Image } from 'lucide-react'

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
]

const FILTER_STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
]

const emptyForm = () => ({
  title: '',
  slug: '',
  subtitle: '',
  description: '',
  price: '',
  compareAtPrice: '',
  status: 'draft',
  inventory: '',
  weight: '',
  sortOrder: '',
  seoTitle: '',
  seoDescription: '',
  images: [],
})

export default function StoreProducts() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState(emptyForm())
  const [slugError, setSlugError] = useState('')
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const imageInputRef = useRef(null)

  const { data: products, loading, add, update, remove } = useCollection('storeProducts', {
    orderByField: 'sortOrder',
    orderDirection: 'asc',
  })
  const { isEditor, isAdmin } = useAuth()

  // Filtered list
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.title?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = !filterStatus || p.status === filterStatus
    return matchesSearch && matchesStatus
  })

  // Derive next sortOrder for new products
  const nextSortOrder = () => {
    if (products.length === 0) return 0
    return Math.max(...products.map((p) => p.sortOrder ?? 0)) + 1
  }

  const openModal = (product = null) => {
    setSlugError('')
    if (product) {
      setEditingProduct(product)
      setFormData({
        title: product.title || '',
        slug: product.slug || '',
        subtitle: product.subtitle || '',
        description: product.description || '',
        price: centsToDollars(product.priceNZD),
        compareAtPrice: product.compareAtPrice != null ? centsToDollars(product.compareAtPrice) : '',
        status: product.status || 'draft',
        inventory: product.inventory != null ? String(product.inventory) : '',
        weight: product.weight != null ? String(product.weight) : '',
        sortOrder: product.sortOrder != null ? String(product.sortOrder) : '',
        seoTitle: product.seo?.title || '',
        seoDescription: product.seo?.description || '',
        images: product.images ? [...product.images] : [],
      })
    } else {
      setEditingProduct(null)
      setFormData({ ...emptyForm(), sortOrder: String(nextSortOrder()) })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
    setFormData(emptyForm())
    setSlugError('')
  }

  // Auto-fill slug from title when creating and slug is empty
  const handleTitleBlur = () => {
    if (!editingProduct && !formData.slug && formData.title) {
      setFormData((prev) => ({ ...prev, slug: slugify(formData.title) }))
    }
  }

  const validateSlug = (slug) => {
    if (!slug) return 'Slug is required'
    const duplicate = products.find(
      (p) => p.slug === slug && p.id !== editingProduct?.id
    )
    if (duplicate) return 'This slug is already used by another product'
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const slugErr = validateSlug(formData.slug)
    if (slugErr) {
      setSlugError(slugErr)
      return
    }

    setSaving(true)
    try {
      const data = {
        title: formData.title,
        slug: formData.slug,
        subtitle: formData.subtitle,
        description: formData.description,
        priceNZD: dollarsToCents(formData.price) ?? 0,
        compareAtPrice: formData.compareAtPrice !== '' ? dollarsToCents(formData.compareAtPrice) : null,
        status: formData.status,
        inventory: formData.inventory !== '' ? parseInt(formData.inventory, 10) : null,
        weight: formData.weight !== '' ? parseInt(formData.weight, 10) : null,
        sortOrder: formData.sortOrder !== '' ? parseInt(formData.sortOrder, 10) : 0,
        images: formData.images,
        seo: {
          title: formData.seoTitle,
          description: formData.seoDescription,
        },
      }

      if (editingProduct) {
        await update(editingProduct.id, data)
      } else {
        await add(data)
      }
      closeModal()
    } catch (err) {
      console.error('Error saving store product:', err)
    } finally {
      setSaving(false)
    }
  }

  // Image upload
  const handleImageFiles = async (files) => {
    if (!files || files.length === 0) return
    setUploadingImages(true)
    setUploadProgress(0)

    const newUrls = []
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
        const storagePath = `storeProducts/${Date.now()}_${safeName}`
        const storageRef = ref(storage, storagePath)

        await new Promise((resolve, reject) => {
          const task = uploadBytesResumable(storageRef, file)
          task.on(
            'state_changed',
            (snapshot) => {
              const fileProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              const overall = ((i + fileProgress / 100) / files.length) * 100
              setUploadProgress(Math.round(overall))
            },
            (err) => reject(err),
            async () => {
              const url = await getDownloadURL(task.snapshot.ref)
              newUrls.push(url)
              resolve()
            }
          )
        })
      }

      setFormData((prev) => ({ ...prev, images: [...prev.images, ...newUrls] }))
    } catch (err) {
      console.error('Image upload error:', err)
    } finally {
      setUploadingImages(false)
      setUploadProgress(0)
      if (imageInputRef.current) imageInputRef.current.value = ''
    }
  }

  const handleRemoveImage = async (urlToRemove) => {
    // Remove from storage (best-effort)
    try {
      const storageRef = ref(storage, urlToRemove)
      await deleteObject(storageRef)
    } catch (err) {
      // URL might not map cleanly to a ref by URL; not fatal
      console.warn('Could not delete image from storage:', err)
    }
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((u) => u !== urlToRemove),
    }))
  }

  // Promote an image to primary (index 0) — the storefront uses images[0] as the
  // main image everywhere (product page, cards, cart).
  const handleSetPrimary = (url) => {
    setFormData((prev) => ({
      ...prev,
      images: [url, ...prev.images.filter((u) => u !== url)],
    }))
  }

  // Delete product (with image cleanup)
  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      // Clean up all images first
      const imageUrls = deleteTarget.images || []
      for (const url of imageUrls) {
        try {
          await deleteObject(ref(storage, url))
        } catch (err) {
          console.warn('Could not delete image from storage:', err)
        }
      }
      await remove(deleteTarget.id)
      setDeleteTarget(null)
    } catch (err) {
      console.error('Error deleting store product:', err)
    } finally {
      setDeleting(false)
    }
  }

  const inventoryDisplay = (inventory) => {
    if (inventory == null) return '∞'
    if (inventory === 0) return '0'
    return inventory
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Store Products</h1>
          <p className="page-subtitle">Manage your public storefront catalog</p>
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
            options={FILTER_STATUS_OPTIONS}
            className="sm:w-48"
          />
        </Card.Body>
      </Card>

      {/* Table */}
      <Card>
        <Table>
          <Table.Head>
            <tr>
              <Table.HeaderCell className="w-14">Image</Table.HeaderCell>
              <Table.HeaderCell>Product</Table.HeaderCell>
              <Table.HeaderCell>Price</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Inventory</Table.HeaderCell>
              {isEditor && <Table.HeaderCell className="w-20">Actions</Table.HeaderCell>}
            </tr>
          </Table.Head>
          <Table.Body>
            {loading ? (
              <Table.Loading columns={isEditor ? 6 : 5} />
            ) : filteredProducts.length === 0 ? (
              <Table.Empty
                icon={ShoppingBag}
                title="No store products found"
                description={
                  search || filterStatus
                    ? 'Try adjusting your filters'
                    : 'Add your first store product to get started'
                }
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
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-10 h-10 rounded object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded bg-gray-100 dark:bg-dark-surface-2 flex items-center justify-center">
                        <Image className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <div>
                      <p className="font-medium">{product.title}</p>
                      {product.subtitle && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                          {product.subtitle}
                        </p>
                      )}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    {product.priceNZD != null ? `$${centsToDollars(product.priceNZD)}` : '-'}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge status={product.status}>{product.status}</Badge>
                  </Table.Cell>
                  <Table.Cell>{inventoryDisplay(product.inventory)}</Table.Cell>
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
                            onClick={() => setDeleteTarget(product)}
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
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            onBlur={handleTitleBlur}
            placeholder="e.g., Prayer Cards Vol. 1"
            required
          />

          <div>
            <Input
              label="Slug"
              value={formData.slug}
              onChange={(e) => {
                setFormData({ ...formData, slug: e.target.value })
                setSlugError('')
              }}
              placeholder="e.g., prayer-cards-vol-1"
            />
            {slugError && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{slugError}</p>
            )}
          </div>

          <Input
            label="Subtitle"
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            placeholder="Short tagline..."
          />

          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Full product description..."
            rows={4}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price NZD ($)"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="0.00"
              required
            />
            <Input
              label="Compare-at Price ($)"
              type="number"
              step="0.01"
              min="0"
              value={formData.compareAtPrice}
              onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
              placeholder="Optional"
            />
          </div>

          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={STATUS_OPTIONS}
          />

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Inventory"
              type="number"
              min="0"
              value={formData.inventory}
              onChange={(e) => setFormData({ ...formData, inventory: e.target.value })}
              placeholder="Blank = unlimited"
            />
            <Input
              label="Weight (g)"
              type="number"
              min="0"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              placeholder="Blank = none"
            />
            <Input
              label="Sort Order"
              type="number"
              min="0"
              value={formData.sortOrder}
              onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
              placeholder="0"
            />
          </div>

          {/* Images */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Images</p>

            {formData.images.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.images.map((url, idx) => (
                  <div key={url} className="relative group">
                    <img
                      src={url}
                      alt={`Product image ${idx + 1}`}
                      className="w-20 h-20 rounded object-cover border border-gray-200 dark:border-dark-border"
                    />
                    {idx === 0 ? (
                      <span className="absolute bottom-0 left-0 right-0 text-center text-[10px] font-semibold bg-black/60 text-white rounded-b py-0.5">
                        Primary
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(url)}
                        className="absolute bottom-0 left-0 right-0 text-center text-[10px] font-semibold bg-black/60 hover:bg-green-700 text-white rounded-b py-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Set main
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(url)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div>
              <input
                ref={imageInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleImageFiles(Array.from(e.target.files))}
                className="hidden"
                id="store-product-images"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => imageInputRef.current?.click()}
                disabled={uploadingImages}
                loading={uploadingImages}
              >
                <Upload className="w-4 h-4" />
                {uploadingImages ? `Uploading... ${uploadProgress}%` : 'Upload Images'}
              </Button>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                First image is the primary. JPG, PNG, WebP accepted.
              </p>
            </div>
          </div>

          {/* SEO */}
          <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-dark-border">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">SEO</p>
            <Input
              label="SEO Title"
              value={formData.seoTitle}
              onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
              placeholder="Defaults to product title if empty"
            />
            <Textarea
              label="SEO Description"
              value={formData.seoDescription}
              onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
              placeholder="Short description for search engines..."
              rows={2}
            />
          </div>

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
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Product"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} loading={deleting}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-gray-600 dark:text-gray-400">
          Are you sure you want to delete{' '}
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {deleteTarget?.title}
          </span>
          ? All images will be permanently removed. This action cannot be undone.
        </p>
      </Modal>
    </div>
  )
}
