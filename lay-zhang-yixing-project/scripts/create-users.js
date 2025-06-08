#!/usr/bin/env node

/**
 * LAY张艺兴音乐网站 - 用户数据生成脚本
 * 使用方法：
 * 1. 单个用户：node create-users.js --username admin2 --password 123456 --realName "管理员2"
 * 2. 批量创建：node create-users.js --batch --file users.json
 * 3. 快速生成：node create-users.js --generate 5
 */

import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES模块中获取__dirname的替代方法
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置
const API_BASE_URL = 'http://localhost:8080/api';
const ADMIN_TOKEN = 'LAY-JWT-TOKEN-' + Date.now(); // 实际使用时需要真实的token

// 命令行参数解析
const args = process.argv.slice(2);
const params = {};
for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
        const key = args[i].substring(2);
        if (i + 1 < args.length && !args[i + 1].startsWith('--')) {
            params[key] = args[i + 1];
            i++;
        } else {
            params[key] = true;
        }
    }
}

/**
 * 创建HTTP客户端
 */
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ADMIN_TOKEN}`
    }
});

/**
 * 创建单个用户
 */
async function createUser(userData) {
    try {
        console.log(`正在创建用户: ${userData.username}`);
        
        const response = await apiClient.post('/admin/users', userData);
        
        if (response.data.code === 200) {
            console.log(`✅ 用户创建成功: ${userData.username}`);
            return { success: true, data: response.data.data };
        } else {
            console.log(`❌ 用户创建失败: ${userData.username} - ${response.data.message}`);
            return { success: false, error: response.data.message };
        }
    } catch (error) {
        console.log(`❌ 用户创建异常: ${userData.username} - ${error.message}`);
        return { success: false, error: error.message };
    }
}

/**
 * 批量创建用户
 */
async function batchCreateUsers(userList) {
    try {
        console.log(`正在批量创建 ${userList.length} 个用户...`);
        
        const response = await apiClient.post('/admin/users/batch', {
            users: userList
        });
        
        if (response.data.code === 200) {
            const { successCount, errorCount, errors } = response.data.data;
            console.log(`✅ 批量创建完成: 成功 ${successCount} 个, 失败 ${errorCount} 个`);
            
            if (errors && errors.length > 0) {
                console.log('❌ 失败详情:');
                errors.forEach(error => console.log(`   ${error}`));
            }
            
            return { success: true, data: response.data.data };
        } else {
            console.log(`❌ 批量创建失败: ${response.data.message}`);
            return { success: false, error: response.data.message };
        }
    } catch (error) {
        console.log(`❌ 批量创建异常: ${error.message}`);
        return { success: false, error: error.message };
    }
}

/**
 * 生成随机用户数据
 */
function generateRandomUsers(count) {
    const users = [];
    const departments = ['技术部', '产品部', '运营部', '市场部', '设计部'];
    const positions = ['开发工程师', '产品经理', '运营专员', '市场专员', 'UI设计师'];
    
    for (let i = 1; i <= count; i++) {
        const user = {
            username: `user${String(i).padStart(3, '0')}`,
            password: `password${i}`,
            realName: `用户${i}`,
            email: `user${i}@laymusic.com`,
            department: departments[Math.floor(Math.random() * departments.length)],
            position: positions[Math.floor(Math.random() * positions.length)],
            role: 'USER'
        };
        users.push(user);
    }
    
    return users;
}

/**
 * 从JSON文件读取用户数据
 */
function readUsersFromFile(filePath) {
    try {
        const fullPath = path.resolve(filePath);
        if (!fs.existsSync(fullPath)) {
            console.log(`❌ 文件不存在: ${fullPath}`);
            return null;
        }
        
        const fileContent = fs.readFileSync(fullPath, 'utf8');
        const data = JSON.parse(fileContent);
        
        if (Array.isArray(data)) {
            return data;
        } else if (data.users && Array.isArray(data.users)) {
            return data.users;
        } else {
            console.log('❌ 文件格式错误，应该是用户数组或包含users字段的对象');
            return null;
        }
    } catch (error) {
        console.log(`❌ 读取文件失败: ${error.message}`);
        return null;
    }
}

/**
 * 创建示例用户数据文件
 */
function createSampleFile() {
    const sampleUsers = [
        {
            username: "test1",
            password: "123456",
            realName: "测试用户1",
            email: "test1@laymusic.com",
            department: "技术部",
            position: "开发工程师",
            role: "USER"
        },
        {
            username: "test2",
            password: "123456",
            realName: "测试用户2",
            email: "test2@laymusic.com",
            department: "产品部",
            position: "产品经理",
            role: "USER"
        }
    ];
    
    const filePath = 'sample-users.json';
    fs.writeFileSync(filePath, JSON.stringify(sampleUsers, null, 2));
    console.log(`✅ 示例文件已创建: ${filePath}`);
}

/**
 * 显示帮助信息
 */
function showHelp() {
    console.log(`
