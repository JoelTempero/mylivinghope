import { useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'
import { httpsCallable } from 'firebase/functions'
import { db, auth, functions } from '../lib/firebase'
import { useAuth } from '../hooks/useAuth'
import { Card, Button, Input } from '../components/ui'
import { getInitials } from '../lib/utils'
import { User, Lock, Bell, Palette, Save, Check, RefreshCw } from 'lucide-react'

export default function Settings() {
  const { user, userProfile, refreshProfile } = useAuth()

  // Profile state
  const [displayName, setDisplayName] = useState(userProfile?.displayName || '')
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)

  // Password state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  // Context sync state
  const [syncing, setSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState(null)

  const handleSyncContext = async () => {
    setSyncing(true)
    setSyncResult(null)
    try {
      const generateContext = httpsCallable(functions, 'generateContext')
      const result = await generateContext()
      setSyncResult({ success: true, message: 'Context synced successfully' })
    } catch (err) {
      setSyncResult({ success: false, message: err.message })
    } finally {
      setSyncing(false)
    }
  }

  const handleSaveProfile = async () => {
    setSavingProfile(true)
    setProfileSaved(false)

    try {
      // Update Firebase Auth profile
      await updateProfile(auth.currentUser, { displayName })

      // Update Firestore user document
      await updateDoc(doc(db, 'users', user.uid), { displayName })

      // Refresh profile in context
      await refreshProfile()

      setProfileSaved(true)
      setTimeout(() => setProfileSaved(false), 3000)
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setSavingProfile(false)
    }
  }

  const handleChangePassword = async () => {
    setPasswordError('')
    setPasswordSuccess(false)

    // Validation
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match')
      return
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters')
      return
    }

    setSavingPassword(true)

    try {
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(user.email, currentPassword)
      await reauthenticateWithCredential(auth.currentUser, credential)

      // Update password
      await updatePassword(auth.currentUser, newPassword)

      // Clear form
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setPasswordSuccess(true)
      setTimeout(() => setPasswordSuccess(false), 3000)
    } catch (error) {
      console.error('Error changing password:', error)
      if (error.code === 'auth/wrong-password') {
        setPasswordError('Current password is incorrect')
      } else {
        setPasswordError('Failed to change password. Please try again.')
      }
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account settings</p>
      </div>

      {/* Profile Section */}
      <Card>
        <Card.Header>
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-gray-500" />
            <Card.Title>Profile</Card.Title>
          </div>
        </Card.Header>
        <Card.Body className="space-y-4">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-xl font-medium text-primary-700">
                {getInitials(displayName || userProfile?.displayName)}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{userProfile?.displayName}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <p className="text-xs text-gray-400 capitalize">Role: {userProfile?.role}</p>
            </div>
          </div>

          {/* Display name */}
          <Input
            label="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your name"
          />

          {/* Email (read-only) */}
          <Input
            label="Email"
            value={user?.email || ''}
            disabled
            hint="Contact an admin to change your email"
          />

          <div className="flex justify-end">
            <Button onClick={handleSaveProfile} loading={savingProfile}>
              {profileSaved ? (
                <>
                  <Check className="w-4 h-4" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Profile
                </>
              )}
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Password Section */}
      <Card>
        <Card.Header>
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-gray-500" />
            <Card.Title>Change Password</Card.Title>
          </div>
        </Card.Header>
        <Card.Body className="space-y-4">
          {passwordError && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
              {passwordError}
            </div>
          )}

          {passwordSuccess && (
            <div className="bg-green-50 text-green-600 px-4 py-3 rounded-lg text-sm">
              Password changed successfully!
            </div>
          )}

          <Input
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
          />

          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
          />

          <Input
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
          />

          <div className="flex justify-end">
            <Button
              onClick={handleChangePassword}
              loading={savingPassword}
              disabled={!currentPassword || !newPassword || !confirmPassword}
            >
              <Lock className="w-4 h-4" />
              Change Password
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* AI Context Sync */}
      {userProfile?.role === 'admin' && (
        <Card>
          <Card.Header>
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-gray-500" />
              <Card.Title>AI Context Sync</Card.Title>
            </div>
          </Card.Header>
          <Card.Body className="space-y-4">
            <p className="text-sm text-gray-500">
              Update the shared context file with the latest business data.
              Run this before starting a Claude Code session for the freshest data.
            </p>
            <div className="flex items-center gap-4">
              <Button onClick={handleSyncContext} loading={syncing}>
                <RefreshCw className="w-4 h-4" />
                Sync Context
              </Button>
              {syncResult && (
                <span className={syncResult.success ? 'text-green-600 text-sm' : 'text-red-600 text-sm'}>
                  {syncResult.message}
                </span>
              )}
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Preferences Section */}
      <Card>
        <Card.Header>
          <div className="flex items-center gap-3">
            <Palette className="w-5 h-5 text-gray-500" />
            <Card.Title>Preferences</Card.Title>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900">Dark Mode</p>
              <p className="text-sm text-gray-500">Use dark theme (coming soon)</p>
            </div>
            <button
              disabled
              className="w-12 h-6 bg-gray-200 rounded-full relative cursor-not-allowed opacity-50"
            >
              <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 shadow" />
            </button>
          </div>

          <div className="flex items-center justify-between py-3 border-t border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-500">Receive email updates (coming soon)</p>
            </div>
            <button
              disabled
              className="w-12 h-6 bg-gray-200 rounded-full relative cursor-not-allowed opacity-50"
            >
              <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 shadow" />
            </button>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}
