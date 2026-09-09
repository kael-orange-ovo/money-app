<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../categories'

const props = defineProps({
  editRecord: { type: Object, default: null }
})

const emit = defineEmits(['add', 'update'])

const type = ref('expense')
const amount = ref('')
const category1 = ref('')
const category2 = ref('')
const note = ref('')
const date = ref(today())
const error = ref('')

const isEditing = computed(() => !!props.editRecord)

const categories = computed(() =>
  type.value === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
)

const selectedCategory = computed(() =>
  categories.value.find((c) => c.name === category1.value)
)

// 切换支出/收入时，清空已选分类
watch(type, () => {
  category1.value = ''
  category2.value = ''
})

function today() {
  const d = new Date()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

// 编辑模式：把要改的账单填进表单
onMounted(() => {
  if (props.editRecord) {
    type.value = props.editRecord.type
    amount.value = String(props.editRecord.amount)
    category1.value = props.editRecord.category1
    category2.value = props.editRecord.category2
    note.value = props.editRecord.note || ''
    date.value = props.editRecord.date
  }
})

function selectCategory1(name) {
  category1.value = name
  category2.value = ''
}

function save() {
  error.value = ''
  const amt = parseFloat(amount.value)
  if (!amt || amt <= 0) {
    error.value = '请输入正确的金额'
    return
  }
  if (!category1.value || !category2.value) {
    error.value = '请选择分类（一级和二级都要选）'
    return
  }

  if (isEditing.value) {
    emit('update', {
      ...props.editRecord,
      type: type.value,
      amount: Math.round(amt * 100) / 100,
      category1: category1.value,
      category2: category2.value,
      note: note.value.trim(),
      date: date.value
    })
  } else {
    emit('add', {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      type: type.value,
      amount: Math.round(amt * 100) / 100,
      category1: category1.value,
      category2: category2.value,
      note: note.value.trim(),
      date: date.value,
      createdAt: new Date().toISOString()
    })
  }

  amount.value = ''
  note.value = ''
  category1.value = ''
  category2.value = ''
}
</script>

<template>
  <div class="add-page">
    <h1 class="page-title">{{ isEditing ? '编辑账单' : '记一笔' }}</h1>

    <!-- 支出 / 收入 切换 -->
    <div class="type-switch">
      <button
        class="type-btn expense"
        :class="{ active: type === 'expense' }"
        @click="type = 'expense'"
      >
        支出
      </button>
      <button
        class="type-btn income"
        :class="{ active: type === 'income' }"
        @click="type = 'income'"
      >
        收入
      </button>
    </div>

    <!-- 金额 -->
    <div class="field">
      <label class="field-label">金额（元）</label>
      <div class="amount-row">
        <span class="currency">¥</span>
        <input
          v-model="amount"
          type="number"
          min="0.01"
          step="0.01"
          placeholder="0.00"
          class="amount-input"
        />
      </div>
    </div>

    <!-- 分类 -->
    <div class="field">
      <label class="field-label">一级分类</label>
      <div class="chip-group">
        <button
          v-for="c in categories"
          :key="c.name"
          class="chip"
          :class="{ active: category1 === c.name }"
          @click="selectCategory1(c.name)"
        >
          <span>{{ c.icon }}</span> {{ c.name }}
        </button>
      </div>
    </div>

    <div v-if="category1" class="field">
      <label class="field-label">二级分类</label>
      <div class="chip-group">
        <button
          v-for="sub in selectedCategory.children"
          :key="sub"
          class="chip sub"
          :class="{ active: category2 === sub }"
          @click="category2 = sub"
        >
          {{ sub }}
        </button>
      </div>
    </div>

    <!-- 备注 -->
    <div class="field">
      <label class="field-label">备注（可选）</label>
      <input v-model="note" type="text" placeholder="写点什么…" class="text-input" />
    </div>

    <!-- 日期 -->
    <div class="field">
      <label class="field-label">日期</label>
      <input v-model="date" type="date" class="text-input" />
    </div>

    <p v-if="error" class="error">⚠️ {{ error }}</p>

    <button class="save-btn" :class="type" @click="save">
      {{ isEditing ? '保存修改' : '保存' }}
    </button>
  </div>
</template>

<style scoped>
.add-page {
  max-width: 640px;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 24px;
}

.type-switch {
  display: inline-flex;
  background: var(--bg);
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 24px;
}

.type-btn {
  padding: 10px 28px;
  border-radius: 9px;
  font-size: 15px;
  color: var(--text-light);
  font-weight: 600;
  transition: all 0.15s;
}

.type-btn.active.expense {
  background: var(--expense);
  color: #fff;
}

.type-btn.active.income {
  background: var(--income);
  color: #fff;
}

.field {
  margin-bottom: 22px;
}

.field-label {
  display: block;
  font-size: 14px;
  color: var(--text-light);
  margin-bottom: 10px;
}

.amount-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.currency {
  font-size: 28px;
  font-weight: 700;
  color: var(--text);
}

.amount-input {
  flex: 1;
  font-size: 36px;
  font-weight: 700;
  padding: 10px 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  outline: none;
}

.amount-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-light);
}

.chip-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.chip {
  padding: 10px 16px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--card);
  font-size: 14px;
  color: var(--text);
  transition: all 0.15s;
}

.chip:hover {
  border-color: var(--primary);
}

.chip.active {
  background: var(--primary);
  border-color: var(--primary);
  color: #fff;
}

.chip.sub.active {
  background: var(--primary-light);
  border-color: var(--primary);
  color: var(--primary);
  font-weight: 600;
}

.text-input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-size: 15px;
  outline: none;
}

.text-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-light);
}

.error {
  color: var(--expense);
  font-size: 14px;
  margin-bottom: 16px;
}

.save-btn {
  width: 100%;
  padding: 14px;
  border-radius: var(--radius);
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  transition: opacity 0.15s;
}

.save-btn:hover {
  opacity: 0.9;
}

.save-btn.expense {
  background: var(--expense);
}

.save-btn.income {
  background: var(--income);
}
</style>