LAY张艺兴音乐网站 - 用户数据生成脚本

使用方法:
  单个用户创建:
    node create-users.js --username <用户名> --password <密码> --realName <真实姓名> [选项]

  批量创建 (从文件):
    node create-users.js --batch --file <JSON文件路径>

  快速生成随机用户:
    node create-users.js --generate <数量>

  创建示例文件:
    node create-users.js --sample

参数说明:
  --username      用户名 (必填)
  --password      密码 (必填)
  --realName      真实姓名 (必填)
  --email         邮箱 (可选)
  --department    部门 (可选)
  --position      职位 (可选)
  --role          角色 (可选, 默认USER)
  --batch         批量模式
  --file          JSON文件路径
  --generate      生成随机用户数量
  --sample        创建示例文件
  --help          显示帮助

示例:
  node create-users.js --username admin2 --password 123456 --realName "管理员2" --email admin2@laymusic.com
  node create-users.js --batch --file users.json
  node create-users.js --generate 10
  node create-users.js --sample
`);
}

/**
 * 主函数
 */
async function main() {
    console.log('🎵 LAY张艺兴音乐网站 - 用户数据生成脚本');
    console.log('='.repeat(50));
    
    // 显示帮助
    if (params.help || Object.keys(params).length === 0) {
        showHelp();
        return;
    }
    
    // 创建示例文件
    if (params.sample) {
        createSampleFile();
        return;
    }
    
    // 快速生成随机用户
    if (params.generate) {
        const count = parseInt(params.generate);
        if (isNaN(count) || count <= 0) {
            console.log('❌ 生成数量必须是正整数');
            return;
        }
        
        const users = generateRandomUsers(count);
        const result = await batchCreateUsers(users);
        
        if (result.success) {
            console.log('🎉 随机用户生成完成！');
        }
        return;
    }
    
    // 批量创建
    if (params.batch) {
        if (!params.file) {
            console.log('❌ 批量模式需要指定 --file 参数');
            return;
        }
        
        const users = readUsersFromFile(params.file);
        if (!users) {
            return;
        }
        
        const result = await batchCreateUsers(users);
        
        if (result.success) {
            console.log('🎉 批量用户创建完成！');
        }
        return;
    }
    
    // 单个用户创建
    if (params.username && params.password && params.realName) {
        const userData = {
            username: params.username,
            password: params.password,
            realName: params.realName,
            email: params.email || '',
            department: params.department || '',
            position: params.position || '',
            role: params.role || 'USER'
        };
        
        const result = await createUser(userData);
        
        if (result.success) {
            console.log('🎉 用户创建完成！');
        }
        return;
    }
    
    console.log('❌ 参数不完整，请使用 --help 查看使用说明');
}

// 运行主函数
main().catch(error => {
    console.error('💥 脚本执行异常:', error.message);
    process.exit(1);
}); 