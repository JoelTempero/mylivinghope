import { useState } from 'react'
import { useCollection } from '../hooks/useCollection'
import { useAuth } from '../hooks/useAuth'
import { Card, Button, Table, Badge, Modal, Input, Select } from '../components/ui'
import { Textarea } from '../components/ui/Input'
import { Plus, CheckSquare, Pencil, Trash2, Search, Check } from 'lucide-react'

const TASK_STATUSES = [
  { value: 'Not Started', label: 'Not Started' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Complete', label: 'Complete' },
]

const URGENCY_LEVELS = [
  { value: 'B - Urgent', label: 'B - Urgent' },
  { value: 'C - Semi Urgent', label: 'C - Semi Urgent' },
  { value: 'D - Non Urgent', label: 'D - Non Urgent' },
  { value: 'A - Complete', label: 'A - Complete' },
]

const TEAM_MEMBERS = [
  { value: 'Joel T', label: 'Joel T' },
  { value: 'Jesse M', label: 'Jesse M' },
  { value: 'Jesse&Joel', label: 'Jesse & Joel' },
]

const initialFormState = {
  title: '',
  details: '',
  assignedTo: '',
  status: 'Not Started',
  urgency: 'D - Non Urgent',
  notes: '',
}

export default function Tasks() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [formData, setFormData] = useState(initialFormState)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const { data: tasks, loading, add, update, remove } = useCollection('tasks', {
    orderByField: 'createdAt',
    orderDirection: 'desc',
  })
  const { isEditor, isAdmin } = useAuth()

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title?.toLowerCase().includes(search.toLowerCase()) ||
      task.details?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = !filterStatus || task.status === filterStatus
    return matchesSearch && matchesStatus
  })

  // Sort by urgency and then status
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const urgencyOrder = { 'B - Urgent': 0, 'C - Semi Urgent': 1, 'D - Non Urgent': 2, 'A - Complete': 3 }
    const statusOrder = { 'In Progress': 0, 'Not Started': 1, 'Complete': 2 }

    if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
      return urgencyOrder[a.urgency] - urgencyOrder[b.urgency]
    }
    return statusOrder[a.status] - statusOrder[b.status]
  })

  const openModal = (task = null) => {
    if (task) {
      setEditingTask(task)
      setFormData({
        title: task.title || '',
        details: task.details || '',
        assignedTo: task.assignedTo?.[0] || '',
        status: task.status || 'Not Started',
        urgency: task.urgency || 'D - Non Urgent',
        notes: task.notes || '',
      })
    } else {
      setEditingTask(null)
      setFormData(initialFormState)
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingTask(null)
    setFormData(initialFormState)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const data = {
        ...formData,
        assignedTo: formData.assignedTo ? [formData.assignedTo] : [],
      }

      if (editingTask) {
        await update(editingTask.id, data)
      } else {
        await add(data)
      }
      closeModal()
    } catch (error) {
      console.error('Error saving task:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleQuickComplete = async (task) => {
    try {
      await update(task.id, {
        status: 'Complete',
        urgency: 'A - Complete',
      })
    } catch (error) {
      console.error('Error completing task:', error)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await remove(deleteId)
      setDeleteId(null)
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Tasks</h1>
          <p className="page-subtitle">Manage your to-do list</p>
        </div>
        {isEditor && (
          <Button onClick={() => openModal()}>
            <Plus className="w-4 h-4" />
            Add Task
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
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[{ value: '', label: 'All Statuses' }, ...TASK_STATUSES]}
            className="sm:w-48"
          />
        </Card.Body>
      </Card>

      {/* Tasks table */}
      <Card>
        <Table>
          <Table.Head>
            <tr>
              <Table.HeaderCell>Task</Table.HeaderCell>
              <Table.HeaderCell>Assigned To</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Urgency</Table.HeaderCell>
              {isEditor && <Table.HeaderCell className="w-28">Actions</Table.HeaderCell>}
            </tr>
          </Table.Head>
          <Table.Body>
            {loading ? (
              <Table.Loading columns={isEditor ? 5 : 4} />
            ) : sortedTasks.length === 0 ? (
              <Table.Empty
                icon={CheckSquare}
                title="No tasks found"
                description={search || filterStatus ? 'Try adjusting your filters' : 'Add your first task to get started'}
                action={
                  isEditor && !search && !filterStatus ? (
                    <Button onClick={() => openModal()} size="sm">
                      <Plus className="w-4 h-4" />
                      Add Task
                    </Button>
                  ) : null
                }
              />
            ) : (
              sortedTasks.map((task) => (
                <Table.Row key={task.id}>
                  <Table.Cell>
                    <div>
                      <p className={`font-medium ${task.status === 'Complete' ? 'line-through text-gray-400' : ''}`}>
                        {task.title}
                      </p>
                      {task.details && (
                        <p className="text-sm text-gray-500 truncate max-w-md">
                          {task.details}
                        </p>
                      )}
                    </div>
                  </Table.Cell>
                  <Table.Cell>{task.assignedTo?.join(', ') || '-'}</Table.Cell>
                  <Table.Cell>
                    <Badge status={task.status}>{task.status}</Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge status={task.urgency}>{task.urgency}</Badge>
                  </Table.Cell>
                  {isEditor && (
                    <Table.Cell>
                      <div className="flex items-center gap-1">
                        {task.status !== 'Complete' && (
                          <button
                            onClick={() => handleQuickComplete(task)}
                            className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded"
                            title="Mark complete"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => openModal(task)}
                          className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => setDeleteId(task.id)}
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
        title={editingTask ? 'Edit Task' : 'Add Task'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Task Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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

          <Select
            label="Assigned To"
            value={formData.assignedTo}
            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
            options={[{ value: '', label: 'Unassigned' }, ...TEAM_MEMBERS]}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={TASK_STATUSES}
            />
            <Select
              label="Urgency"
              value={formData.urgency}
              onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
              options={URGENCY_LEVELS}
            />
          </div>

          <Textarea
            label="Notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Additional notes..."
            rows={2}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {editingTask ? 'Save Changes' : 'Add Task'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Task"
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
          Are you sure you want to delete this task? This action cannot be undone.
        </p>
      </Modal>
    </div>
  )
}
