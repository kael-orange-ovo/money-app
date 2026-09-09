// 分类定义（二级分类）
// 一级大类 → 二级小类列表

export const EXPENSE_CATEGORIES = [
  { name: '餐饮', icon: '🍜', children: ['早餐', '午餐', '晚餐', '外卖', '零食', '饮品', '聚餐'] },
  { name: '交通', icon: '🚗', children: ['公交地铁', '打车', '加油', '停车', '火车高铁', '飞机', '共享单车'] },
  { name: '购物', icon: '🛒', children: ['服饰鞋包', '数码家电', '家居日用', '美妆个护', '母婴'] },
  { name: '居住', icon: '🏠', children: ['房租', '水电燃气', '物业费', '维修', '宽带话费'] },
  { name: '娱乐', icon: '🎮', children: ['电影', '游戏', '音乐视频会员', '旅游', '健身', '宠物'] },
  { name: '医疗', icon: '🏥', children: ['药品', '门诊', '体检', '住院'] },
  { name: '教育', icon: '📚', children: ['书籍', '课程培训', '考试报名', '文具'] },
  { name: '人情', icon: '🎁', children: ['红包', '礼物', '请客', '随礼'] },
  { name: '其他', icon: '📦', children: ['其他'] }
]

export const INCOME_CATEGORIES = [
  { name: '工资', icon: '💼', children: ['基本工资', '奖金', '加班费'] },
  { name: '理财', icon: '📈', children: ['利息', '股票基金收益', '房租收入'] },
  { name: '人情', icon: '🎁', children: ['红包', '礼金'] },
  { name: '其他', icon: '📦', children: ['其他收入'] }
]

// 根据类型和一级分类名，找到该分类的图标
export function getCategoryIcon(type, category1) {
  const list = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
  const found = list.find((c) => c.name === category1)
  return found ? found.icon : '📦'
}
