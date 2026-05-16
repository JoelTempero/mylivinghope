import { useState } from 'react'
import { useCollection } from '../hooks/useCollection'
import { useAuth } from '../hooks/useAuth'
import { Card, Button, Modal, Input } from '../components/ui'
import { Textarea } from '../components/ui/Input'
import { Plus, ClipboardList, ExternalLink, Check, Circle, Pencil, Trash2 } from 'lucide-react'

const CATEGORIES = [
  'Business Structure',
  'Business Name',
  'NZBN',
  'IRD',
  'Tax',
  'Banking',
  'Accounting',
  'Intellectual Property',
  'Contracts',
  'Product Compliance',
  'Sales',
  'Manufacturing',
  'Logistics',
  'Insurance',
  'Marketing',
  'Record Keeping',
  'Optional',
]

const initialFormState = {
  category: '',
  task: '',
  details: '',
  link: '',
  completed: false,
}

export default function BusinessChecklist() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState(initialFormState)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const { data: items, loading, add, update, remove } = useCollection('businessChecklist', {
    orderByField: 'category',
    orderDirection: 'asc',
  })
  const { isEditor, isAdmin } = useAuth()

  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    const category = item.category || 'Uncategorized'
    if (!acc[category]) acc[category] = []
    acc[category].push(item)
    return acc
  }, {})

  // Calculate progress
  const completedCount = items.filter((i) => i.completed).length
  const totalCount = items.length
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item)
      setFormData({
        category: item.category || '',
        task: item.task || '',
        details: item.details || '',
        link: item.link || '',
        completed: item.completed || false,
      })
    } else {
      setEditingItem(null)
      setFormData(initialFormState)
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingItem(null)
    setFormData(initialFormState)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (editingItem) {
        await update(editingItem.id, formData)
      } else {
        await add(formData)
      }
      closeModal()
    } catch (error) {
      console.error('Error saving item:', error)
    } finally {
      setSaving(false)
    }
  }

  const toggleComplete = async (item) => {
    try {
      await update(item.id, { completed: !item.completed })
    } catch (error) {
      console.error('Error toggling item:', error)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await remove(deleteId)
      setDeleteId(null)
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Business Checklist</h1>
          <p className="page-subtitle">Track your business setup progress</p>
        </div>
        {isEditor && (
          <Button onClick={() => openModal()}>
            <Plus className="w-4 h-4" />
            Add Item
          </Button>
        )}
      </div>

      {/* Progress card */}
      <Card>
        <Card.Body>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm text-gray-500">
              {completedCount} of {totalCount} complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-primary-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-right text-sm text-gray-500 mt-1">{progressPercent}%</p>
        </Card.Body>
      </Card>

      {/* Checklist */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : items.length === 0 ? (
        <Card>
          <Card.Body className="text-center py-12">
            <ClipboardList className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No checklist items</h3>
            <p className="text-gray-500 mb-4">Add items to track your business setup</p>
            {isEditor && (
              <Button onClick={() => openModal()} size="sm">
                <Plus className="w-4 h-4" />
                Add Item
              </Button>
            )}
          </Card.Body>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedItems).map(([category, categoryItems]) => (
            <Card key={category}>
              <Card.Header>
                <div className="flex items-center justify-between">
                  <Card.Title>{category}</Card.Title>
                  <span className="text-sm text-gray-500">
                    {categoryItems.filter((i) => i.completed).length}/{categoryItems.length}
                  </span>
                </div>
              </Card.Header>
              <Card.Body className="p-0">
                <ul className="divide-y divide-gray-100">
                  {categoryItems.map((item) => (
                    <li
                      key={item.id}
                      className={`flex items-start gap-4 p-4 ${
                        item.completed ? 'bg-green-50' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      {isEditor ? (
                        <button
                          onClick={() => toggleComplete(item)}
                          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                            item.completed
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'border-gray-300 hover:border-primary-500'
                          }`}
                        >
                          {item.completed && <Check className="w-4 h-4" />}
                        </button>
                      ) : (
                        <div
                          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            item.completed
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'border-gray-300'
                          }`}
                        >
                          {item.completed ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Circle className="w-4 h-4 text-gray-300" />
                          )}
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-medium ${
                            item.completed ? 'text-green-700 line-through' : 'text-gray-900'
                          }`}
                        >
                          {item.task}
                        </p>
                        {item.details && (
                          <p className="text-sm text-gray-500 mt-1">{item.details}</p>
                        )}
                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 mt-2"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Resource link
                          </a>
                        )}
                      </div>

                      {/* Actions */}
                      {isEditor && (
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => openModal(item)}
                            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          {isAdmin && (
                            <button
                              onClick={() => setDeleteId(item.id)}
                              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingItem ? 'Edit Item' : 'Add Item'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="input-field"
              required
            >
              <option value="">Select category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Task"
            value={formData.task}
            onChange={(e) => setFormData({ ...formData, task: e.target.value })}
            placeholder="What needs to be done?"
            required
          />

          <Textarea
            label="Details"
            value={formData.details}
            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
            placeholder="Additional details..."
            rows={3}
          />

          <Input
            label="Resource Link"
            type="url"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            placeholder="https://..."
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.completed}
              onChange={(e) => setFormData({ ...formData, completed: e.target.checked })}
              className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">Mark as completed</span>
          </label>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {editingItem ? 'Save Changes' : 'Add Item'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Item"
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
          Are you sure you want to delete this checklist item? This action cannot be undone.
        </p>
      </Modal>
    </div>
  )
}
