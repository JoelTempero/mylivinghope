import { useState } from 'react'
import { useCollection } from '../hooks/useCollection'
import { useAuth } from '../hooks/useAuth'
import { Card, Button, Table, Badge, Modal, Input, Select } from '../components/ui'
import { Textarea } from '../components/ui/Input'
import { Plus, Megaphone, Pencil, Trash2, Search } from 'lucide-react'

const CAMPAIGN_TYPES = [
  { value: 'Email', label: 'Email' },
  { value: 'Instagram/TikTok', label: 'Instagram/TikTok' },
  { value: 'Blog post', label: 'Blog post' },
  { value: 'Email, Instagram/TikTok', label: 'Email + Social' },
]

const CAMPAIGN_STATUSES = [
  { value: 'New', label: 'New' },
  { value: 'In progress', label: 'In progress' },
  { value: 'Paused', label: 'Paused' },
  { value: 'Published', label: 'Published' },
]

const TEAM_MEMBERS = [
  { value: 'Joel T', label: 'Joel T' },
  { value: 'Jesse M', label: 'Jesse M' },
]

const initialFormState = {
  content: '',
  type: '',
  details: '',
  oversight: '',
  status: 'New',
  notes: '',
}

export default function Campaigns() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState(null)
  const [formData, setFormData] = useState(initialFormState)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const { data: campaigns, loading, add, update, remove } = useCollection('campaigns')
  const { isEditor, isAdmin } = useAuth()

  // Filter campaigns
  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.content?.toLowerCase().includes(search.toLowerCase()) ||
      campaign.type?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = !filterStatus || campaign.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const openModal = (campaign = null) => {
    if (campaign) {
      setEditingCampaign(campaign)
      setFormData({
        content: campaign.content || '',
        type: campaign.type || '',
        details: campaign.details || '',
        oversight: campaign.oversight || '',
        status: campaign.status || 'New',
        notes: campaign.notes || '',
      })
    } else {
      setEditingCampaign(null)
      setFormData(initialFormState)
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingCampaign(null)
    setFormData(initialFormState)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (editingCampaign) {
        await update(editingCampaign.id, formData)
      } else {
        await add(formData)
      }
      closeModal()
    } catch (error) {
      console.error('Error saving campaign:', error)
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
      console.error('Error deleting campaign:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Campaigns</h1>
          <p className="page-subtitle">Track your marketing content</p>
        </div>
        {isEditor && (
          <Button onClick={() => openModal()}>
            <Plus className="w-4 h-4" />
            Add Campaign
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
              placeholder="Search campaigns..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[{ value: '', label: 'All Statuses' }, ...CAMPAIGN_STATUSES]}
            className="sm:w-48"
          />
        </Card.Body>
      </Card>

      {/* Campaigns table */}
      <Card>
        <Table>
          <Table.Head>
            <tr>
              <Table.HeaderCell>Content</Table.HeaderCell>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>Owner</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              {isEditor && <Table.HeaderCell className="w-20">Actions</Table.HeaderCell>}
            </tr>
          </Table.Head>
          <Table.Body>
            {loading ? (
              <Table.Loading columns={isEditor ? 5 : 4} />
            ) : filteredCampaigns.length === 0 ? (
              <Table.Empty
                icon={Megaphone}
                title="No campaigns found"
                description={search || filterStatus ? 'Try adjusting your filters' : 'Add your first campaign to get started'}
                action={
                  isEditor && !search && !filterStatus ? (
                    <Button onClick={() => openModal()} size="sm">
                      <Plus className="w-4 h-4" />
                      Add Campaign
                    </Button>
                  ) : null
                }
              />
            ) : (
              filteredCampaigns.map((campaign) => (
                <Table.Row key={campaign.id}>
                  <Table.Cell>
                    <div>
                      <p className="font-medium">{campaign.content}</p>
                      {campaign.details && (
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {campaign.details}
                        </p>
                      )}
                    </div>
                  </Table.Cell>
                  <Table.Cell>{campaign.type}</Table.Cell>
                  <Table.Cell>{campaign.oversight || '-'}</Table.Cell>
                  <Table.Cell>
                    <Badge status={campaign.status}>{campaign.status}</Badge>
                  </Table.Cell>
                  {isEditor && (
                    <Table.Cell>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openModal(campaign)}
                          className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => setDeleteId(campaign.id)}
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
        title={editingCampaign ? 'Edit Campaign' : 'Add Campaign'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Content Title"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="What's the campaign about?"
            required
          />

          <Select
            label="Type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            options={CAMPAIGN_TYPES}
            placeholder="Select type"
            required
          />

          <Textarea
            label="Details"
            value={formData.details}
            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
            placeholder="Campaign details..."
            rows={3}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Owner"
              value={formData.oversight}
              onChange={(e) => setFormData({ ...formData, oversight: e.target.value })}
              options={[{ value: '', label: 'Unassigned' }, ...TEAM_MEMBERS]}
            />
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={CAMPAIGN_STATUSES}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {editingCampaign ? 'Save Changes' : 'Add Campaign'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Campaign"
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
          Are you sure you want to delete this campaign? This action cannot be undone.
        </p>
      </Modal>
    </div>
  )
}
