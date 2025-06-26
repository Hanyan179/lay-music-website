// LAY音乐网站 - API接口测试脚本

const API_BASE = 'http://localhost:8081';

// 测试结果存储
let testResults = [];
let authToken = '';

// 添加测试结果
const addTestResult = (name, success, message, data = null) => {
  testResults.push({
    name,
    success,
    message,
    data,
    timestamp: new Date().toISOString()
  });
  
  const status = success ? '✅' : '❌';
  console.log(`${status} ${name}: ${message}`);
  if (data) {
    console.log('   数据:', JSON.stringify(data, null, 2));
  }
};

// 测试登录API
const testLogin = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'LayMusic@2025'
      })
    });

    const result = await response.json();
    
    if (result.code === 200 && result.data && result.data.token) {
      authToken = result.data.token;
      addTestResult('管理员登录', true, '登录成功', {
        token: result.data.token.substring(0, 20) + '...',
        userInfo: result.data.userInfo
      });
      return true;
    } else {
      addTestResult('管理员登录', false, result.message || '登录失败');
      return false;
    }
  } catch (error) {
    addTestResult('管理员登录', false, `网络错误: ${error.message}`);
    return false;
  }
};

// 测试用户列表API
const testGetUsers = async () => {
  if (!authToken) {
    addTestResult('获取用户列表', false, '需要先登录');
    return false;
  }

  try {
    const response = await fetch(`${API_BASE}/api/admin/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    });

    const result = await response.json();
    
    if (result.code === 200) {
      addTestResult('获取用户列表', true, `成功获取${result.data.length}个用户`, {
        userCount: result.data.length,
        users: result.data.map(u => ({ id: u.id, username: u.username, role: u.role }))
      });
      return true;
    } else {
      addTestResult('获取用户列表', false, result.message || '获取失败');
      return false;
    }
  } catch (error) {
    addTestResult('获取用户列表', false, `网络错误: ${error.message}`);
    return false;
  }
};

// 测试添加用户API
const testAddUser = async () => {
  if (!authToken) {
    addTestResult('添加用户', false, '需要先登录');
    return false;
  }

  const testUser = {
    username: `test_user_${Date.now()}`,
    password: 'test123456',
    realName: '测试用户',
    email: 'test@example.com',
    role: 'USER'
  };

  try {
    const response = await fetch(`${API_BASE}/api/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(testUser)
    });

    const result = await response.json();
    
    if (result.code === 200) {
      addTestResult('添加用户', true, '用户添加成功', {
        userId: result.data.id,
        username: result.data.username
      });
      return result.data.id;
    } else {
      addTestResult('添加用户', false, result.message || '添加失败');
      return false;
    }
  } catch (error) {
    addTestResult('添加用户', false, `网络错误: ${error.message}`);
    return false;
  }
};

// 测试更新用户API
const testUpdateUser = async (userId) => {
  if (!authToken || !userId) {
    addTestResult('更新用户', false, '需要先登录并提供用户ID');
    return false;
  }

  const updateData = {
    realName: '更新测试用户',
    email: 'updated@example.com',
    role: 'ADMIN',
    status: 1
  };

  try {
    const response = await fetch(`${API_BASE}/api/admin/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(updateData)
    });

    const result = await response.json();
    
    if (result.code === 200) {
      addTestResult('更新用户', true, '用户更新成功', updateData);
      return true;
    } else {
      addTestResult('更新用户', false, result.message || '更新失败');
      return false;
    }
  } catch (error) {
    addTestResult('更新用户', false, `网络错误: ${error.message}`);
    return false;
  }
};

// 测试删除用户API
const testDeleteUser = async (userId) => {
  if (!authToken || !userId) {
    addTestResult('删除用户', false, '需要先登录并提供用户ID');
    return false;
  }

  try {
    const response = await fetch(`${API_BASE}/api/admin/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    });

    const result = await response.json();
    
    if (result.code === 200) {
      addTestResult('删除用户', true, '用户删除成功');
      return true;
    } else {
      addTestResult('删除用户', false, result.message || '删除失败');
      return false;
    }
  } catch (error) {
    addTestResult('删除用户', false, `网络错误: ${error.message}`);
    return false;
  }
};

// 测试服务连接
const testConnection = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/admin/login`, {
      method: 'GET'
    });
    
    if (response.status === 200 || response.status === 405) {
      addTestResult('服务连接', true, '后端服务正常运行');
      return true;
    } else {
      addTestResult('服务连接', false, `服务响应异常: ${response.status}`);
      return false;
    }
  } catch (error) {
    addTestResult('服务连接', false, `连接失败: ${error.message}`);
    return false;
  }
};

// 运行完整测试套件
const runFullTest = async () => {
  console.log('🚀 开始运行LAY音乐网站API测试套件...\n');
  
  // 1. 测试服务连接
  console.log('📡 测试服务连接...');
  const connectionOk = await testConnection();
  
  if (!connectionOk) {
    console.log('\n❌ 服务连接失败，停止测试');
    return;
  }
  
  // 2. 测试登录
  console.log('\n🔐 测试登录功能...');
  const loginOk = await testLogin();
  
  if (!loginOk) {
    console.log('\n❌ 登录失败，停止测试');
    return;
  }
  
  // 3. 测试用户管理
  console.log('\n👥 测试用户管理功能...');
  await testGetUsers();
  
  const newUserId = await testAddUser();
  if (newUserId) {
    await testUpdateUser(newUserId);
    await testDeleteUser(newUserId);
  }
  
  // 4. 显示测试结果
  console.log('\n📊 测试结果汇总:');
  console.log('=====================================');
  
  const successCount = testResults.filter(r => r.success).length;
  const totalCount = testResults.length;
  
  console.log(`总测试数: ${totalCount}`);
  console.log(`成功: ${successCount}`);
  console.log(`失败: ${totalCount - successCount}`);
  console.log(`成功率: ${((successCount / totalCount) * 100).toFixed(1)}%`);
  
  console.log('\n详细结果:');
  testResults.forEach((result, index) => {
    const status = result.success ? '✅' : '❌';
    console.log(`${index + 1}. ${status} ${result.name}`);
    if (!result.success) {
      console.log(`   错误: ${result.message}`);
    }
  });
  
  console.log('\n🎵 LAY音乐网站API测试完成！');
  
  if (successCount === totalCount) {
    console.log('🎉 所有测试通过！前后端连接正常！');
  } else {
    console.log('⚠️ 部分测试失败，请检查相关功能');
  }
};

// 如果是在Node.js环境中运行
if (typeof window === 'undefined') {
  // Node.js环境需要安装node-fetch
  const fetch = require('node-fetch');
  runFullTest();
} else {
  // 浏览器环境
  window.runAPITest = runFullTest;
  console.log('API测试脚本已加载，请调用 runAPITest() 开始测试');
}

// 导出函数供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testLogin,
    testGetUsers,
    testAddUser,
    testUpdateUser,
    testDeleteUser,
    testConnection,
    runFullTest
  };
} 