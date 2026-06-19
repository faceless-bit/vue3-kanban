/**
 * 搜索 & 筛选逻辑
 * 抽取自视图层，避免重复代码
 */
import { ref, computed, type Ref } from 'vue'
import type { Task, TaskStatus, FilterOption } from '@/types'

/** 筛选选项 */
export const FILTER_OPTIONS: FilterOption[] = [
  { key: 'all', label: '全部' },
  { key: 'todo', label: '待办' },
  { key: 'doing', label: '进行中' },
  { key: 'done', label: '已完成' },
]

export function useSearch(tasks: Ref<Task[]>) {
  const query = ref('')
  const status = ref<TaskStatus | 'all'>('all')

  /** 经过搜索和筛选后的结果 */
  const results = computed(() => {
    let list = tasks.value
    // 状态筛选
    if (status.value !== 'all') {
      list = list.filter(t => t.status === status.value)
    }
    // 关键词搜索
    const q = query.value.trim().toLowerCase()
    if (q) {
      list = list.filter(
        t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      )
    }
    return list
  })

  return { query, status, results, FILTER_OPTIONS }
}
