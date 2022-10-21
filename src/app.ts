import jimp from 'jimp'
import fs = require('fs')
import path = require('path')
import heic from 'heic-convert'

const targetWidth = 1200
const targetHeight = 1200

const imagesDirInput = path.join(__dirname, '../images')
const imagesDirOutput = path.join(__dirname, '../output')
const targetQuality = 80

const allowedMediaExt = ['.jpg', '.jpeg', '.heic', '.png', '.tiff']

console.log('Searching for files in', imagesDirInput)

const files = fs.readdirSync(imagesDirInput).filter(file => {
  console.log(file)
  return allowedMediaExt.includes(path.extname(file))
})

console.log('Found', files.length, 'files')

async function optimize (): Promise<void> {
  for (const file of files) {
    const index = files.indexOf(file)

    try {
      const filepath = path.join(imagesDirInput, file)
      console.log(Number(index / files.length * 100).toFixed(2) + '%', '(', index + 1, '/', files.length, ')', file)

      if (path.extname(file) === '.heic') {
        const outputBuffer = await heic({
          buffer: fs.readFileSync(filepath),
          format: 'JPEG',
          quality: 1
        })

        const img = await jimp.read(Buffer.from(outputBuffer))
        if (img.getWidth() > targetWidth || img.getHeight() > targetHeight) {
          img.scaleToFit(targetWidth, targetHeight).quality(targetQuality).write(path.join(imagesDirOutput, file.replace('.heic', '.jpg')))
        }
      } else {
        const img = await jimp.read(path.join(imagesDirInput, file))

        if (img.getWidth() > targetWidth || img.getHeight() > targetHeight) {
          img.scaleToFit(targetWidth, targetHeight).quality(targetQuality).getBuffer(jimp.MIME_JPEG, (err, data) => {
            if (err != null) console.error(err)
            fs.writeFileSync(path.join(imagesDirOutput, file), data)
          })
        }
      }
    } catch (err) {
      console.error(err)
    }
  }
}

optimize().catch(err => console.error(err))
