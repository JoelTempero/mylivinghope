import { useState } from 'react'
import { useCollection } from '../hooks/useCollection'
import { useAuth } from '../hooks/useAuth'
import { Card, Button, Table, Modal, Input, Select } from '../components/ui'
import { Textarea } from '../components/ui/Input'
import { Plus, Users, Pencil, Trash2, Search, Mail, Copy, Check } from 'lucide-react'

const CONTACT_CATEGORIES = [
  { value: 'Church', label: 'Church' },
  { value: 'Partner', label: 'Partner' },
  { value: 'Supplier', label: 'Supplier' },
  { value: 'Artist', label: 'Artist' },
  { value: 'Customer', label: 'Customer' },
  { value: 'Other', label: 'Other' },
]

const initialFormState = {
  email: '',
  organization: '',
  category: 'Church',
  notes: '',
}

export default function Contacts() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingContact, setEditingContact] = useState(null)
  const [formData, setFormData] = useState(initialFormState)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [copied, setCopied] = useState(false)

  const { data: contacts, loading, add, update, remove } = useCollection('contacts')
  const { isEditor, isAdmin } = useAuth()

  // Filter contacts
  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.email?.toLowerCase().includes(search.toLowerCase()) ||
      contact.organization?.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !filterCategory || contact.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const openModal = (contact = null) => {
    if (contact) {
      setEditingContact(contact)
      setFormData({
        email: contact.email || '',
        organization: contact.organization || '',
        category: contact.category || 'Church',
        notes: contact.notes || '',
      })
    } else {
      setEditingContact(null)
      setFormData(initialFormState)
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingContact(null)
    setFormData(initialFormState)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (editingContact) {
        await update(editingContact.id, formData)
      } else {
        await add(formData)
      }
      closeModal()
    } catch (error) {
      console.error('Error saving contact:', error)
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
      console.error('Error deleting contact:', error)
    }
  }

  const copyAllEmails = () => {
    const emails = filteredContacts.map((c) => c.email).join(', ')
    navigator.clipboard.writeText(emails)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Contacts</h1>
          <p className="page-subtitle">Manage your contact list</p>
        </div>
        <div className="flex gap-2">
          {filteredContacts.length > 0 && (
            <Button variant="outline" onClick={copyAllEmails}>
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Emails'}
            </Button>
          )}
          {isEditor && (
            <Button onClick={() => openModal()}>
              <Plus className="w-4 h-4" />
              Add Contact
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <Card.Body className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <Select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            options={[{ value: '', label: 'All Categories' }, ...CONTACT_CATEGORIES]}
            className="sm:w-48"
          />
        </Card.Body>
      </Card>

      {/* Stats */}
      <div className="text-sm text-gray-500">
        Showing {filteredContacts.length} of {contacts.length} contacts
      </div>

      {/* Contacts table */}
      <Card>
        <Table>
          <Table.Head>
            <tr>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Organization</Table.HeaderCell>
              <Table.HeaderCell>Category</Table.HeaderCell>
              <Table.HeaderCell>Notes</Table.HeaderCell>
              {isEditor && <Table.HeaderCell className="w-20">Actions</Table.HeaderCell>}
            </tr>
          </Table.Head>
          <Table.Body>
            {loading ? (
              <Table.Loading columns={isEditor ? 5 : 4} />
            ) : filteredContacts.length === 0 ? (
              <Table.Empty
                icon={Users}
                title="No contacts found"
                description={search || filterCategory ? 'Try adjusting your filters' : 'Add your first contact to get started'}
                action={
                  isEditor && !search && !filterCategory ? (
                    <Button onClick={() => openModal()} size="sm">
                      <Plus className="w-4 h-4" />
                      Add Contact
                    </Button>
                  ) : null
                }
              />
            ) : (
              filteredContacts.map((contact) => (
                <Table.Row key={contact.id}>
                  <Table.Cell>
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-primary-600 hover:text-primary-700 flex items-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      {contact.email}
                    </a>
                  </Table.Cell>
                  <Table.Cell>{contact.organization || '-'}</Table.Cell>
                  <Table.Cell>{contact.category}</Table.Cell>
                  <Table.Cell>
                    <span className="text-gray-500 truncate max-w-xs block">
                      {contact.notes || '-'}
                    </span>
                  </Table.Cell>
                  {isEditor && (
                    <Table.Cell>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openModal(contact)}
                          className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => setDeleteId(contact.id)}
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
        title={editingContact ? 'Edit Contact' : 'Add Contact'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="email@example.com"
            required
          />

          <Input
            label="Organization"
            value={formData.organization}
            onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
            placeholder="Church or organization name"
          />

          <Select
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={CONTACT_CATEGORIES}
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
              {editingContact ? 'Save Changes' : 'Add Contact'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Contact"
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
          Are you sure you want to delete this contact? This action cannot be undone.
        </p>
      </Modal>
    </div>
  )
}
