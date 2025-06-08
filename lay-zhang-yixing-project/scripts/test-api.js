#!/usr/bin/env node

/**
 * 简单的API连接测试
 */

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

async function testConnection() {
    console.log('🔍 测试后端连接...');
    
    try {
        // 测试根路径
        console.log('1. 测试根路径...');
        const rootResponse = await axios.get(`${API_BASE_URL}/`);
        console.log('✅ 根路径访问成功');
        
        // 测试API路径
        console.log('2. 测试API路径...');
        const apiResponse = await axios.get(`${API_BASE_URL}/api`);
        console.log('✅ API路径访问成功');
        
        // 测试H2控制台
        console.log('3. 测试H2控制台...');
        const h2Response = await axios.get(`${API_BASE_URL}/h2-console`);
        console.log('✅ H2控制台访问成功');
        
        console.log('\n🎉 后端服务运行正常！');
        console.log('📊 可以访问 H2 数据库控制台: http://localhost:8080/h2-console');
        
    } catch (error) {
        console.log('❌ 连接测试失败:');
        console.log('   错误信息:', error.message);
        
        if (error.code === 'ECONNREFUSED') {
            console.log('🔧 解决方案:');
            console.log('   1. 检查后端服务是否正在运行');
            console.log('   2. 确认端口8080没有被其他程序占用');
            console.log('   3. 重新启动后端服务');
        }
    }
}

testConnection(); 