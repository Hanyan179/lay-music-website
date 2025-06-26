<template>
  <div class="refraction-demo">
    <!-- 折射光背景效果 -->
    <RefractionLight 
      :disabled="settings.disabled"
      :auto-effect="settings.autoEffect"
      :distortion-strength="settings.distortionStrength"
      :animation-speed="settings.animationSpeed"
      :background-opacity="settings.backgroundOpacity"
      :effect-interval="settings.effectInterval"
    />
    
    <!-- 主要内容区域 -->
    <div class="content-overlay">
      <!-- 标题区域 -->
      <header class="demo-header">
        <h1 class="demo-title">✨ 动态折射光效果演示</h1>
        <p class="demo-subtitle">基于 Three.js 的 GLSL 着色器技术实现</p>
        
        <!-- 返回按钮 -->
        <router-link to="/" class="back-button">
          ← 返回首页
        </router-link>
      </header>

      <!-- 控制面板 -->
      <div class="control-panel" :class="{ 'panel-hidden': !showControls }">
        <div class="panel-header">
          <h3>🎛️ 效果控制</h3>
          <button 
            class="toggle-button" 
            @click="showControls = !showControls"
          >
            {{ showControls ? '隐藏' : '显示' }}
          </button>
        </div>
        
        <div class="controls" v-show="showControls">
          <!-- 基础开关 -->
          <div class="control-group">
            <label class="switch">
              <input type="checkbox" v-model="settings.disabled">
              <span class="slider">禁用效果</span>
            </label>
            
            <label class="switch">
              <input type="checkbox" v-model="settings.autoEffect">
              <span class="slider">自动变化</span>
            </label>
          </div>

          <!-- 数值控制 -->
          <div class="control-group">
            <div class="range-control">
              <label>折射强度: {{ settings.distortionStrength.toFixed(2) }}</label>
              <input 
                type="range" 
                v-model.number="settings.distortionStrength"
                min="0.01" 
                max="0.5" 
                step="0.01"
                class="range-slider"
              >
            </div>
            
            <div class="range-control">
              <label>动画速度: {{ settings.animationSpeed.toFixed(1) }}x</label>
              <input 
                type="range" 
                v-model.number="settings.animationSpeed"
                min="0.1" 
                max="3.0" 
                step="0.1"
                class="range-slider"
              >
            </div>
            
            <div class="range-control">
              <label>背景透明度: {{ (settings.backgroundOpacity * 100).toFixed(0) }}%</label>
              <input 
                type="range" 
                v-model.number="settings.backgroundOpacity"
                min="0.1" 
                max="1.0" 
                step="0.05"
                class="range-slider"
              >
            </div>
            
            <div class="range-control">
              <label>变化间隔: {{ (settings.effectInterval / 1000).toFixed(1) }}s</label>
              <input 
                type="range" 
                v-model.number="settings.effectInterval"
                min="1000" 
                max="10000" 
                step="500"
                class="range-slider"
              >
            </div>
          </div>

          <!-- 预设按钮 -->
          <div class="preset-buttons">
            <h4>预设效果</h4>
            <div class="preset-grid">
              <button @click="applyPreset('gentle')" class="preset-btn">温和</button>
              <button @click="applyPreset('dynamic')" class="preset-btn">动感</button>
              <button @click="applyPreset('intense')" class="preset-btn">强烈</button>
              <button @click="applyPreset('minimal')" class="preset-btn">极简</button>
            </div>
          </div>

          <!-- 重置按钮 -->
          <div class="action-buttons">
            <button @click="resetSettings" class="reset-btn">重置设置</button>
          </div>
        </div>
      </div>

      <!-- 信息展示区域 -->
      <div class="info-section">
        <div class="info-card">
          <h3>🌟 技术特点</h3>
          <ul>
            <li>GLSL 自定义着色器</li>
            <li>动态纹理生成</li>
            <li>鼠标交互响应</li>
            <li>噪声函数扭曲</li>
            <li>实时光效渲染</li>
          </ul>
        </div>
        
        <div class="info-card">
          <h3>🎨 效果说明</h3>
          <ul>
            <li>移动鼠标查看交互效果</li>
            <li>折射强度控制扭曲程度</li>
            <li>动画速度影响变化频率</li>
            <li>自动模式随机变化效果</li>
            <li>支持实时参数调整</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import RefractionLight from '@/components/RefractionLight.vue'

// 控制面板显示状态
const showControls = ref(true)

// 效果设置
const settings = reactive({
  disabled: false,
  autoEffect: true,
  distortionStrength: 0.08, // 更微妙的扭曲
  animationSpeed: 0.8,
  backgroundOpacity: 0.3, // 更透明
  effectInterval: 8000 // 更慢的变化
})

