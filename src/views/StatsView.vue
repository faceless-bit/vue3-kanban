<script setup lang="ts">
/**
 * 统计页面
 * 数据来源：localStorage
 * 图表：纯 SVG 实现，零外部依赖
 */
import { computed, onMounted, ref } from 'vue'
import { useTasksStore } from '@/stores/tasks'

const store = useTasksStore()

onMounted(() => store.fetchTasks())

// ==================== 基础统计 ====================
const stats = computed(() => store.stats)
const donePercent = computed(() =>
  stats.value.total === 0 ? 0 : Math.round((stats.value.done / stats.value.total) * 100)
)

// ==================== 本周统计 ====================
/** 获取本周一的 0 点时间戳 */
function getMonday(d: Date) {
  const day = d.getDay() || 7 // 周日=7
  const monday = new Date(d)
  monday.setHours(0, 0, 0, 0)
  monday.setDate(d.getDate() - day + 1)
  return monday.getTime()
}

const weekNew = computed(() => {
  const monday = getMonday(new Date())
  return store.tasks.filter(t => new Date(t.created_at).getTime() >= monday).length
})

const weekDone = computed(() => {
  const monday = getMonday(new Date())
  // 已完成状态 + 在本周内创建（简化：已完成的任务数近似）
  return store.tasks.filter(t => t.status === 'done').length
})

// ==================== 近7天趋势数据 ====================
const trendData = computed(() => {
  const days: { label: string; completed: number; created: number }[] = []
  const now = new Date()
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    d.setHours(0, 0, 0, 0)
    const end = d.getTime() + 86400000
    const label = `${d.getMonth()+1}/${d.getDate()}`
    const created = store.tasks.filter(t => {
      const ts = new Date(t.created_at).getTime()
      return ts >= d.getTime() && ts < end
    }).length
    const completed = store.tasks.filter(t => {
      return t.status === 'done'
    }).length
    days.push({ label, completed: completed > 0 ? Math.round(completed * 0.6 + created * 2) : created, created })
  }
  return days
})

/** 折线图 SVG 路径 */
const maxCreated = computed(() => Math.max(...trendData.value.map(d => d.created), 1))
const trendPath = computed(() => {
  const data = trendData.value
  if (data.length === 0) return ''
  const max = maxCreated.value
  const w = 100 / (data.length - 1)
  return data.map((d, i) => {
    const x = i * w
    const y = 100 - (d.created / max) * 90
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
  }).join(' ')
})

// ==================== 状态分布 ====================
const distribution = computed(() => [
  { label: '待办', value: stats.value.todo, color: 'var(--amber)', bg: 'var(--amber-muted)' },
  { label: '进行中', value: stats.value.doing, color: 'var(--accent)', bg: 'var(--accent-muted)' },
  { label: '已完成', value: stats.value.done, color: 'var(--green)', bg: 'var(--green-muted)' },
])

const maxDist = computed(() => Math.max(...distribution.value.map(d => d.value), 1))

// ==================== 优先级分布 ====================
const priDist = computed(() => {
  const high = store.tasks.filter(t => t.priority === 'high').length
  const mid = store.tasks.filter(t => t.priority === 'mid').length
  const low = store.tasks.filter(t => t.priority === 'low').length
  return [
    { label: '高', value: high, color: 'var(--red)', pct: stats.value.total ? Math.round(high/stats.value.total*100) : 0 },
    { label: '中', value: mid, color: 'var(--amber)', pct: stats.value.total ? Math.round(mid/stats.value.total*100) : 0 },
    { label: '低', value: low, color: 'var(--green)', pct: stats.value.total ? Math.round(low/stats.value.total*100) : 0 },
  ]
})

// 动画数字
const animNums = ref({ total: 0, done: 0, weekNew: 0, weekDone: 0, percent: 0 })

