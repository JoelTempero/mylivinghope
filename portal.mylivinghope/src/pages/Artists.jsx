import { useState } from 'react'
import { useCollection } from '../hooks/useCollection'
import { useAuth } from '../hooks/useAuth'
import { Card, Button, Table, Badge, Modal, Input, Select } from '../components/ui'
import { Textarea } from '../components/ui/Input'
import { Plus, Palette, Pencil, Trash2, Search, Mail } from 'lucide-react'

const ARTIST_STATUSES = [
  { value: 'To Contact', label: 'To Contact' },
  { value: 'Waiting on confirmation', label: 'Waiting on confirmation' },
  { value: 'Waiting on Design', label: 'Waiting on Design' },
  { value: 'Design Received', label: 'Design Received' },
  { value: 'Archived', label: 'Archived' },
]

const initialFormState = {
  name: '',
  email: '',
  phone: '',
  church: '',
  assignedDesign: '',
  status: 'To Contact',
  notes: '',
}

export default function Artists() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingArtist, setEditingArtist] = useState(null)
  const [formData, setFormData] = useState(initialFormState)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const { data: artists, loading, add, update, remove } = useCollection('artists')
  const { isEditor, isAdmin } = useAuth()

  // Filter artists
  const filteredArtists = artists.filter((artist) => {
    const matchesSearch =
      artist.name?.toLowerCase().includes(search.toLowerCase()) ||
      artist.assignedDesign?.toLowerCase().includes(search.toLowerCase()) ||
      artist.church?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = !filterStatus || artist.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const openModal = (artist = null) => {
    if (artist) {
      setEditingArtist(artist)
      setFormData({
        name: artist.name || '',
        email: artist.email || '',
        phone: artist.phone || '',
        church: artist.church || '',
        assignedDesign: artist.assignedDesign || '',
        status: artist.status || 'To Contact',
        notes: artist.notes || '',
      })
    } else {
      setEditingArtist(null)
      setFormData(initialFormState)
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingArtist(null)
    setFormData(initialFormState)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (editingArtist) {
        await update(editingArtist.id, formData)
      } else {
        await add(formData)
      }
      closeModal()
    } catch (error) {
      console.error('Error saving artist:', error)
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
      console.error('Error deleting artist:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Artists & Artwork</h1>
          <p className="page-subtitle">Track commissioned artwork and artists</p>
        </div>
        {isEditor && (
          <Button onClick={() => openModal()}>
            <Plus className="w-4 h-4" />
            Add Artist
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
              placeholder="Search artists or designs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[{ value: '', label: 'All Statuses' }, ...ARTIST_STATUSES]}
            className="sm:w-56"
          />
        </Card.Body>
      </Card>

      {/* Artists table */}
      <Card>
        <Table>
          <Table.Head>
            <tr>
              <Table.HeaderCell>Assigned Design</Table.HeaderCell>
              <Table.HeaderCell>Artist</Table.HeaderCell>
              <Table.HeaderCell>Church</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              {isEditor && <Table.HeaderCell className="w-20">Actions</Table.HeaderCell>}
            </tr>
          </Table.Head>
          <Table.Body>
            {loading ? (
              <Table.Loading columns={isEditor ? 5 : 4} />
            ) : filteredArtists.length === 0 ? (
              <Table.Empty
                icon={Palette}
                title="No artists found"
                description={search || filterStatus ? 'Try adjusting your filters' : 'Add your first artist to get started'}
                action={
                  isEditor && !search && !filterStatus ? (
                    <Button onClick={() => openModal()} size="sm">
                      <Plus className="w-4 h-4" />
                      Add Artist
                    </Button>
                  ) : null
                }
              />
            ) : (
              filteredArtists.map((artist) => (
                <Table.Row key={artist.id}>
                  <Table.Cell>
                    <p className="font-medium">{artist.assignedDesign || 'Unassigned'}</p>
                  </Table.Cell>
                  <Table.Cell>
                    <div>
                      <p className="font-medium">{artist.name || 'TBD'}</p>
                      {artist.email && (
                        <a
                          href={`mailto:${artist.email}`}
                          className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                        >
                          <Mail className="w-3 h-3" />
                          {artist.email}
                        </a>
                      )}
                    </div>
                  </Table.Cell>
                  <Table.Cell>{artist.church || '-'}</Table.Cell>
                  <Table.Cell>
                    <Badge status={artist.status}>{artist.status}</Badge>
                  </Table.Cell>
                  {isEditor && (
                    <Table.Cell>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openModal(artist)}
                          className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => setDeleteId(artist.id)}
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
        title={editingArtist ? 'Edit Artist' : 'Add Artist'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Assigned Design"
            value={formData.assignedDesign}
            onChange={(e) => setFormData({ ...formData, assignedDesign: e.target.value })}
            placeholder="e.g., Happy Hippo, Anxious Mouse"
            required
          />

          <Input
            label="Artist Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Artist's name"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@example.com"
            />
            <Input
              label="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Phone number"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Church"
              value={formData.church}
              onChange={(e) => setFormData({ ...formData, church: e.target.value })}
              placeholder="Connected church"
            />
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={ARTIST_STATUSES}
            />
          </div>

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
              {editingArtist ? 'Save Changes' : 'Add Artist'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Artist"
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
          Are you sure you want to delete this artist? This action cannot be undone.
        </p>
      </Modal>
    </div>
  )
}
