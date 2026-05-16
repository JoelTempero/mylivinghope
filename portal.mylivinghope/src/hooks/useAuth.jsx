import { useState, useEffect, useContext, createContext } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user)
        // Fetch user profile from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid))
          console.log('[AUTH DEBUG] User UID:', user.uid)
          console.log('[AUTH DEBUG] userDoc.exists():', userDoc.exists())
          if (userDoc.exists()) {
            const profileData = userDoc.data()
            console.log('[AUTH DEBUG] Profile data:', profileData)
            console.log('[AUTH DEBUG] Role value:', profileData.role)
            console.log('[AUTH DEBUG] Role type:', typeof profileData.role)
            console.log('[AUTH DEBUG] isAdmin check:', profileData.role === 'admin')
            setUserProfile(profileData)
          } else {
            console.log('[AUTH DEBUG] No user document found for UID:', user.uid)
          }
        } catch (err) {
          console.error('Error fetching user profile:', err)
        }
      } else {
        setUser(null)
        setUserProfile(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  // Sign in with email and password
  const signIn = async (email, password) => {
    setError(null)
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)

      // Update last login
      await setDoc(
        doc(db, 'users', result.user.uid),
        { lastLogin: serverTimestamp() },
        { merge: true }
      )

      return result.user
    } catch (err) {
      setError(getErrorMessage(err.code))
      throw err
    }
  }

  // Sign up with email and password
  const signUp = async (email, password, displayName) => {
    setError(null)
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)

      // Update profile with display name
      await updateProfile(result.user, { displayName })

      // Create user document in Firestore
      await setDoc(doc(db, 'users', result.user.uid), {
        email,
        displayName,
        role: 'viewer', // Default role for new users
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      })

      // Fetch the created profile
      const userDoc = await getDoc(doc(db, 'users', result.user.uid))
      if (userDoc.exists()) {
        setUserProfile(userDoc.data())
      }

      return result.user
    } catch (err) {
      setError(getErrorMessage(err.code))
      throw err
    }
  }

  // Sign out
  const logOut = async () => {
    setError(null)
    try {
      await signOut(auth)
    } catch (err) {
      setError(getErrorMessage(err.code))
      throw err
    }
  }

  // Reset password
  const resetPassword = async (email) => {
    setError(null)
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (err) {
      setError(getErrorMessage(err.code))
      throw err
    }
  }

  // Refresh user profile
  const refreshProfile = async () => {
    if (!user) return
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (userDoc.exists()) {
        setUserProfile(userDoc.data())
      }
    } catch (err) {
      console.error('Error refreshing profile:', err)
    }
  }

  const value = {
    user,
    userProfile,
    loading,
    error,
    signIn,
    signUp,
    logOut,
    resetPassword,
    refreshProfile,
    isAdmin: userProfile?.role === 'admin',
    isEditor: userProfile?.role === 'editor' || userProfile?.role === 'admin',
    isViewer: !!userProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Helper function to get user-friendly error messages
function getErrorMessage(code) {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please sign in instead.'
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'
    case 'auth/operation-not-allowed':
      return 'Email/password accounts are not enabled. Please contact support.'
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.'
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.'
    case 'auth/user-not-found':
      return 'No account found with this email address.'
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.'
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please try again.'
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.'
    default:
      return 'An error occurred. Please try again.'
  }
}

export default useAuth