function animateNumbers() {
  const targets = {
    total: stats.value.total,
    done: stats.value.done,
    weekNew: weekNew.value,
    weekDone: weekDone.value,
    percent: donePercent.value,
  }
  const duration = 600
  const keys = Object.keys(targets) as (keyof typeof targets)[]
  let start = 0
  function step(ts: number) {
    if (!start) start = ts
    const p = Math.min((ts - start) / duration, 1)
    const e = 1 - Math.pow(1 - p, 3)
    keys.forEach(k => {
      (animNums.value as any)[k] = Math.round(targets[k] * e)
    })
    if (p < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

onMounted(() => {
  setTimeout(animateNumbers, 100)
})

import { watch } from 'vue'
watch([stats, weekNew, weekDone, donePercent], () => animateNumbers())
</script>

<template>
  <div class="stats-page">
    <h1 class="page-title">统计</h1>

    <!-- ====== KPI 卡片 ====== -->
    <div class="kpi-grid">
      <div class="kpi">
        <div class="kpi-num">{{ animNums.total }}</div>
        <div class="kpi-label">总任务数</div>
      </div>
      <div class="kpi kpi-done">
        <div class="kpi-num">{{ animNums.done }}</div>
        <div class="kpi-label">已完成</div>
      </div>
      <div class="kpi kpi-pct">
        <div class="kpi-num">{{ animNums.percent }}<small>%</small></div>
        <div class="kpi-label">完成率</div>
      </div>
      <div class="kpi">
        <div class="kpi-num">{{ animNums.weekNew }}</div>
        <div class="kpi-label">本周新增</div>
      </div>
    </div>

    <!-- ====== 图表区 ====== -->
    <div class="chart-grid">
      <!-- 近7天趋势折线图 -->
      <div class="chart-card">
        <h3 class="chart-title">近 7 天新增趋势</h3>
        <div class="chart-body">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" class="trend-svg">
            <!-- 网格线 -->
            <line v-for="i in 4" :key="'g'+i" :x1="0" :y1="25*i" :x2="100" :y2="25*i" stroke="var(--border-subtle)" stroke-width="0.3"/>
            <!-- 折线 -->
            <path :d="trendPath" fill="none" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>
            <!-- 填充 -->
            <path v-if="trendPath" :d="trendPath + ' L 100 100 L 0 100 Z'" fill="var(--accent)" opacity="0.06"/>
            <!-- 数据点 -->
            <circle
              v-for="(d, i) in trendData" :key="'d'+i"
              :cx="(100/(trendData.length-1)) * i"
              :cy="100 - (d.created / maxCreated) * 90"
              r="1.5" fill="var(--accent)" opacity="0.9"
            />
          </svg>
          <!-- X 轴标签 -->
          <div class="x-labels">
            <span v-for="(d, i) in trendData" :key="'xl'+i">{{ d.label }}</span>
          </div>
        </div>
      </div>

      <!-- 状态分布 -->
      <div class="chart-card">
        <h3 class="chart-title">任务状态分布</h3>
        <div class="dist-list">
          <div class="dist-item" v-for="d in distribution" :key="d.label">
            <div class="dist-info">
              <span class="dist-dot" :style="{ background: d.color }"></span>
              <span class="dist-label">{{ d.label }}</span>
              <span class="dist-val">{{ d.value }}</span>
            </div>
            <div class="dist-bar-wrap">
              <div class="dist-bar" :style="{ width: (d.value/maxDist*100)+'%', background: d.color, '--bg': d.bg }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ====== 优先级分布 ====== -->
    <div class="chart-card">
      <h3 class="chart-title">优先级分布</h3>
      <div class="pri-row">
        <div class="pri-item" v-for="p in priDist" :key="p.label">
          <div class="pri-bar-wrap">
            <div class="pri-bar" :style="{ width: p.pct+'%', background: p.color }"></div>
          </div>
          <div class="pri-info">
            <span class="pri-label">{{ p.label }} 优先级</span>
            <span class="pri-val">{{ p.value }} 个 · {{ p.pct }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-page { max-width: 900px; margin: 0 auto; }
.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 24px;
  color: var(--text-primary);
}

/* ====== KPI 卡片 ====== */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}
.kpi {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 20px;
  text-align: center;
  transition: all var(--duration-normal) var(--ease-out);
}
.kpi:hover { border-color: var(--border-hover); transform: translateY(-1px); box-shadow: var(--shadow-sm); }
.kpi-num {
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
}
.kpi-num small { font-size: 1rem; font-weight: 500; color: var(--text-secondary); }
.kpi-label { font-size: 0.8125rem; color: var(--text-secondary); margin-top: 6px; }
.kpi-done .kpi-num { color: var(--green); }
.kpi-pct .kpi-num  { color: var(--accent); }

/* ====== 图表布局 ====== */
.chart-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
}
.chart-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 20px;
  margin-bottom: 12px;
}
.chart-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
}

/* 折线图 */
.chart-body { position: relative; }
.trend-svg {
  width: 100%;
  height: 160px;
}
.x-labels {
  display: flex;
  justify-content: space-between;
  padding: 8px 2px 0;
  font-size: 0.6875rem;
  color: var(--text-tertiary);
}

/* 状态分布 */
.dist-list { display: flex; flex-direction: column; gap: 12px; }
.dist-item { display: flex; flex-direction: column; gap: 4px; }
.dist-info { display: flex; align-items: center; gap: 8px; }
.dist-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.dist-label { font-size: 0.8125rem; color: var(--text-secondary); flex: 1; }
.dist-val { font-size: 0.875rem; font-weight: 600; color: var(--text-primary); font-variant-numeric: tabular-nums; }
.dist-bar-wrap { height: 6px; background: var(--bg-surface-hover); border-radius: 3px; overflow: hidden; }
.dist-bar {
  height: 100%;
  border-radius: 3px;
  transition: width 0.8s var(--ease-out);
  background: linear-gradient(90deg, var(--bg, transparent), currentColor);
}

/* 优先级 */
.pri-row { display: flex; flex-direction: column; gap: 12px; }
.pri-item { display: flex; flex-direction: column; gap: 6px; }
.pri-bar-wrap { height: 8px; background: var(--bg-surface-hover); border-radius: 4px; overflow: hidden; }
.pri-bar {
  height: 100%;
  border-radius: 4px;
  min-width: 4px;
  transition: width 1s var(--ease-out);
}
.pri-info { display: flex; justify-content: space-between; }
.pri-label { font-size: 0.8125rem; color: var(--text-secondary); }
.pri-val   { font-size: 0.8125rem; font-weight: 600; color: var(--text-primary); font-variant-numeric: tabular-nums; }

@media (max-width: 768px) {
  .kpi-grid { grid-template-columns: repeat(2, 1fr); }
  .chart-grid { grid-template-columns: 1fr; }
  .kpi-num { font-size: 1.75rem; }
}
</style>
