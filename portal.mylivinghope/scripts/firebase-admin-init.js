import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
  || join(__dirname, '..', 'firebase-service-key.json')

const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'))

const app = initializeApp({
  credential: cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'my-living-hope.firebasestorage.app',
})

export const db = getFirestore(app)
export const bucket = getStorage(app).bucket()
