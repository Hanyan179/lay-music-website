<template>
  <head>
    <link rel="preconnect" href="https://fonts.gstatic.com/" crossorigin="" />
    <link
      rel="stylesheet"
      as="style"
      onload="this.rel='stylesheet'"
      href="https://fonts.googleapis.com/css2?display=swap&amp;family=Noto+Serif%3Awght%40400%3B500%3B700%3B900&amp;family=Noto+Sans%3Awght%40400%3B500%3B700%3B900"
    />
    <title>Fate Echoes</title>
    <link rel="icon" type="image/x-icon" href="data:image/x-icon;base64," />
  </head>
  <div class="relative flex size-full min-h-screen flex-col bg-[#FFFFFF] group/design-root overflow-x-hidden" style='font-family: system-ui, -apple-system, sans-serif;'>
    <div class="layout-container flex h-full grow flex-col">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="max-w-7xl mx-auto">
          <!-- 标题部分 -->
          <div class="mb-8">
            <h1 class="text-[#141414] text-3xl sm:text-4xl font-bold leading-tight">游览选择</h1>
          </div>

          <!-- 姓名和性别部分 -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <label class="flex flex-col">
              <span class="text-[#141414] text-base font-medium mb-2">被游览人姓名</span>
              <input
                v-model="formData.name"
                placeholder="闫涵"
                class="form-input w-full rounded-lg text-[#141414] bg-[#F0F2F5] border-none focus:ring-2 focus:ring-blue-500 h-14 px-4"
              />
            </label>
            <label class="flex flex-col">
              <span class="text-[#141414] text-base font-medium mb-2">性别</span>
              <select
                v-model="formData.gender"
                class="form-select w-full rounded-lg text-[#141414] bg-[#F0F2F5] border-none focus:ring-2 focus:ring-blue-500 h-14 px-4"
              >
                <option value="">请选择性别</option>
                <option value="male">男</option>
                <option value="female">女</option>
              </select>
            </label>
          </div>

          <!-- 出生日期和地址部分 -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <label class="flex flex-col">
              <span class="text-[#141414] text-base font-medium mb-2">出生日期</span>
              <select
                v-model="formData.birthYear"
                class="form-select w-full rounded-lg text-[#141414] bg-[#F0F2F5] border-none focus:ring-2 focus:ring-blue-500 h-14 px-4"
              >
                <option value="">请选择出生年份</option>
                <option v-for="year in birthYearRange" :key="year" :value="year">{{ year }}年</option>
              </select>
            </label>
            <label class="flex flex-col">
              <span class="text-[#141414] text-base font-medium mb-2">地址</span>
              <select
                v-model="formData.regionId"
                class="form-select w-full rounded-lg text-[#141414] bg-[#F0F2F5] border-none focus:ring-2 focus:ring-blue-500 h-14 px-4"
              >
                <option value="">请选择地区</option>
                <option v-for="region in regions" :key="region.id" :value="region.id">
                  {{ region.regionName }} ({{ region.regionType }})
                </option>
              </select>
            </label>
          </div>

          <!-- 属性部分 -->
          <div class="space-y-6">
            <template v-for="(attribute, index) in attributes" :key="index">
              <div class="bg-gray-50 rounded-lg p-6">
                <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div class="flex items-center gap-2 w-full sm:w-auto relative group">
                    <h3 class="text-[#141414] text-lg font-bold">{{ attribute.name }}</h3>
                    <span class="cursor-help text-gray-500 hover:text-gray-700">?
                      <div class="invisible group-hover:visible absolute left-0 mt-1 w-64 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-20 pointer-events-none transform -translate-y-full">
                        {{ attribute.tooltip }}
                        <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
                      </div>
                    </span>
                  </div>
                  <div class="flex items-center gap-4 w-full sm:w-2/3">
                    <div class="relative flex-1">
                      <div class="h-2 bg-[#DBE1E6] rounded-full">
                        <div
                          class="h-full bg-[#359EFF] rounded-full transition-all duration-200"
                          :style="{ width: (attribute.value / 10 * 100) + '%' }"
                        ></div>
                      </div>
                      <input
                        type="range"
                        v-model.number="attribute.value"
                        :max="10"
                        min="0"
                        @input="updateAttributeValue(index)"
                        class="absolute inset-0 w-full opacity-0 cursor-pointer"
                        :disabled="attribute.name === '机遇感知'"
                      />
                    </div>
                    <span class="text-[#141414] font-medium w-12 text-center">
                      {{ attribute.name === '机遇感知' ? '?' : attribute.value }}
                    </span>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <!-- 点数信息 -->
          <div class="mt-6 bg-gray-100 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <span class="text-gray-600">可分配点数上限：{{ maxTotalPoints }}</span>
            <span class="text-gray-600">已分配点数：{{ calculateTotalPoints() }}</span>
          </div>

          <!-- 按钮部分 -->
          <div class="mt-8 flex flex-col sm:flex-row justify-end gap-4">
            <button
              @click="randomizeAll"
              class="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
            >
              随机
            </button>
            <button
              @click="resetAll"
              class="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
            >
              重置
            </button>
            <button
              @click="submitForm"
              class="px-6 py-2 bg-[#359EFF] hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              确认
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

// 配置 axios 默认值
axios.defaults.baseURL = 'http://localhost:8080'
axios.defaults.withCredentials = true

const currentYear = new Date().getFullYear()
const birthYearRange = computed(() => {
  const years = []
  for (let year = 1980; year <= currentYear; year++) {
    years.push(year)
  }
  return years.reverse() // 从新到旧排序
})
const regions = ref([])
const maxTotalPoints = ref(0) // 初始值设为0

const formData = ref({
  name: '',
  birthYear: '',
  regionId: '',
  gender: ''
})

