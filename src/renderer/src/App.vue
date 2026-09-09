<script setup>
import { ref, onMounted } from 'vue'
import AddRecord from './components/AddRecord.vue'
import BillList from './components/BillList.vue'
import Stats from './components/Stats.vue'

const currentPage = ref('add')
const editingRecord = ref(null)

const navItems = [
  { key: 'add', label: '记一笔', icon: '✏️' },
  { key: 'bill', label: '账单', icon: '📋' },
  { key: 'stats', label: '统计', icon: '📊' }
]

const records = ref([])

async function loadRecords() {
  const data = await window.api.loadData()
  records.value = data.records || []
}

async function persist() {
  await window.api.saveData({ records: records.value })
}

function goToPage(key) {
  if (key === 'add') editingRecord.value = null
  currentPage.value = key
}

function addRecord(record) {
  records.value.unshift(record)
  persist()
  currentPage.value = 'bill'
}

function updateRecord(updated) {
  const i = records.value.findIndex((r) => r.id === updated.id)
  if (i !== -1) records.value[i] = updated
  persist()
  editingRecord.value = null
  currentPage.value = 'bill'
}

function handleEdit(record) {
  editingRecord.value = record
  currentPage.value = 'add'
}

function handleDelete(id) {
  records.value = records.value.filter((r) => r.id !== id)
  persist()
}

onMounted(loadRecords)
</script>

<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="logo">💰 记账app</div>
      <nav>
        <button
          v-for="item in navItems"
          :key="item.key"
          class="nav-item"
          :class="{ active: currentPage === item.key }"
          @click="goToPage(item.key)"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </button>
      </nav>
    </aside>

    <main class="content">
      <AddRecord
        v-if="currentPage === 'add'"
        :edit-record="editingRecord"
        @add="addRecord"
        @update="updateRecord"
      />
      <BillList
        v-else-if="currentPage === 'bill'"
        :records="records"
        @edit="handleEdit"
        @delete="handleDelete"
      />
      <Stats v-else :records="records" />
    </main>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  height: 100%;
}

.sidebar {
  width: var(--sidebar-width);
  background: var(--card);
  border-right: 1px solid var(--border);
  padding: 20px 12px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.logo {
  font-size: 18px;
  font-weight: 700;
  padding: 0 8px;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 10px;
  font-size: 15px;
  color: var(--text-light);
  text-align: left;
  transition: background 0.15s, color 0.15s;
}

.nav-item:hover {
  background: var(--bg);
}

.nav-item.active {
  background: var(--primary-light);
  color: var(--primary);
  font-weight: 600;
}

.nav-icon {
  font-size: 16px;
}

.content {
  flex: 1;
  overflow-y: auto;
  padding: 28px 32px;
}
</style>
