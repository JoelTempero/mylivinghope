import { useState, useEffect } from 'react'
import { collection, getDocs, doc, updateDoc, deleteDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { db, secondaryAuth } from '../lib/firebase'
import { useAuth } from '../hooks/useAuth'
import { Card, Button, Table, Badge, Modal, Select } from '../components/ui'
import Input from '../components/ui/Input'
import { formatDate, getInitials } from '../lib/utils'
import { UserCog, Shield, Pencil, Trash2, Mail, Crown, UserPlus } from 'lucide-react'

const ROLES = [
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
]

export default function TeamManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState(null)
  const [newRole, setNewRole] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleteUserId, setDeleteUserId] = useState(null)

  // Create user state
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createForm, setCreateForm] = useState({
    displayName: '',
    email: '',
    password: '',
    role: 'viewer',
  })
  const [createError, setCreateError] = useState(null)
  const [creating, setCreating] = useState(false)

  const { user: currentUser, isAdmin } = useAuth()

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'))
        const usersData = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setUsers(usersData)
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const openEditModal = (user) => {
    setEditingUser(user)
    setNewRole(user.role)
  }

  const closeEditModal = () => {
    setEditingUser(null)
    setNewRole('')
  }

  const handleUpdateRole = async () => {
    if (!editingUser || !newRole) return
    setSaving(true)

    try {
      await updateDoc(doc(db, 'users', editingUser.id), { role: newRole })
      setUsers(
        users.map((u) => (u.id === editingUser.id ? { ...u, role: newRole } : u))
      )
      closeEditModal()
    } catch (error) {
      console.error('Error updating role:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteUser = async () => {
    if (!deleteUserId) return

    try {
      await deleteDoc(doc(db, 'users', deleteUserId))
      setUsers(users.filter((u) => u.id !== deleteUserId))
      setDeleteUserId(null)
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  // Create new user
  const resetCreateForm = () => {
    setCreateForm({ displayName: '', email: '', password: '', role: 'viewer' })
    setCreateError(null)
    setShowCreateModal(false)
  }

  const handleCreateUser = async (e) => {
    e.preventDefault()
    setCreateError(null)

    const { displayName, email, password, role } = createForm

    // Validation
    if (!displayName.trim()) {
      setCreateError('Name is required')
      return
    }
    if (!email.trim()) {
      setCreateError('Email is required')
      return
    }
    if (password.length < 6) {
      setCreateError('Password must be at least 6 characters')
      return
    }

    setCreating(true)

    try {
      // Create user with secondary auth (won't sign out current admin)
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        email,
        password
      )

      // Update the user's display name
      await updateProfile(userCredential.user, { displayName })

      // Create user document in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        displayName,
        role,
        createdAt: serverTimestamp(),
        lastLogin: null,
      })

      // Sign out from secondary auth
      await secondaryAuth.signOut()

      // Add new user to local state
      setUsers([
        ...users,
        {
          id: userCredential.user.uid,
          email,
          displayName,
          role,
          createdAt: new Date(),
          lastLogin: null,
        },
      ])

      resetCreateForm()
    } catch (error) {
      console.error('Error creating user:', error)
      console.error('Error code:', error.code)
      console.error('Error message:', error.message)

      const errorCode = error.code || ''
      const errorMessage = error.message || ''

      if (errorCode === 'auth/email-already-in-use' || errorMessage.includes('EMAIL_EXISTS')) {
        setCreateError('This email is already registered in Firebase Auth')
      } else if (errorCode === 'auth/invalid-email' || errorMessage.includes('INVALID_EMAIL')) {
        setCreateError('Invalid email address')
      } else if (errorCode === 'auth/weak-password' || errorMessage.includes('WEAK_PASSWORD')) {
        setCreateError('Password is too weak - needs at least 6 characters')
      } else if (errorCode === 'auth/operation-not-allowed') {
        setCreateError('Email/password accounts are not enabled. Please enable in Firebase Console.')
      } else {
        setCreateError(`Failed to create user: ${errorMessage || error.code || 'Unknown error'}`)
      }
    } finally {
      setCreating(false)
    }
  }

  const getRoleBadge = (role) => {
    const variants = {
      admin: 'bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300',
      editor: 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300',
      viewer: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300',
    }
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full ${variants[role] || variants.viewer}`}>
        {role === 'admin' && <Crown className="w-3 h-3" />}
        {role === 'editor' && <Pencil className="w-3 h-3" />}
        {role === 'viewer' && <Shield className="w-3 h-3" />}
        {role?.charAt(0).toUpperCase() + role?.slice(1)}
      </span>
    )
  }

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <Shield className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">Access Denied</h2>
        <p className="text-gray-500 dark:text-gray-400">Only administrators can access team management.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="page-title">Team Management</h1>
        <p className="page-subtitle">Manage team members and their roles</p>
      </div>

      {/* Role explanation */}
      <Card>
        <Card.Body>
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Role Permissions</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="font-medium text-purple-900 dark:text-purple-300">Admin</span>
              </div>
              <p className="text-sm text-purple-700 dark:text-purple-400">
                Full access. Can manage users, delete content, and access all features.
              </p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Pencil className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="font-medium text-blue-900 dark:text-blue-300">Editor</span>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Can create and edit content. Cannot delete or manage users.
              </p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="font-medium text-gray-900 dark:text-gray-200">Viewer</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-400">
                Read-only access. Can view all content but cannot make changes.
              </p>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Users table */}
      <Card>
        <Card.Header className="flex items-center justify-between">
          <Card.Title>Team Members</Card.Title>
          <Button onClick={() => setShowCreateModal(true)}>
            <UserPlus className="w-4 h-4" />
            Add User
          </Button>
        </Card.Header>
        <Table>
          <Table.Head>
            <tr>
              <Table.HeaderCell>User</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Role</Table.HeaderCell>
              <Table.HeaderCell>Last Login</Table.HeaderCell>
              <Table.HeaderCell className="w-20">Actions</Table.HeaderCell>
            </tr>
          </Table.Head>
          <Table.Body>
            {loading ? (
              <Table.Loading columns={5} />
            ) : users.length === 0 ? (
              <Table.Empty
                icon={UserCog}
                title="No users found"
                description="Users will appear here when they sign up"
              />
            ) : (
              users.map((user) => (
                <Table.Row key={user.id}>
                  <Table.Cell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/40 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                          {getInitials(user.displayName)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {user.displayName}
                          {user.id === currentUser?.uid && (
                            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">(You)</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <a
                      href={`mailto:${user.email}`}
                      className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1"
                    >
                      <Mail className="w-4 h-4" />
                      {user.email}
                    </a>
                  </Table.Cell>
                  <Table.Cell>{getRoleBadge(user.role)}</Table.Cell>
                  <Table.Cell>
                    {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(user)}
                        className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-surface-2 rounded"
                        disabled={user.id === currentUser?.uid}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      {user.id !== currentUser?.uid && (
                        <button
                          onClick={() => setDeleteUserId(user.id)}
                          className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table>
      </Card>

      {/* Edit role modal */}
      <Modal
        isOpen={!!editingUser}
        onClose={closeEditModal}
        title="Edit User Role"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={closeEditModal}>
              Cancel
            </Button>
            <Button onClick={handleUpdateRole} loading={saving}>
              Save Changes
            </Button>
          </>
        }
      >
        {editingUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-dark-surface-2 rounded-lg">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/40 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                  {getInitials(editingUser.displayName)}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{editingUser.displayName}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{editingUser.email}</p>
              </div>
            </div>

            <Select
              label="Role"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              options={ROLES}
            />
          </div>
        )}
      </Modal>

      {/* Delete confirmation */}
      <Modal
        isOpen={!!deleteUserId}
        onClose={() => setDeleteUserId(null)}
        title="Remove Team Member"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteUserId(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteUser}>
              Remove
            </Button>
          </>
        }
      >
        <p className="text-gray-600 dark:text-gray-400">
          Are you sure you want to remove this user from the team? They will lose access to the portal.
        </p>
      </Modal>

      {/* Create user modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={resetCreateForm}
        title="Add Team Member"
        description="Create a new user account for your team"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={resetCreateForm} disabled={creating}>
              Cancel
            </Button>
            <Button onClick={handleCreateUser} loading={creating}>
              Create User
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          {createError && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              {createError}
            </div>
          )}

          <Input
            label="Full Name"
            value={createForm.displayName}
            onChange={(e) => setCreateForm({ ...createForm, displayName: e.target.value })}
            placeholder="John Smith"
            required
          />

          <Input
            label="Email Address"
            type="email"
            value={createForm.email}
            onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
            placeholder="john@example.com"
            required
          />

          <Input
            label="Password"
            type="password"
            value={createForm.password}
            onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
            placeholder="At least 6 characters"
            hint="The user can change this after logging in"
            required
          />

          <Select
            label="Role"
            value={createForm.role}
            onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
            options={ROLES}
          />
        </form>
      </Modal>
    </div>
  )
}
