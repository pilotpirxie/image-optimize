import jimp from 'jimp';
import fs = require('fs');
import path = require('path');

const targetWidth = 1200;
const targetHeight = 1200;

const imagesDirInput = path.join(__dirname, '../images');
const imagesDirOutput = path.join(__dirname, '../output');

const allowedMediaExt = ['.jpg', '.jpeg', '.png', '.heic', '.tiff'];

console.log('Searching for files in', imagesDirInput)

const files = fs.readdirSync(imagesDirInput).filter(file => {
    console.log(file)
    return allowedMediaExt.includes(path.extname(file))
});

console.log('Found', files.length, 'files');

files.forEach(file => {
    jimp.read(path.join(imagesDirInput, file)).then(img => {
        if (img.getWidth() > targetWidth || img.getHeight() > targetHeight) {
            img.scaleToFit(targetWidth, targetHeight);
        }
        img.quality(80).write(path.join(imagesDirOutput, file))
    }).catch(err => {
        console.error(err);
    });
});

