import { useState, useMemo } from 'react'
import { useCollection } from '../hooks/useCollection'
import { useAuth } from '../hooks/useAuth'
import { Card, Button, Table, Badge, Modal, Input, Select } from '../components/ui'
import { Textarea } from '../components/ui/Input'
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  BookOpen,
  Download,
  Layers,
  Tag,
  ChevronDown,
  ChevronRight,
  LayoutGrid,
  X,
  Upload,
  AlertCircle,
} from 'lucide-react'

const initialSetFormState = {
  title: '',
  tags: '',
}

const initialCardFormState = {
  name: '',
  tag: '',
  description: '',
  prayerPrompt1: '',
  prayerPrompt2: '',
  prayerPrompt3: '',
  prayerPrompt4: '',
  scriptureRefs: '',
}

export default function CardDesign() {
  // Card Sets state
  const [isSetModalOpen, setIsSetModalOpen] = useState(false)
  const [editingSet, setEditingSet] = useState(null)
  const [setFormData, setSetFormData] = useState(initialSetFormState)
  const [savingSet, setSavingSet] = useState(false)
  const [deleteSetId, setDeleteSetId] = useState(null)
  const [expandedSetId, setExpandedSetId] = useState(null)

  // Cards state
  const [isCardModalOpen, setIsCardModalOpen] = useState(false)
  const [editingCard, setEditingCard] = useState(null)
  const [cardFormData, setCardFormData] = useState(initialCardFormState)
  const [savingCard, setSavingCard] = useState(false)
  const [deleteCardId, setDeleteCardId] = useState(null)
  const [activeSetId, setActiveSetId] = useState(null)

  // Search and filter
  const [search, setSearch] = useState('')
  const [filterTag, setFilterTag] = useState('')

  // Migration state
  const [migrating, setMigrating] = useState(false)
  const [migrationDismissed, setMigrationDismissed] = useState(false)

  // Collections
  const { data: cardSets, loading: loadingSets, add: addSet, update: updateSet, remove: removeSet } = useCollection('cardSets')
  const { data: cards, loading: loadingCards, add: addCard, update: updateCard, remove: removeCard } = useCollection('cards')
  const { data: legacyEmotions, loading: loadingLegacy } = useCollection('emotions')
  const { isEditor, isAdmin } = useAuth()

  // Check if there's legacy data to migrate
  const hasLegacyData = legacyEmotions.length > 0 && !migrationDismissed

  // Migration function
  const handleMigration = async () => {
    if (legacyEmotions.length === 0) return
    setMigrating(true)

    try {
      // Create the card set
      const setId = await addSet({
        title: 'Emotions & Desires',
        tags: ['emotion', 'desire'],
      })

      // Migrate each emotion to a card
      for (const emotion of legacyEmotions) {
        await addCard({
          setId,
          name: emotion.name || '',
          tag: emotion.type || 'emotion',
          description: '',
          prayerPrompt1: emotion.prayerPrompt1 || '',
          prayerPrompt2: emotion.prayerPrompt2 || '',
          prayerPrompt3: '',
          prayerPrompt4: '',
          scriptureRefs: emotion.verses || [],
        })
      }

      // Expand the newly created set
      setExpandedSetId(setId)
      setMigrationDismissed(true)
    } catch (error) {
      console.error('Migration error:', error)
      alert('Migration failed. Please try again.')
    } finally {
      setMigrating(false)
    }
  }

  // Get all unique tags across all sets
  const allTags = useMemo(() => {
    const tags = new Set()
    cardSets.forEach((set) => {
      set.tags?.forEach((tag) => tags.add(tag))
    })
    return Array.from(tags).sort()
  }, [cardSets])

  // Filter cards by search and tag
  const getFilteredCards = (setId) => {
    return cards.filter((card) => {
      const matchesSet = card.setId === setId
      const matchesSearch = !search || card.name?.toLowerCase().includes(search.toLowerCase())
      const matchesTag = !filterTag || card.tag === filterTag
      return matchesSet && matchesSearch && matchesTag
    })
  }

  // Card Set Modal handlers
  const openSetModal = (set = null) => {
    if (set) {
      setEditingSet(set)
      setSetFormData({
        title: set.title || '',
        tags: set.tags?.join(', ') || '',
      })
    } else {
      setEditingSet(null)
      setSetFormData(initialSetFormState)
    }
    setIsSetModalOpen(true)
  }

  const closeSetModal = () => {
    setIsSetModalOpen(false)
    setEditingSet(null)
    setSetFormData(initialSetFormState)
  }

  const handleSetSubmit = async (e) => {
    e.preventDefault()
    setSavingSet(true)

    try {
      const data = {
        title: setFormData.title,
        tags: setFormData.tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean),
      }

      if (editingSet) {
        await updateSet(editingSet.id, data)
      } else {
        await addSet(data)
      }
      closeSetModal()
    } catch (error) {
      console.error('Error saving card set:', error)
    } finally {
      setSavingSet(false)
    }
  }

  const handleDeleteSet = async () => {
    if (!deleteSetId) return
    try {
      // Delete all cards in the set first
      const setCards = cards.filter((c) => c.setId === deleteSetId)
      for (const card of setCards) {
        await removeCard(card.id)
      }
      await removeSet(deleteSetId)
      setDeleteSetId(null)
      if (expandedSetId === deleteSetId) {
        setExpandedSetId(null)
      }
    } catch (error) {
      console.error('Error deleting card set:', error)
    }
  }

  // Card Modal handlers
  const openCardModal = (setId, card = null) => {
    setActiveSetId(setId)
    const set = cardSets.find((s) => s.id === setId)

    if (card) {
      setEditingCard(card)
      setCardFormData({
        name: card.name || '',
        tag: card.tag || '',
        description: card.description || '',
        prayerPrompt1: card.prayerPrompt1 || '',
        prayerPrompt2: card.prayerPrompt2 || '',
        prayerPrompt3: card.prayerPrompt3 || '',
        prayerPrompt4: card.prayerPrompt4 || '',
        scriptureRefs: card.scriptureRefs?.join(', ') || '',
      })
    } else {
      setEditingCard(null)
      setCardFormData({
        ...initialCardFormState,
        tag: set?.tags?.[0] || '',
      })
    }
    setIsCardModalOpen(true)
  }

  const closeCardModal = () => {
    setIsCardModalOpen(false)
    setEditingCard(null)
    setCardFormData(initialCardFormState)
    setActiveSetId(null)
  }

  const handleCardSubmit = async (e) => {
    e.preventDefault()
    setSavingCard(true)

    try {
      const data = {
        setId: activeSetId,
        name: cardFormData.name,
        tag: cardFormData.tag,
        description: cardFormData.description,
        prayerPrompt1: cardFormData.prayerPrompt1,
        prayerPrompt2: cardFormData.prayerPrompt2,
        prayerPrompt3: cardFormData.prayerPrompt3,
        prayerPrompt4: cardFormData.prayerPrompt4,
        scriptureRefs: cardFormData.scriptureRefs.split(',').map((r) => r.trim()).filter(Boolean),
      }

      if (editingCard) {
        await updateCard(editingCard.id, data)
      } else {
        await addCard(data)
      }
      closeCardModal()
    } catch (error) {
      console.error('Error saving card:', error)
    } finally {
      setSavingCard(false)
    }
  }

  const handleDeleteCard = async () => {
    if (!deleteCardId) return
    try {
      await removeCard(deleteCardId)
      setDeleteCardId(null)
    } catch (error) {
      console.error('Error deleting card:', error)
    }
  }

  // CSV Download
  const downloadCSV = (set) => {
    const setCards = cards.filter((c) => c.setId === set.id)

    if (setCards.length === 0) {
      alert('No cards to download in this set.')
      return
    }

    const headers = [
      'Name',
      'Tag',
      'Description',
      'Prayer Prompt 1',
      'Prayer Prompt 2',
      'Prayer Prompt 3',
      'Prayer Prompt 4',
      'Scripture References',
    ]

    const escapeCSV = (str) => {
      if (!str) return ''
      const escaped = str.replace(/"/g, '""')
      return escaped.includes(',') || escaped.includes('"') || escaped.includes('\n')
        ? `"${escaped}"`
        : escaped
    }

    const rows = setCards.map((card) => [
      escapeCSV(card.name),
      escapeCSV(card.tag),
      escapeCSV(card.description),
      escapeCSV(card.prayerPrompt1),
      escapeCSV(card.prayerPrompt2),
      escapeCSV(card.prayerPrompt3),
      escapeCSV(card.prayerPrompt4),
      escapeCSV(card.scriptureRefs?.join('; ')),
    ])

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${set.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_cards.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Get tag color based on index
  const getTagColor = (tag, setTags) => {
    const colors = [
      'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
      'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300',
      'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
      'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
      'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
      'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300',
    ]
    const index = setTags?.indexOf(tag) ?? 0
    return colors[index % colors.length]
  }

  const loading = loadingSets || loadingCards || loadingLegacy

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Card Design</h1>
          <p className="page-subtitle">Create and manage prayer card content sets</p>
        </div>
        {isEditor && (
          <Button onClick={() => openSetModal()}>
            <Plus className="w-4 h-4" />
            New Card Set
          </Button>
        )}
      </div>

      {/* Search & Filter */}
      <Card>
        <Card.Body className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search cards..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <Select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            options={[{ value: '', label: 'All Tags' }, ...allTags.map((t) => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) }))]}
            className="sm:w-48"
          />
        </Card.Body>
      </Card>

      {/* Migration Banner */}
      {hasLegacyData && isEditor && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-amber-800 dark:text-amber-200">
                Legacy Data Available
              </h3>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                Found {legacyEmotions.length} entries in the old Emotions & Desires format.
                Would you like to import them into a new card set?
              </p>
              <div className="flex gap-3 mt-3">
                <Button
                  size="sm"
                  onClick={handleMigration}
                  loading={migrating}
                >
                  <Upload className="w-4 h-4" />
                  Import Data
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setMigrationDismissed(true)}
                  disabled={migrating}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Card Sets */}
      {loading ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">Loading...</div>
      ) : cardSets.length === 0 ? (
        <Card>
          <Card.Body className="text-center py-12">
            <Layers className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No card sets yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Create your first card set to start designing prayer cards
            </p>
            {isEditor && (
              <Button onClick={() => openSetModal()} size="sm">
                <Plus className="w-4 h-4" />
                New Card Set
              </Button>
            )}
          </Card.Body>
        </Card>
      ) : (
        <div className="space-y-4">
          {cardSets.map((set) => {
            const setCards = getFilteredCards(set.id)
            const isExpanded = expandedSetId === set.id
            const cardsByTag = {}
            setCards.forEach((card) => {
              if (!cardsByTag[card.tag]) cardsByTag[card.tag] = []
              cardsByTag[card.tag].push(card)
            })

            return (
              <Card key={set.id} className="overflow-hidden">
                {/* Set Header */}
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-surface-2 transition-colors"
                  onClick={() => setExpandedSetId(isExpanded ? null : set.id)}
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/40 rounded-lg flex items-center justify-center">
                      <LayoutGrid className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{set.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {set.tags?.map((tag) => (
                          <span
                            key={tag}
                            className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${getTagColor(tag, set.tags)}`}
                          >
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {cards.filter((c) => c.setId === set.id).length} cards
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadCSV(set)}
                      title="Download as CSV"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </Button>
                    {isEditor && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openCardModal(set.id)}
                        >
                          <Plus className="w-4 h-4" />
                          Add Card
                        </Button>
                        <button
                          onClick={() => openSetModal(set)}
                          className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-surface-2 rounded-lg"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    {isAdmin && (
                      <button
                        onClick={() => setDeleteSetId(set.id)}
                        className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded Cards */}
                {isExpanded && (
                  <div className="border-t border-gray-200 dark:border-dark-border">
                    {setCards.length === 0 ? (
                      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                        <p>No cards in this set{search || filterTag ? ' matching your filters' : ''}.</p>
                        {isEditor && !search && !filterTag && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-3"
                            onClick={() => openCardModal(set.id)}
                          >
                            <Plus className="w-4 h-4" />
                            Add First Card
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="p-4">
                        {set.tags?.map((tag) => {
                          const tagCards = cardsByTag[tag] || []
                          if (tagCards.length === 0) return null

                          return (
                            <div key={tag} className="mb-6 last:mb-0">
                              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                                <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${getTagColor(tag, set.tags)}`}>
                                  {tag}
                                </span>
                                <span className="text-gray-400 dark:text-gray-500 font-normal">
                                  ({tagCards.length})
                                </span>
                              </h4>
                              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {tagCards.map((card) => (
                                  <CardItem
                                    key={card.id}
                                    card={card}
                                    setTags={set.tags}
                                    onEdit={() => openCardModal(set.id, card)}
                                    onDelete={() => setDeleteCardId(card.id)}
                                    isEditor={isEditor}
                                    isAdmin={isAdmin}
                                    getTagColor={getTagColor}
                                  />
                                ))}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}

      {/* Card Set Modal */}
      <Modal
        isOpen={isSetModalOpen}
        onClose={closeSetModal}
        title={editingSet ? 'Edit Card Set' : 'New Card Set'}
        size="md"
      >
        <form onSubmit={handleSetSubmit} className="space-y-4">
          <Input
            label="Set Title"
            value={setFormData.title}
            onChange={(e) => setSetFormData({ ...setFormData, title: e.target.value })}
            placeholder="e.g., Emotions & Desires, Gratitude Cards"
            required
          />

          <Input
            label="Tags"
            value={setFormData.tags}
            onChange={(e) => setSetFormData({ ...setFormData, tags: e.target.value })}
            placeholder="e.g., emotions, desires, gratitude"
            hint="Separate multiple tags with commas. Cards will be grouped by these tags."
            required
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={closeSetModal}>
              Cancel
            </Button>
            <Button type="submit" loading={savingSet}>
              {editingSet ? 'Save Changes' : 'Create Set'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Card Modal */}
      <Modal
        isOpen={isCardModalOpen}
        onClose={closeCardModal}
        title={editingCard ? 'Edit Card' : 'Add Card'}
        size="lg"
      >
        <form onSubmit={handleCardSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Card Name"
              value={cardFormData.name}
              onChange={(e) => setCardFormData({ ...cardFormData, name: e.target.value })}
              placeholder="e.g., Anxious, Friendship, Peace"
              required
            />
            <Select
              label="Tag"
              value={cardFormData.tag}
              onChange={(e) => setCardFormData({ ...cardFormData, tag: e.target.value })}
              options={cardSets.find((s) => s.id === activeSetId)?.tags?.map((t) => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) })) || []}
              required
            />
          </div>

          <Textarea
            label="Description"
            value={cardFormData.description}
            onChange={(e) => setCardFormData({ ...cardFormData, description: e.target.value })}
            placeholder="A brief description of this card..."
            rows={2}
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <Textarea
              label="Prayer Prompt 1"
              value={cardFormData.prayerPrompt1}
              onChange={(e) => setCardFormData({ ...cardFormData, prayerPrompt1: e.target.value })}
              placeholder="First prayer prompt..."
              rows={2}
            />
            <Textarea
              label="Prayer Prompt 2"
              value={cardFormData.prayerPrompt2}
              onChange={(e) => setCardFormData({ ...cardFormData, prayerPrompt2: e.target.value })}
              placeholder="Second prayer prompt..."
              rows={2}
            />
            <Textarea
              label="Prayer Prompt 3"
              value={cardFormData.prayerPrompt3}
              onChange={(e) => setCardFormData({ ...cardFormData, prayerPrompt3: e.target.value })}
              placeholder="Third prayer prompt..."
              rows={2}
            />
            <Textarea
              label="Prayer Prompt 4"
              value={cardFormData.prayerPrompt4}
              onChange={(e) => setCardFormData({ ...cardFormData, prayerPrompt4: e.target.value })}
              placeholder="Fourth prayer prompt..."
              rows={2}
            />
          </div>

          <Input
            label="Scripture References"
            value={cardFormData.scriptureRefs}
            onChange={(e) => setCardFormData({ ...cardFormData, scriptureRefs: e.target.value })}
            placeholder="e.g., Psalm 23:1, John 3:16, Romans 8:28"
            hint="Separate multiple references with commas"
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={closeCardModal}>
              Cancel
            </Button>
            <Button type="submit" loading={savingCard}>
              {editingCard ? 'Save Changes' : 'Add Card'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Set Confirmation */}
      <Modal
        isOpen={!!deleteSetId}
        onClose={() => setDeleteSetId(null)}
        title="Delete Card Set"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteSetId(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteSet}>
              Delete Set
            </Button>
          </>
        }
      >
        <p className="text-gray-600 dark:text-gray-400">
          Are you sure you want to delete this card set? This will also delete all cards within it. This action cannot be undone.
        </p>
      </Modal>

      {/* Delete Card Confirmation */}
      <Modal
        isOpen={!!deleteCardId}
        onClose={() => setDeleteCardId(null)}
        title="Delete Card"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteCardId(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteCard}>
              Delete Card
            </Button>
          </>
        }
      >
        <p className="text-gray-600 dark:text-gray-400">
          Are you sure you want to delete this card? This action cannot be undone.
        </p>
      </Modal>
    </div>
  )
}

// Card Item Component
function CardItem({ card, setTags, onEdit, onDelete, isEditor, isAdmin, getTagColor }) {
  const [expanded, setExpanded] = useState(false)

  const filledPrompts = [card.prayerPrompt1, card.prayerPrompt2, card.prayerPrompt3, card.prayerPrompt4].filter(Boolean)

  return (
    <div
      className="p-4 border border-gray-200 dark:border-dark-border rounded-lg hover:border-primary-300 dark:hover:border-primary-700 transition-colors cursor-pointer bg-white dark:bg-dark-surface"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">{card.name}</h4>
          {card.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{card.description}</p>
          )}
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
            {filledPrompts.length > 0 && (
              <span>{filledPrompts.length} prompt{filledPrompts.length > 1 ? 's' : ''}</span>
            )}
            {card.scriptureRefs?.length > 0 && (
              <span className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                {card.scriptureRefs.length}
              </span>
            )}
          </div>
        </div>
        {isEditor && (
          <div className="flex items-center gap-1 ml-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={onEdit}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-surface-2 rounded"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            {isAdmin && (
              <button
                onClick={onDelete}
                className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-dark-border space-y-3">
          {filledPrompts.map((prompt, i) => (
            <div key={i}>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">
                Prayer Prompt {i + 1}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{prompt}"</p>
            </div>
          ))}
          {card.scriptureRefs?.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1 flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                Scripture References
              </p>
              <div className="flex flex-wrap gap-1">
                {card.scriptureRefs.map((ref, i) => (
                  <span
                    key={i}
                    className="text-xs bg-gray-100 dark:bg-dark-surface-2 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded"
                  >
                    {ref}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