// 预设效果
const presets = {
  gentle: {
    distortionStrength: 0.08,
    animationSpeed: 0.6,
    backgroundOpacity: 0.6,
    effectInterval: 8000
  },
  dynamic: {
    distortionStrength: 0.2,
    animationSpeed: 1.5,
    backgroundOpacity: 0.9,
    effectInterval: 3000
  },
  intense: {
    distortionStrength: 0.4,
    animationSpeed: 2.5,
    backgroundOpacity: 1.0,
    effectInterval: 2000
  },
  minimal: {
    distortionStrength: 0.05,
    animationSpeed: 0.3,
    backgroundOpacity: 0.3,
    effectInterval: 10000
  }
}

// 应用预设
const applyPreset = (presetName: keyof typeof presets) => {
  const preset = presets[presetName]
  Object.assign(settings, preset)
}

// 重置设置
const resetSettings = () => {
  Object.assign(settings, {
    disabled: false,
    autoEffect: true,
    distortionStrength: 0.08,
    animationSpeed: 0.8,
    backgroundOpacity: 0.3,
    effectInterval: 8000
  })
}
</script>

<style scoped>
.refraction-demo {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  font-family: 'Microsoft YaHei', sans-serif;
}

.content-overlay {
  position: relative;
  z-index: 10;
  padding: 2rem;
  height: 100vh;
  overflow-y: auto;
}

/* 标题区域 */
.demo-header {
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
}

.demo-title {
  font-size: 3rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(45deg, #4f46e5, #06b6d4, #10b981);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 30px rgba(79, 70, 229, 0.5);
}

.demo-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0.5rem 0 0 0;
}

.back-button {
  position: absolute;
  top: 0;
  left: 0;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

/* 控制面板 */
.control-panel {
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  backdrop-filter: blur(20px);
  transition: all 0.3s ease;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.panel-header h3 {
  color: white;
  margin: 0;
  font-size: 1.2rem;
}

.toggle-button {
  padding: 0.5rem 1rem;
  background: rgba(79, 70, 229, 0.8);
  border: none;
  border-radius: 15px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle-button:hover {
  background: rgba(79, 70, 229, 1);
  transform: scale(1.05);
}

.controls {
  display: grid;
  gap: 1.5rem;
}

.control-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

/* 开关控件 */
.switch {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  cursor: pointer;
}

.switch input {
  width: 50px;
  height: 25px;
  appearance: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  position: relative;
  transition: all 0.3s ease;
}

.switch input:checked {
  background: #4f46e5;
}

.switch input::before {
  content: '';
  position: absolute;
  width: 21px;
  height: 21px;
  border-radius: 50%;
  background: white;
  top: 2px;
  left: 2px;
  transition: all 0.3s ease;
}

.switch input:checked::before {
  transform: translateX(25px);
}

/* 滑块控件 */
.range-control {
  flex: 1;
  min-width: 200px;
}

.range-control label {
  display: block;
  color: white;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.range-slider {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  outline: none;
  appearance: none;
}

.range-slider::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #4f46e5;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(79, 70, 229, 0.5);
}

.range-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #4f46e5;
  cursor: pointer;
  border: none;
  box-shadow: 0 0 10px rgba(79, 70, 229, 0.5);
}

/* 预设按钮 */
.preset-buttons h4 {
  color: white;
  margin: 0 0 0.5rem 0;
}

.preset-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 0.5rem;
}

.preset-btn {
  padding: 0.75rem;
  background: rgba(16, 185, 129, 0.8);
  border: none;
  border-radius: 10px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.preset-btn:hover {
  background: rgba(16, 185, 129, 1);
  transform: translateY(-2px);
}

/* 重置按钮 */
.reset-btn {
  padding: 0.75rem 1.5rem;
  background: rgba(239, 68, 68, 0.8);
  border: none;
  border-radius: 15px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  background: rgba(239, 68, 68, 1);
  transform: scale(1.05);
}

/* 信息区域 */
.info-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.info-card {
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
}

.info-card h3 {
  color: white;
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
}

.info-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-card li {
  color: rgba(255, 255, 255, 0.8);
  padding: 0.3rem 0;
  padding-left: 1.5rem;
  position: relative;
}

.info-card li::before {
  content: '✦';
  position: absolute;
  left: 0;
  color: #4f46e5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content-overlay {
    padding: 1rem;
  }
  
  .demo-title {
    font-size: 2rem;
  }
  
  .control-group {
    flex-direction: column;
  }
  
  .back-button {
    position: relative;
    margin-bottom: 1rem;
  }
  
  .demo-header {
    text-align: left;
  }
}

@media (max-width: 480px) {
  .demo-title {
    font-size: 1.5rem;
  }
  
  .range-control {
    min-width: 100%;
  }
  
  .preset-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style> 