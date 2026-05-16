import { useState, useRef } from 'react'
import { useCollection } from '../hooks/useCollection'
import { useAuth } from '../hooks/useAuth'
import { storage } from '../lib/firebase'
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { Card, Button, Badge, Modal, Input, Select } from '../components/ui'
import { Textarea } from '../components/ui/Input'
import {
  Plus,
  Sparkles,
  Trash2,
  Search,
  Upload,
  Image,
  Film,
  FileText,
  Download,
  X,
  Eye,
  Play,
} from 'lucide-react'

const FILE_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'image', label: 'Images' },
  { value: 'video', label: 'Videos' },
  { value: 'file', label: 'Files' },
]

function getFileCategory(mimeType) {
  if (!mimeType) return 'file'
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('video/')) return 'video'
  return 'file'
}

function getFileIcon(category) {
  switch (category) {
    case 'image':
      return Image
    case 'video':
      return Film
    default:
      return FileText
  }
}

function formatFileSize(bytes) {
  if (!bytes) return ''
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
}

export default function Inspiration() {
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [previewItem, setPreviewItem] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadForm, setUploadForm] = useState({ title: '', description: '' })
  const [selectedFiles, setSelectedFiles] = useState([])
  const fileInputRef = useRef(null)

  const { data: items, loading, add, remove } = useCollection('inspiration')
  const { isEditor, isAdmin, userProfile } = useAuth()

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase()) ||
      item.fileName?.toLowerCase().includes(search.toLowerCase())
    const matchesType = !filterType || item.fileCategory === filterType
    return matchesSearch && matchesType
  })

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      setSelectedFiles(files)
      if (!uploadForm.title && files.length === 1) {
        setUploadForm((prev) => ({
          ...prev,
          title: files[0].name.replace(/\.[^/.]+$/, ''),
        }))
      }
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (selectedFiles.length === 0) return

    setUploading(true)
    setUploadProgress(0)

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]
        const timestamp = Date.now()
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
        const storagePath = `inspiration/${timestamp}_${safeName}`
        const storageRef = ref(storage, storagePath)

        await new Promise((resolve, reject) => {
          const uploadTask = uploadBytesResumable(storageRef, file)

          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const fileProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              const overallProgress =
                ((i + fileProgress / 100) / selectedFiles.length) * 100
              setUploadProgress(Math.round(overallProgress))
            },
            (error) => reject(error),
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
              const fileCategory = getFileCategory(file.type)

              await add({
                title:
                  selectedFiles.length === 1
                    ? uploadForm.title || file.name
                    : file.name.replace(/\.[^/.]+$/, ''),
                description: selectedFiles.length === 1 ? uploadForm.description : '',
                fileName: file.name,
                fileURL: downloadURL,
                storagePath,
                fileType: file.type,
                fileCategory,
                fileSize: file.size,
                uploadedBy: userProfile?.displayName || 'Unknown',
              })
              resolve()
            }
          )
        })
      }

      closeUploadModal()
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    const item = items.find((i) => i.id === deleteId)
    try {
      if (item?.storagePath) {
        const storageRef = ref(storage, item.storagePath)
        try {
          await deleteObject(storageRef)
        } catch (e) {
          console.warn('Could not delete storage file:', e)
        }
      }
      await remove(deleteId)
      setDeleteId(null)
      if (previewItem?.id === deleteId) setPreviewItem(null)
    } catch (error) {
      console.error('Error deleting:', error)
    }
  }

  const closeUploadModal = () => {
    setIsUploadOpen(false)
    setSelectedFiles([])
    setUploadForm({ title: '', description: '' })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      setSelectedFiles(files)
      if (!uploadForm.title && files.length === 1) {
        setUploadForm((prev) => ({
          ...prev,
          title: files[0].name.replace(/\.[^/.]+$/, ''),
        }))
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Inspiration</h1>
          <p className="page-subtitle">Images, videos, and files for creative inspiration</p>
        </div>
        {isEditor && (
          <Button onClick={() => setIsUploadOpen(true)}>
            <Upload className="w-4 h-4" />
            Upload
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
              placeholder="Search inspiration..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            options={FILE_TYPES}
            className="sm:w-48"
          />
        </Card.Body>
      </Card>

      {/* Gallery */}
      {loading ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">Loading...</div>
      ) : filteredItems.length === 0 ? (
        <Card>
          <Card.Body className="text-center py-12">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
              No inspiration yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {search || filterType
                ? 'Try adjusting your filters'
                : 'Upload your first image, video, or file'}
            </p>
            {isEditor && !search && !filterType && (
              <Button onClick={() => setIsUploadOpen(true)} size="sm">
                <Upload className="w-4 h-4" />
                Upload
              </Button>
            )}
          </Card.Body>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => {
            const Icon = getFileIcon(item.fileCategory)
            return (
              <Card
                key={item.id}
                className="group cursor-pointer overflow-hidden hover:shadow-md transition-shadow"
                onClick={() => setPreviewItem(item)}
              >
                {/* Thumbnail */}
                <div className="aspect-square relative bg-gray-100 dark:bg-dark-surface-2 overflow-hidden">
                  {item.fileCategory === 'image' ? (
                    <img
                      src={item.fileURL}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : item.fileCategory === 'video' ? (
                    <div className="w-full h-full flex items-center justify-center relative">
                      <video
                        src={item.fileURL}
                        className="w-full h-full object-cover"
                        muted
                        preload="metadata"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                          <Play className="w-6 h-6 text-gray-800 ml-1" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4">
                      <Icon className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-2" />
                      <p className="text-xs text-gray-500 dark:text-gray-400 text-center truncate w-full">
                        {item.fileName}
                      </p>
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Eye className="w-6 h-6 text-white" />
                  </div>

                  {/* Type badge */}
                  <div className="absolute top-2 left-2">
                    <Badge
                      variant={
                        item.fileCategory === 'image'
                          ? 'primary'
                          : item.fileCategory === 'video'
                          ? 'purple'
                          : 'default'
                      }
                      size="sm"
                    >
                      {item.fileCategory === 'image'
                        ? 'Image'
                        : item.fileCategory === 'video'
                        ? 'Video'
                        : 'File'}
                    </Badge>
                  </div>
                </div>

                {/* Info */}
                <Card.Body className="p-3 !py-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {item.title || item.fileName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {formatFileSize(item.fileSize)}
                    {item.uploadedBy && ` · ${item.uploadedBy}`}
                  </p>
                </Card.Body>
              </Card>
            )
          })}
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadOpen}
        onClose={closeUploadModal}
        title="Upload Inspiration"
        size="lg"
      >
        <form onSubmit={handleUpload} className="space-y-4">
          {/* Drop zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 dark:border-dark-border rounded-xl p-8 text-center cursor-pointer hover:border-primary-400 dark:hover:border-primary-500 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-colors"
          >
            <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400 dark:text-gray-500" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Click to browse or drag & drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Images, videos, and files - no size limit
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar,.ai,.psd,.svg,.eps"
            />
          </div>

          {/* Selected files */}
          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
              </p>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {selectedFiles.map((file, i) => {
                  const Icon = getFileIcon(getFileCategory(file.type))
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-dark-surface-2 px-3 py-1.5 rounded-lg"
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{file.name}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto flex-shrink-0">
                        {formatFileSize(file.size)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Title & Description (single file) */}
          {selectedFiles.length === 1 && (
            <>
              <Input
                label="Title"
                value={uploadForm.title}
                onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                placeholder="Give it a name..."
              />
              <Textarea
                label="Description (optional)"
                value={uploadForm.description}
                onChange={(e) =>
                  setUploadForm({ ...uploadForm, description: e.target.value })
                }
                placeholder="Add some context..."
                rows={2}
              />
            </>
          )}

          {/* Upload progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Uploading...</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {uploadProgress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-dark-surface-2 rounded-full h-2">
                <div
                  className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={closeUploadModal} disabled={uploading}>
              Cancel
            </Button>
            <Button type="submit" loading={uploading} disabled={selectedFiles.length === 0}>
              {uploading
                ? `Uploading... ${uploadProgress}%`
                : `Upload ${selectedFiles.length || ''} File${selectedFiles.length !== 1 ? 's' : ''}`}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Preview Modal */}
      <Modal
        isOpen={!!previewItem}
        onClose={() => setPreviewItem(null)}
        title={previewItem?.title || previewItem?.fileName}
        size="xl"
      >
        {previewItem && (
          <div className="space-y-4">
            {/* Media preview */}
            <div className="rounded-lg overflow-hidden bg-gray-100 dark:bg-dark-surface-2">
              {previewItem.fileCategory === 'image' ? (
                <img
                  src={previewItem.fileURL}
                  alt={previewItem.title}
                  className="w-full max-h-[70vh] object-contain mx-auto"
                />
              ) : previewItem.fileCategory === 'video' ? (
                <video
                  src={previewItem.fileURL}
                  controls
                  autoPlay
                  className="w-full max-h-[70vh] mx-auto"
                >
                  Your browser does not support video playback.
                </video>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
                  <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                    {previewItem.fileName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {formatFileSize(previewItem.fileSize)}
                  </p>
                </div>
              )}
            </div>

            {/* Details */}
            {previewItem.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {previewItem.description}
              </p>
            )}

            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>
                Uploaded by {previewItem.uploadedBy || 'Unknown'}
                {previewItem.fileSize && ` · ${formatFileSize(previewItem.fileSize)}`}
              </span>
              <Badge
                variant={
                  previewItem.fileCategory === 'image'
                    ? 'primary'
                    : previewItem.fileCategory === 'video'
                    ? 'purple'
                    : 'default'
                }
              >
                {previewItem.fileCategory === 'image'
                  ? 'Image'
                  : previewItem.fileCategory === 'video'
                  ? 'Video'
                  : 'File'}
              </Badge>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-dark-border">
              <a
                href={previewItem.fileURL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
              >
                <Download className="w-4 h-4" />
                Download
              </a>
              {isAdmin && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    setDeleteId(previewItem.id)
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              )}
            </div>
          </div>
        )}
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
        <p className="text-gray-600 dark:text-gray-400">
          Are you sure you want to delete this? The file will be permanently removed.
        </p>
      </Modal>
    </div>
  )
}
