/** 任务状态：待办 → 进行中 → 已完成 */
export type TaskStatus = 'todo' | 'doing' | 'done'

/** 任务优先级 */
export type TaskPriority = 'low' | 'mid' | 'high'

/** 任务实体 */
export interface Task {
  id: number
  user_id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  created_at: string
}

/** 看板列配置 */
export interface ColumnConfig {
  key: TaskStatus
  label: string
}

/** 过滤器选项 */
export interface FilterOption {
  key: TaskStatus | 'all'
  label: string
}

/** 管理员用户 */
export interface AdminUser {
  uid: string
  uname: string
  ucreated_at: string
}

/** 统计维度 */
export interface TaskStats {
  total: number
  todo: number
  doing: number
  done: number
}

/** 主题模式 */
export type ThemeMode = 'dark' | 'light'

/** 图标名称合集 */
export type IconName =
  | 'clipboard' | 'chart' | 'info' | 'shield' | 'user'
  | 'pin' | 'play' | 'check-circle' | 'trending' | 'search'
  | 'inbox' | 'clock' | 'edit' | 'plus' | 'lock'
  | 'star' | 'eye' | 'eye-off' | 'heart' | 'coffee'
  | 'code' | 'bug' | 'lightbulb' | 'message' | 'zap'
  | 'phone' | 'cloud' | 'diamond' | 'x-circle'
  | 'chevron-left' | 'chevron-right' | 'arrow-right' | 'chevron-down'
  | 'sun' | 'moon' | 'trash' | 'move-right' | 'move-left'
