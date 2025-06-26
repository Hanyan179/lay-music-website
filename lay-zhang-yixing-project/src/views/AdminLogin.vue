<template>
  <div class="admin-login-container">
    <div class="login-box">
      <div class="login-header">
        <h1 class="login-title">后台管理系统</h1>
        <p class="login-subtitle">LAY 张艺兴音乐网站</p>
      </div>
      
      <div class="login-form">
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="username">用户名</label>
            <input 
              id="username"
              v-model="loginForm.username"
              type="text"
              placeholder="请输入用户名"
              required
              :disabled="loading"
              autocomplete="username"
              spellcheck="false"
            />
          </div>
          
          <div class="form-group">
            <label for="password">密码</label>
            <input 
              id="password"
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              required
              :disabled="loading"
              autocomplete="current-password"
              spellcheck="false"
            />
          </div>
          
          <div class="form-actions">
            <button 
              type="submit" 
              class="login-btn"
              :disabled="loading"
            >
              {{ loading ? '登录中...' : '登录' }}
            </button>
          </div>
        </form>
      </div>
      
      <div class="login-footer">
        <p>© 2024 Lay Zhang Music Project</p>
      </div>
    </div>
  </div>
</template>

<script>
import { adminLogin } from '@/api/admin'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'AdminLogin',
  setup() {
    const router = useRouter()
    const loading = ref(false)
    
    const loginForm = reactive({
      username: '',
      password: ''
    })
    
    const showNotification = (message, type = 'info') => {
      // 简单的通知实现
      alert(message)
    }
    
    const handleLogin = async () => {
      if (!loginForm.username || !loginForm.password) {
        showNotification('请输入用户名和密码', 'warning')
        return
      }
      
      loading.value = true
      
      try {
        const response = await adminLogin(loginForm)
        
        if (response.success) {
          // 保存token到localStorage
          localStorage.setItem('admin_token', response.data.token || 'temp_token')
          localStorage.setItem('admin_user', JSON.stringify(response.data.userInfo))
          
          showNotification('登录成功！正在跳转...', 'success')
          
          // 跳转到管理页面
          setTimeout(() => {
            router.push('/x-back/dashboard')
          }, 1000)
        } else {
          showNotification(response.message || '登录失败', 'error')
        }
      } catch (error) {
        console.error('登录错误:', error)
        showNotification('登录失败，请检查网络连接', 'error')
      } finally {
        loading.value = false
      }
    }
    
    return {
      loginForm,
      loading,
      handleLogin
    }
  }
}
</script>

<style scoped>
.admin-login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-box {
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.login-subtitle {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

.form-group input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.form-actions {
  margin-top: 30px;
}

.login-btn {
  width: 100%;
  padding: 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-btn:hover:not(:disabled) {
  background: #5a6fd8;
}

.login-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.login-footer {
  text-align: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.login-footer p {
  margin: 0;
  font-size: 12px;
  color: #999;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .admin-login-container {
    padding: 10px;
  }
  
  .login-box {
    padding: 30px 20px;
  }
  
  .login-title {
    font-size: 20px;
  }
}
</style> 