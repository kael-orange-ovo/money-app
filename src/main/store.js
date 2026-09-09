import { app } from 'electron'
import { join } from 'path'
import fs from 'fs'

// 数据文件位置：Electron 的 userData 目录下（各系统标准应用数据目录）
const DATA_DIR = app.getPath('userData')
const DATA_FILE = join(DATA_DIR, 'data.json')

// 默认数据结构
function defaultData() {
  return { records: [] }
}

// 读取数据
function loadData() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return defaultData()
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8')
    const data = JSON.parse(raw)
    if (!data || !Array.isArray(data.records)) {
      return defaultData()
    }
    return data
  } catch (err) {
    console.error('读取数据失败：', err)
    return defaultData()
  }
}

// 保存数据
function saveData(data) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true })
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8')
    return { ok: true }
  } catch (err) {
    console.error('保存数据失败：', err)
    return { ok: false, error: String(err) }
  }
}

export { loadData, saveData, DATA_FILE }
