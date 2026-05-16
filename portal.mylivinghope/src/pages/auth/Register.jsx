import { Link } from 'react-router-dom'
import { Flame, Lock } from 'lucide-react'

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-hope-light to-primary-50 dark:from-dark-bg dark:to-dark-surface px-4 py-12 transition-colors">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-2xl mb-4">
            <Flame className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-gray-100">
            My Living Hope
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Portal Access</p>
        </div>

        {/* Message */}
        <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-xl dark:shadow-2xl dark:shadow-black/20 p-8 dark:border dark:border-dark-border">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-dark-surface-2 rounded-full mb-4">
              <Lock className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Registration Closed
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              New accounts are created by administrators only. If you need access to the portal, please contact your team administrator.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center w-full btn-primary py-3"
            >
              Back to Sign In
            </Link>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-500 font-medium"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
