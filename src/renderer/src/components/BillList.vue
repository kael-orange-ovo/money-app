<script setup>
import { ref, computed } from 'vue'
import { getCategoryIcon } from '../categories'

const props = defineProps({
  records: { type: Array, default: () => [] }
})

const emit = defineEmits(['edit', 'delete'])

const currentMonth = ref(currentMonthString())
const confirmingId = ref(null)

function currentMonthString() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function changeMonth(delta) {
  const [y, m] = currentMonth.value.split('-').map(Number)
  const d = new Date(y, m - 1 + delta, 1)
  currentMonth.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

// 本月账单，按日期+创建时间倒序
const monthRecords = computed(() => {
  return props.records
    .filter((r) => (r.date || '').startsWith(currentMonth.value))
    .slice()
    .sort((a, b) => (b.date + b.createdAt).localeCompare(a.date + a.createdAt))
})

const summary = computed(() => {
  let income = 0
  let expense = 0
  for (const r of monthRecords.value) {
    if (r.type === 'income') income += r.amount
    else expense += r.amount
  }
  return { income, expense, balance: income - expense }
})

// 按日期分组
const grouped = computed(() => {
  const map = new Map()
  for (const r of monthRecords.value) {
    if (!map.has(r.date)) map.set(r.date, [])
    map.get(r.date).push(r)
  }
  return [...map.entries()]
})

function fmtAmount(r) {
  const sign = r.type === 'income' ? '+' : '-'
  return `${sign}¥${r.amount.toFixed(2)}`
}

function fmtMonthLabel() {
  const [y, m] = currentMonth.value.split('-')
  return `${y}年${Number(m)}月`
}

function fmtDay(dateStr) {
  const [, , d] = dateStr.split('-')
  return `${Number(d)}日`
}

// 某一天的净收支（收入为正、支出为负）
function dayNet(list) {
  let net = 0
  for (const r of list) {
    net += r.type === 'income' ? r.amount : -r.amount
  }
  return net
}

// 删除二次确认：第一次点变“确认删除？”，再点一次才真删
function confirmDelete(id) {
  if (confirmingId.value === id) {
    confirmingId.value = null
    emit('delete', id)
  } else {
    confirmingId.value = id
  }
}
</script>

<template>
  <div class="bill-page">
    <!-- 月份切换 -->
    <div class="month-bar">
      <button class="month-arrow" @click="changeMonth(-1)">‹</button>
      <span class="month-label">{{ fmtMonthLabel() }}</span>
      <button class="month-arrow" @click="changeMonth(1)">›</button>
    </div>

    <!-- 汇总卡片 -->
    <div class="summary-cards">
      <div class="sum-card">
        <div class="sum-label">总收入</div>
        <div class="sum-value income">¥{{ summary.income.toFixed(2) }}</div>
      </div>
      <div class="sum-card">
        <div class="sum-label">总支出</div>
        <div class="sum-value expense">¥{{ summary.expense.toFixed(2) }}</div>
      </div>
      <div class="sum-card">
        <div class="sum-label">结余</div>
        <div class="sum-value" :class="summary.balance >= 0 ? 'income' : 'expense'">
          ¥{{ summary.balance.toFixed(2) }}
        </div>
      </div>
    </div>

    <!-- 账单列表 -->
    <div v-if="grouped.length === 0" class="empty">这个月还没有记录，去「记一笔」吧 ✏️</div>

    <div v-for="[date, list] in grouped" :key="date" class="day-group">
      <div class="day-header">
        <span class="day-title">{{ fmtDay(date) }}</span>
        <span class="day-total" :class="dayNet(list) >= 0 ? 'income' : 'expense'">
          {{ dayNet(list) >= 0 ? '收' : '支' }} ¥{{ Math.abs(dayNet(list)).toFixed(2) }}
        </span>
      </div>
      <div class="records">
        <div
          v-for="r in list"
          :key="r.id"
          class="record-row"
          @mouseleave="confirmingId = null"
        >
          <div class="record-icon">{{ getCategoryIcon(r.type, r.category1) }}</div>
          <div class="record-main">
            <div class="record-title">{{ r.category2 }}</div>
            <div v-if="r.note" class="record-note">{{ r.note }}</div>
          </div>
          <div class="record-right">
            <span class="record-amount" :class="r.type">
              {{ fmtAmount(r) }}
            </span>
            <span class="record-actions">
              <button class="mini-btn" @click="emit('edit', r)">编辑</button>
              <button
                class="mini-btn danger"
                :class="{ confirming: confirmingId === r.id }"
                @click="confirmDelete(r.id)"
              >
                {{ confirmingId === r.id ? '确认删除？' : '删除' }}
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bill-page {
  max-width: 760px;
}

.month-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 20px;
}

.month-arrow {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 20px;
  color: var(--text-light);
  background: var(--card);
  border: 1px solid var(--border);
}

.month-arrow:hover {
  color: var(--primary);
  border-color: var(--primary);
}

.month-label {
  font-size: 17px;
  font-weight: 700;
  min-width: 100px;
  text-align: center;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 24px;
}

.sum-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px 18px;
}

.sum-label {
  font-size: 13px;
  color: var(--text-light);
  margin-bottom: 6px;
}

.sum-value {
  font-size: 20px;
  font-weight: 700;
}

.income {
  color: var(--income);
}

.expense {
  color: var(--expense);
}

.empty {
  text-align: center;
  color: var(--text-light);
  padding: 60px 0;
  font-size: 15px;
}

.day-group {
  margin-bottom: 20px;
}

.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 4px;
}

.day-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-light);
}

.day-total {
  font-size: 13px;
  color: var(--text-light);
}

.records {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}

.record-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--bg);
}

.record-row:last-child {
  border-bottom: none;
}

.record-icon {
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
  border-radius: 10px;
  flex-shrink: 0;
}

.record-main {
  flex: 1;
  min-width: 0;
}

.record-title {
  font-size: 15px;
  font-weight: 600;
}

.record-note {
  font-size: 13px;
  color: var(--text-light);
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.record-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.record-amount {
  font-size: 15px;
  font-weight: 700;
}

.record-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.15s;
}

.record-row:hover .record-actions {
  opacity: 1;
}

.mini-btn {
  font-size: 12px;
  color: var(--primary);
  padding: 4px 8px;
  border-radius: 6px;
}

.mini-btn:hover {
  background: var(--primary-light);
}

.mini-btn.danger {
  color: var(--expense);
}

.mini-btn.danger:hover {
  background: #fef2f2;
}

.mini-btn.danger.confirming {
  background: var(--expense);
  color: #fff;
  font-weight: 600;
}
</style>
