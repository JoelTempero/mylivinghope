/**
 * Utility functions for the My Living Hope portal
 */

/**
 * Merge class names with conditional support
 * @param  {...any} classes - Class names or conditional class objects
 * @returns {string} Merged class string
 */
export function cn(...classes) {
  return classes
    .filter(Boolean)
    .flatMap((c) => (typeof c === 'string' ? c.split(' ') : []))
    .filter(Boolean)
    .join(' ')
}

/**
 * Format a Firestore timestamp to a readable date string
 * @param {Object} timestamp - Firestore timestamp
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export function formatDate(timestamp, options = {}) {
  if (!timestamp) return ''

  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)

  return new Intl.DateTimeFormat('en-NZ', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options,
  }).format(date)
}

/**
 * Format a date for datetime-local input
 * @param {Date|Object} date - Date or Firestore timestamp
 * @returns {string} ISO string suitable for datetime-local input
 */
export function formatDateForInput(date) {
  if (!date) return ''
  const d = date.toDate ? date.toDate() : new Date(date)
  return d.toISOString().slice(0, 16)
}

/**
 * Debounce function execution
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Generate a unique ID
 * @returns {string} Unique ID string
 */
export function generateId() {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15)
}

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated text
 */
export function truncate(text, length = 50) {
  if (!text) return ''
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

/**
 * Get initials from a name
 * @param {string} name - Full name
 * @returns {string} Initials (up to 2 characters)
 */
export function getInitials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Status color mapping for badges (with dark mode support)
 */
export const statusColors = {
  // Task status
  'Complete': 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300',
  'In Progress': 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300',
  'Not Started': 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300',

  // Product status
  'In stock': 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300',
  'Temporarily unavailable': 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300',
  'Re-purchase needed': 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300',
  'Brainstormed': 'bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300',

  // Campaign status
  'Published': 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300',
  'In progress': 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300',
  'Paused': 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300',
  'New': 'bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300',

  // Artist status
  'To Contact': 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300',
  'Waiting on confirmation': 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300',
  'Waiting on Design': 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300',
  'Design Received': 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300',
  'Archived': 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300',

  // Brainstorm status
  'Actioned': 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300',
  'Noted': 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300',

  // Urgency
  'A - Complete': 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300',
  'B - Urgent': 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300',
  'C - Semi Urgent': 'bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300',
  'D - Non Urgent': 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300',
}

/**
 * Get status color class
 * @param {string} status - Status string
 * @returns {string} Tailwind class string
 */
export function getStatusColor(status) {
  return statusColors[status] || 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
}