// 示例名字库
const sampleNames = [
  '张三', '李四', '王五', '赵六', '孙七', '周八', '吴九', '郑十',
  '陈一', '杨二', '刘明', '黄亮', '朱强', '钱伟', '孙芳', '李玉',
  '王静', '张华', '刘芳', '陈明'
]

const attributes = ref([
  { name: '家世基础', value: 0, tooltip: '决定你出生时的家庭背景和社会地位', showTooltip: false },
  { name: '形象资质', value: 4, tooltip: '影响你的外貌和个人魅力', showTooltip: false },
  { name: '身体机能', value: 1, tooltip: '决定你的体能和健康状况', showTooltip: false },
  { name: '学习天赋', value: 0, tooltip: '影响你的学习能力和知识获取速度', showTooltip: false },
  { name: '机遇感知', value: 0, tooltip: '决定你遇到机会的概率和对机会的把握能力', showTooltip: false }
])

const showTooltip = (index) => {
  attributes.value[index].showTooltip = true
}

const hideTooltip = (index) => {
  attributes.value[index].showTooltip = false
}

const updateAttributeValue = (index) => {
  const attr = attributes.value[index]
  if (attr.name === '机遇感知') {
    return // 不处理机遇感知
  }

  // 确保不超过10
  if (attr.value > 10) {
    attr.value = 10
  }

  // 确保总点数不超过上限
  const totalPoints = calculateTotalPoints()
  if (totalPoints > maxTotalPoints.value) {
    attr.value -= (totalPoints - maxTotalPoints.value)
  }
}

// 生成随机整数
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// 生成随机分配的点数，确保总和等于目标值且每个值不超过10
const generateRandomPoints = (total, count) => {
  const points = new Array(count).fill(0)
  let remaining = total

  // 如果总点数大于所有属性最大值之和，则无法分配
  if (total > count * 10) {
    return points.map(() => 10) // 返回全部10
  }

  // 先确保每个属性都能分配到点数
  for (let i = 0; i < count - 1; i++) {
    // 计算剩余属性数量
    const remainingSlots = count - i - 1
    // 计算当前属性最大可分配点数
    const maxForCurrent = Math.min(10, remaining - remainingSlots)
    // 为当前属性分配一个随机值
    const value = getRandomInt(0, maxForCurrent)
    points[i] = value
    remaining -= value
  }

  // 最后一个属性分配剩余的所有点数（不超过10）
  points[count - 1] = Math.min(10, remaining)

  // 如果最后一个属性超过10，需要重新分配
  if (points[count - 1] > 10) {
    return generateRandomPoints(total, count) // 递归重试
  }

  // 随机打乱数组
  for (let i = points.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [points[i], points[j]] = [points[j], points[i]]
  }

  return points
}

// 计算除机遇感知外的总点数
const calculateTotalPoints = () => {
  return attributes.value
    .filter(attr => attr.name !== '机遇感知')
    .reduce((sum, attr) => sum + Number(attr.value), 0)
}

// 重置所有字段（除机遇感知外）
const resetAll = () => {
  formData.value = {
    name: '',
    birthYear: '',
    regionId: '',
    gender: ''
  }
  maxTotalPoints.value = 0 // 重置可分配点数上限
  attributes.value.forEach(attr => {
    if (attr.name !== '机遇感知') {
      attr.value = 0
    }
  })
}

// 随机生成所有字段（除机遇感知外）
const randomizeAll = () => {
  // 随机姓名
  formData.value.name = sampleNames[Math.floor(Math.random() * sampleNames.length)]

  // 随机性别
  formData.value.gender = Math.random() < 0.5 ? 'male' : 'female'

  // 随机年份
  formData.value.birthYear = getRandomInt(1980, currentYear)

  // 随机地区
  if (regions.value.length > 0) {
    const randomRegion = regions.value[Math.floor(Math.random() * regions.value.length)]
    formData.value.regionId = randomRegion.id
  }

  // 随机生成可分配点数上限 (0-40)
  maxTotalPoints.value = getRandomInt(0, 40)

  // 随机分配属性点数（除机遇感知外）
  const attributesCount = attributes.value.length - 1 // 减去机遇感知
  const randomPoints = generateRandomPoints(maxTotalPoints.value, attributesCount)

  // 分配点数给除机遇感知外的属性
  let index = 0
  attributes.value.forEach(attr => {
    if (attr.name !== '机遇感知') {
      attr.value = randomPoints[index++]
    }
  })
}

const submitForm = () => {
  // 提交表单逻辑
  console.log('提交表单', {
    ...formData.value,
    attributes: attributes.value
  })
}

onMounted(async () => {
  try {
    const response = await axios.get('/fate-echoes/api/v1/regions')
    regions.value = response.data
  } catch (error) {
    console.error('获取地区列表失败:', error)
  }
})

// 在head中动态添加TailwindCSS
onMounted(() => {
  const script = document.createElement('script')
  script.src = 'https://cdn.tailwindcss.com/3.4.16?plugins=forms@0.5.9,container-queries@0.1.1'
  document.head.appendChild(script)
})
</script>

<style scoped>
input[type="range"] {
  -webkit-appearance: none;
  width: 100%;
  height: 100%;
  background: transparent;
  cursor: pointer;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #359EFF;
  cursor: pointer;
  margin-top: -6px;
}

input[type="range"]::-moz-range-thumb {
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #359EFF;
  cursor: pointer;
  border: none;
}

.form-input:focus, .form-select:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(53, 158, 255, 0.2);
}

/* Tooltip 动画 */
.group-hover\:visible {
  transition: all 0.2s ease-in-out;
}

.invisible {
  opacity: 0;
  visibility: hidden;
}

.group:hover .group-hover\:visible {
  opacity: 1;
  visibility: visible;
}
</style>
