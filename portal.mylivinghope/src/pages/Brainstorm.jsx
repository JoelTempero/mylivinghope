import { useState } from 'react'
import { useCollection } from '../hooks/useCollection'
import { useAuth } from '../hooks/useAuth'
import { Card, Button, Badge, Modal, Input, Select } from '../components/ui'
import { Textarea } from '../components/ui/Input'
import { Plus, Lightbulb, Pencil, Trash2, Search, ThumbsUp } from 'lucide-react'

const IDEA_STATUSES = [
  { value: 'New', label: 'New' },
  { value: 'Noted', label: 'Noted' },
  { value: 'Actioned', label: 'Actioned' },
]

const TEAM_MEMBERS = [
  { value: 'Joel T', label: 'Joel T' },
  { value: 'Jesse M', label: 'Jesse M' },
]

const initialFormState = {
  submittedBy: '',
  idea: '',
  details: '',
  pros: '',
  cons: '',
  status: 'New',
  actions: '',
}

export default function Brainstorm() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingIdea, setEditingIdea] = useState(null)
  const [formData, setFormData] = useState(initialFormState)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const { data: ideas, loading, add, update, remove } = useCollection('brainstormIdeas')
  const { isEditor, isAdmin, userProfile } = useAuth()

  // Filter ideas
  const filteredIdeas = ideas.filter((idea) => {
    const matchesSearch =
      idea.idea?.toLowerCase().includes(search.toLowerCase()) ||
      idea.details?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = !filterStatus || idea.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const openModal = (idea = null) => {
    if (idea) {
      setEditingIdea(idea)
      setFormData({
        submittedBy: idea.submittedBy || '',
        idea: idea.idea || '',
        details: idea.details || '',
        pros: idea.pros || '',
        cons: idea.cons || '',
        status: idea.status || 'New',
        actions: idea.actions || '',
      })
    } else {
      setEditingIdea(null)
      setFormData({
        ...initialFormState,
        submittedBy: userProfile?.displayName || '',
      })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingIdea(null)
    setFormData(initialFormState)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (editingIdea) {
        await update(editingIdea.id, formData)
      } else {
        await add(formData)
      }
      closeModal()
    } catch (error) {
      console.error('Error saving idea:', error)
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
      console.error('Error deleting idea:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Brainstorm</h1>
          <p className="page-subtitle">Ideas and innovation tracking</p>
        </div>
        {isEditor && (
          <Button onClick={() => openModal()}>
            <Plus className="w-4 h-4" />
            Add Idea
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
              placeholder="Search ideas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[{ value: '', label: 'All Statuses' }, ...IDEA_STATUSES]}
            className="sm:w-48"
          />
        </Card.Body>
      </Card>

      {/* Ideas grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : filteredIdeas.length === 0 ? (
        <Card>
          <Card.Body className="text-center py-12">
            <Lightbulb className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No ideas found</h3>
            <p className="text-gray-500 mb-4">
              {search || filterStatus ? 'Try adjusting your filters' : 'Share your first idea'}
            </p>
            {isEditor && !search && !filterStatus && (
              <Button onClick={() => openModal()} size="sm">
                <Plus className="w-4 h-4" />
                Add Idea
              </Button>
            )}
          </Card.Body>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIdeas.map((idea) => (
            <Card key={idea.id} className="flex flex-col">
              <Card.Body className="flex-1">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <Badge status={idea.status}>{idea.status}</Badge>
                  {isEditor && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openModal(idea)}
                        className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => setDeleteId(idea.id)}
                          className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <h3 className="font-semibold text-gray-900 mb-2">{idea.idea}</h3>

                {idea.details && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">{idea.details}</p>
                )}

                {idea.pros && (
                  <div className="mb-2">
                    <p className="text-xs font-medium text-green-700 uppercase mb-1">
                      <ThumbsUp className="w-3 h-3 inline mr-1" />
                      Pros
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-2">{idea.pros}</p>
                  </div>
                )}

                {idea.cons && (
                  <div className="mb-2">
                    <p className="text-xs font-medium text-red-700 uppercase mb-1">Considerations</p>
                    <p className="text-sm text-gray-600 line-clamp-2">{idea.cons}</p>
                  </div>
                )}
              </Card.Body>

              <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
                <p className="text-xs text-gray-500">
                  Submitted by <span className="font-medium">{idea.submittedBy || 'Unknown'}</span>
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingIdea ? 'Edit Idea' : 'Add Idea'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Submitted By"
              value={formData.submittedBy}
              onChange={(e) => setFormData({ ...formData, submittedBy: e.target.value })}
              options={TEAM_MEMBERS}
              required
            />
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={IDEA_STATUSES}
            />
          </div>

          <Input
            label="Idea"
            value={formData.idea}
            onChange={(e) => setFormData({ ...formData, idea: e.target.value })}
            placeholder="What's your idea?"
            required
          />

          <Textarea
            label="Details"
            value={formData.details}
            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
            placeholder="Describe the idea in more detail..."
            rows={3}
          />

          <div className="grid md:grid-cols-2 gap-4">
            <Textarea
              label="Pros"
              value={formData.pros}
              onChange={(e) => setFormData({ ...formData, pros: e.target.value })}
              placeholder="What are the benefits?"
              rows={3}
            />
            <Textarea
              label="Considerations / Questions"
              value={formData.cons}
              onChange={(e) => setFormData({ ...formData, cons: e.target.value })}
              placeholder="Any concerns or questions?"
              rows={3}
            />
          </div>

          <Textarea
            label="Actions to be Taken"
            value={formData.actions}
            onChange={(e) => setFormData({ ...formData, actions: e.target.value })}
            placeholder="Next steps..."
            rows={2}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {editingIdea ? 'Save Changes' : 'Add Idea'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Idea"
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
          Are you sure you want to delete this idea? This action cannot be undone.
        </p>
      </Modal>
    </div>
  )
}
