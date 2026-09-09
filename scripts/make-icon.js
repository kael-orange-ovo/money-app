// 把 scripts/icon.svg 转成 build/icon.png（打包时 electron-builder 会再用它生成 .ico）
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

const src = path.join(__dirname, 'icon.svg')
const dest = path.join(__dirname, '..', 'build', 'icon.png')

// 确保 build 目录存在
fs.mkdirSync(path.dirname(dest), { recursive: true })

sharp(src)
  .resize(1024, 1024)
  .png()
  .toFile(dest)
  .then(() => console.log('✅ 图标已生成：', dest))
  .catch((err) => {
    console.error('❌ 生成图标失败：', err)
    process.exit(1)
  })
