import sharp from 'sharp'
import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const src = resolve(__dirname, '../public/images/icon.png')
const pub = resolve(__dirname, '../public')

async function generate() {
  await sharp(src).resize(16, 16).png().toFile(resolve(pub, 'favicon-16x16.png'))
  await sharp(src).resize(32, 32).png().toFile(resolve(pub, 'favicon-32x32.png'))
  await sharp(src).resize(180, 180).png().toFile(resolve(pub, 'apple-touch-icon.png'))

  const ico = await sharp(src).resize(32, 32).png().toBuffer()
  writeFileSync(resolve(pub, 'favicon.ico'), ico)

  console.log('Favicons generated.')
}

generate()
