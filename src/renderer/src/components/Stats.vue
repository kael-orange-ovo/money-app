<script setup>
import { ref, computed } from 'vue'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, getCategoryIcon } from '../categories'

const props = defineProps({
  records: { type: Array, default: () => [] }
})

const currentMonth = ref(currentMonthString())

function currentMonthString() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function changeMonth(delta) {
  const [y, m] = currentMonth.value.split('-').map(Number)
  const d = new Date(y, m - 1 + delta, 1)
  currentMonth.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

const monthRecords = computed(() =>
  props.records.filter((r) => (r.date || '').startsWith(currentMonth.value))
)

function sumByCategory(type) {
  const totals = {}
  for (const r of monthRecords.value) {
    if (r.type !== type) continue
    totals[r.category1] = (totals[r.category1] || 0) + r.amount
  }
  const total = Object.values(totals).reduce((a, b) => a + b, 0)
  const list = Object.entries(totals)
    .map(([name, amount]) => ({ name, amount, percent: total ? (amount / total) * 100 : 0 }))
    .sort((a, b) => b.amount - a.amount)
  return { total, list }
}

const expenseStats = computed(() => sumByCategory('expense'))
const incomeStats = computed(() => sumByCategory('income'))

function fmtMonthLabel() {
  const [y, m] = currentMonth.value.split('-')
  return `${y}年${Number(m)}月`
}
</script>

<template>
  <div class="stats-page">
    <div class="month-bar">
      <button class="month-arrow" @click="changeMonth(-1)">‹</button>
      <span class="month-label">{{ fmtMonthLabel() }}</span>
      <button class="month-arrow" @click="changeMonth(1)">›</button>
    </div>

    <div class="stat-summary">
      <div class="stat-total expense">
        <div class="stat-total-label">本月支出</div>
        <div class="stat-total-value">¥{{ expenseStats.total.toFixed(2) }}</div>
      </div>
      <div class="stat-total income">
        <div class="stat-total-label">本月收入</div>
        <div class="stat-total-value">¥{{ incomeStats.total.toFixed(2) }}</div>
      </div>
    </div>

    <!-- 支出构成 -->
    <section class="block">
      <h2 class="block-title">支出构成</h2>
      <div v-if="expenseStats.list.length === 0" class="empty">本月还没有支出记录</div>
      <div v-else class="bar-list">
        <div v-for="item in expenseStats.list" :key="item.name" class="bar-row">
          <div class="bar-head">
            <span class="bar-name">
              <span class="bar-icon">{{ getCategoryIcon('expense', item.name) }}</span>
              {{ item.name }}
            </span>
            <span class="bar-amount">¥{{ item.amount.toFixed(2) }}</span>
          </div>
          <div class="bar-track">
            <div class="bar-fill" :style="{ width: item.percent + '%' }"></div>
          </div>
          <div class="bar-percent">{{ item.percent.toFixed(1) }}%</div>
        </div>
      </div>
    </section>

    <!-- 收入构成 -->
    <section class="block">
      <h2 class="block-title">收入构成</h2>
      <div v-if="incomeStats.list.length === 0" class="empty">本月还没有收入记录</div>
      <div v-else class="bar-list">
        <div v-for="item in incomeStats.list" :key="item.name" class="bar-row">
          <div class="bar-head">
            <span class="bar-name">
              <span class="bar-icon">{{ getCategoryIcon('income', item.name) }}</span>
              {{ item.name }}
            </span>
            <span class="bar-amount">¥{{ item.amount.toFixed(2) }}</span>
          </div>
          <div class="bar-track">
            <div class="bar-fill income" :style="{ width: item.percent + '%' }"></div>
          </div>
          <div class="bar-percent">{{ item.percent.toFixed(1) }}%</div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.stats-page {
  max-width: 720px;
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

.stat-summary {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 24px;
}

.stat-total {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 18px;
}

.stat-total-label {
  font-size: 13px;
  color: var(--text-light);
  margin-bottom: 8px;
}

.stat-total-value {
  font-size: 24px;
  font-weight: 700;
}

.stat-total.expense .stat-total-value {
  color: var(--expense);
}

.stat-total.income .stat-total-value {
  color: var(--income);
}

.block {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
  margin-bottom: 20px;
}

.block-title {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 16px;
}

.empty {
  color: var(--text-light);
  font-size: 14px;
  padding: 20px 0;
  text-align: center;
}

.bar-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.bar-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.bar-name {
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

.bar-icon {
  font-size: 16px;
}

.bar-amount {
  font-size: 14px;
  font-weight: 600;
}

.bar-track {
  height: 8px;
  background: var(--bg);
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: var(--primary);
  border-radius: 4px;
  transition: width 0.3s;
}

.bar-fill.income {
  background: var(--income);
}

.bar-percent {
  font-size: 12px;
  color: var(--text-light);
  text-align: right;
  margin-top: 4px;
}
</style>
