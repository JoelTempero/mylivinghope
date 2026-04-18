import { useState, useEffect } from 'react'
import { ref, getBytes, uploadString } from 'firebase/storage'
import { storage } from '../lib/firebase'
import { useAuth } from '../hooks/useAuth'
import { Card, Button } from '../components/ui'
import { Bot, Save, Check, RefreshCw, AlertCircle } from 'lucide-react'

const TABS = [
  { key: 'shared', label: 'Shared Context', file: 'shared/MLH-SHARED.md' },
  { key: 'joel', label: "Joel's Notes", file: 'shared/CLAUDE-JOEL.md' },
  { key: 'jesse', label: "Jesse's Notes", file: 'shared/CLAUDE-JESSE.md' },
]

export default function Claude() {
  const { userProfile } = useAuth()
  const [activeTab, setActiveTab] = useState('shared')
  const [contents, setContents] = useState({ shared: '', joel: '', jesse: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState(null)
  const [dirty, setDirty] = useState({})

  useEffect(() => {
    loadAll()
  }, [])

  async function loadAll() {
    setLoading(true)
    setError(null)
    const loaded = {}
    for (const tab of TABS) {
      try {
        const fileRef = ref(storage, tab.file)
        const bytes = await getBytes(fileRef)
        loaded[tab.key] = new TextDecoder().decode(bytes)
      } catch (err) {
        if (err.code === 'storage/object-not-found') {
          loaded[tab.key] = ''
        } else {
          loaded[tab.key] = ''
          console.error(`Error loading ${tab.file}:`, err)
        }
      }
    }
    setContents(loaded)
    setDirty({})
    setLoading(false)
  }

  function handleChange(value) {
    setContents((prev) => ({ ...prev, [activeTab]: value }))
    setDirty((prev) => ({ ...prev, [activeTab]: true }))
    setSaved(false)
  }

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      const tab = TABS.find((t) => t.key === activeTab)
      const fileRef = ref(storage, tab.file)
      await uploadString(fileRef, contents[activeTab], 'raw', { contentType: 'text/markdown' })
      setDirty((prev) => ({ ...prev, [activeTab]: false }))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const activeTabData = TABS.find((t) => t.key === activeTab)
  const isDirty = dirty[activeTab]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Claude Context</h1>
        <p className="page-subtitle">
          Shared context files that Claude Code reads at the start of every session
        </p>
      </div>

      <Card>
        <Card.Body className="p-0">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-dark-border">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                {tab.label}
                {dirty[tab.key] && (
                  <span className="w-2 h-2 bg-amber-400 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-4">
            {loading ? (
              <div className="flex items-center justify-center py-12 text-gray-400">
                <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                Loading context files...
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                    <Bot className="w-4 h-4" />
                    <span>{activeTabData.file}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={loadAll}
                    >
                      <RefreshCw className="w-4 h-4" />
                      Reload
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      loading={saving}
                      disabled={!isDirty}
                    >
                      {saved ? (
                        <>
                          <Check className="w-4 h-4" />
                          Saved!
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <textarea
                  value={contents[activeTab]}
                  onChange={(e) => handleChange(e.target.value)}
                  className="w-full h-[60vh] px-4 py-3 font-mono text-sm bg-gray-50 dark:bg-dark-surface-2 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-dark-border rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  placeholder={`No content yet. Add context for Claude Code sessions here...`}
                  spellCheck={false}
                />
              </>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}
