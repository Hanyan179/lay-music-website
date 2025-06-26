import { ref, computed } from 'vue'
import { languages, type LanguageCode, type LanguageData } from '@/data/languages'

// 全局语言状态
const currentLanguage = ref<LanguageCode>('zh-CN')

// 从 localStorage 恢复语言设置 (处理 SSR 环境)
if (typeof window !== 'undefined') {
  const savedLanguage = localStorage.getItem('preferred-language') as LanguageCode
  if (savedLanguage && languages[savedLanguage]) {
    currentLanguage.value = savedLanguage
  }
}

export function useLanguage() {
  // 当前语言的数据
  const currentLanguageData = computed<LanguageData>(() => {
    return languages[currentLanguage.value]
  })
  
  // 切换语言
  const setLanguage = (language: LanguageCode) => {
    currentLanguage.value = language
    
    // 保存到 localStorage (处理 SSR 环境)
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-language', language)
      
      // 更新 HTML 的 lang 属性
      const htmlElement = document.documentElement
      const langMap: Record<LanguageCode, string> = {
        'zh-CN': 'zh-CN',
        'en-US': 'en-US', 
        'ko-KR': 'ko-KR'
      }
      htmlElement.setAttribute('lang', langMap[language])
    }
  }
  
  // 获取翻译文本的便捷方法
  const t = (path: string) => {
    const keys = path.split('.')
    let result: any = currentLanguageData.value
    
    for (const key of keys) {
      result = result?.[key]
      if (result === undefined) {
        console.warn(`Translation key "${path}" not found for language "${currentLanguage.value}"`)
        return path // 返回原始路径作为兜底
      }
    }
    
    return result
  }
  
  return {
    currentLanguage: computed(() => currentLanguage.value),
    currentLanguageData,
    setLanguage,
    t
  }
} 