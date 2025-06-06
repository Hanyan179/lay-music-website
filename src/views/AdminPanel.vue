<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航 -->
    <nav class="apple-glass border-b border-white/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-4">
            <router-link
              to="/"
              class="apple-btn-secondary text-sm px-4 py-2"
            >
              ← 返回首页
            </router-link>
            <h1 class="text-xl font-bold text-gray-800">内容管理系统</h1>
          </div>
          <div class="flex items-center space-x-4">
            <button
              @click="currentView = 'books'"
              class="text-sm px-4 py-2 rounded-lg transition-colors"
              :class="{
                'bg-blue-100 text-blue-800': currentView === 'books',
                'text-gray-700 hover:bg-gray-100': currentView !== 'books'
              }"
            >
              书籍管理
            </button>
            <button
              @click="currentView = 'events'"
              class="text-sm px-4 py-2 rounded-lg transition-colors"
              :class="{
                'bg-blue-100 text-blue-800': currentView === 'events',
                'text-gray-700 hover:bg-gray-100': currentView !== 'events'
              }"
            >
              事件管理
            </button>
            <div class="text-sm text-gray-700">
              管理员面板
            </div>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 书籍管理视图 -->
      <div v-if="currentView === 'books'">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">书籍管理</h2>
          <button
            @click="showAddBookModal = true"
            class="apple-btn-primary px-4 py-2"
          >
            + 添加新书籍
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="book in books"
            :key="book.id"
            class="apple-card p-6"
          >
            <!-- 书籍封面 -->
            <div class="h-48 mb-4 rounded-lg overflow-hidden bg-gray-100">
              <SafeImage
                v-if="book.coverImage"
                :src="book.coverImage"
                :alt="book.title"
                class="w-full h-full object-cover"
                :width="300"
                :height="192"
                :fallback-text="book.title"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center text-gray-400"
              >
                <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            <!-- 书籍信息 -->
            <h3 class="text-lg font-bold text-gray-900 mb-2">{{ book.title }}</h3>
            <p class="text-sm text-gray-600 mb-2">{{ book.author }}</p>
            <p class="text-sm text-gray-500 mb-4">{{ book.startYear }} - {{ book.endYear }}</p>
            
            <!-- 统计信息 -->
            <div class="flex justify-between text-xs text-gray-500 mb-4">
              <span>{{ getEventCount(book.id) }} 事件</span>
              <span>{{ book.playCount }} 次游玩</span>
              <span>{{ book.likeCount }} 点赞</span>
            </div>

            <!-- 操作按钮 -->
            <div class="flex space-x-2">
              <button
                @click="editBook(book)"
                class="flex-1 apple-btn-secondary px-3 py-2 text-sm"
              >
                编辑
              </button>
              <button
                @click="selectBookForEvents(book)"
                class="flex-1 apple-btn-secondary px-3 py-2 text-sm"
              >
                管理事件
              </button>
              <button
                @click="deleteBookConfirm(book.id)"
                class="apple-btn text-red-600 hover:bg-red-50 px-3 py-2 text-sm"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 事件管理视图 -->
      <div v-else-if="currentView === 'events'">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <!-- 左侧：书籍选择 -->
          <div class="lg:col-span-1">
            <div class="apple-card p-6">
              <h2 class="text-lg font-bold text-gray-900 mb-4">选择书籍</h2>
              <div class="space-y-2">
                <div
                  v-for="book in books"
                  :key="book.id"
                  @click="selectBook(book)"
                  class="p-3 rounded-lg cursor-pointer transition-colors"
                  :class="{
                    'bg-blue-100 border-blue-500 border-2': selectedBook?.id === book.id,
                    'bg-gray-50 hover:bg-gray-100 border border-gray-200': selectedBook?.id !== book.id
                  }"
                >
                  <h3 class="font-medium text-gray-900">{{ book.title }}</h3>
                  <p class="text-sm text-gray-600">{{ book.author }}</p>
                  <div class="flex justify-between items-center mt-2">
                    <span class="text-xs text-gray-500">{{ book.startYear }} - {{ book.endYear }}</span>
                    <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {{ getEventCount(book.id) }} 事件
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧：事件管理 -->
          <div class="lg:col-span-3">
            <div v-if="!selectedBook" class="apple-card p-12 text-center">
              <div class="text-gray-400 mb-4">
                <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">选择一本书开始管理</h3>
              <p class="text-gray-600">从左侧列表中选择要编辑的书籍</p>
            </div>

            <div v-else>
              <!-- 书籍信息 -->
              <div class="apple-card p-6 mb-6">
                <div class="flex justify-between items-start">
                  <div>
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ selectedBook.title }}</h2>
                    <p class="text-gray-600 mb-4">{{ selectedBook.description }}</p>
                    <div class="flex items-center space-x-4 text-sm text-gray-500">
                      <span>作者：{{ selectedBook.author }}</span>
                      <span>时间段：{{ selectedBook.startYear }} - {{ selectedBook.endYear }}</span>
                    </div>
                  </div>
                  <button
                    @click="showAddEventModal = true"
                    class="apple-btn-primary px-4 py-2"
                  >
                    + 添加事件
                  </button>
                </div>
              </div>

              <!-- 事件列表 -->
              <div class="space-y-4">
                <div
                  v-for="event in currentEvents"
                  :key="event.id"
                  class="apple-card p-6"
                >
                  <div class="flex justify-between items-start mb-4">
                    <div class="flex-1">
                      <h3 class="text-lg font-bold text-gray-900 mb-2">{{ event.question }}</h3>
                      <p class="text-gray-600 mb-3">{{ event.description }}</p>
                      <div class="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                        <span>年份：{{ event.year }}</span>
                        <span>事件代码：{{ event.eventCode }}</span>
                        <span>选项数量：{{ event.options.length }}</span>
                        <span>排序：{{ event.displayOrder }}</span>
                      </div>
                    </div>
                    <div class="flex space-x-2">
                      <button
                        @click="editEvent(event)"
                        class="apple-btn-secondary px-3 py-1 text-sm"
                      >
                        编辑
                      </button>
                      <button
                        @click="deleteEvent(event.id)"
                        class="apple-btn text-red-600 hover:bg-red-50 px-3 py-1 text-sm"
                      >
                        删除
                      </button>
                    </div>
                  </div>

                  <!-- 事件图片 -->
                  <div v-if="event.mediaUrl" class="mb-4">
                    <img
                      :src="event.mediaUrl"
                      :alt="event.question"
                      class="w-32 h-24 object-cover rounded-lg border"
                    />
                  </div>

                  <!-- 选项列表 -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div
                      v-for="option in event.options"
                      :key="option.id"
                      class="p-3 border rounded-lg"
                      :class="{
                        'bg-green-50 border-green-200': option.isCorrect,
                        'bg-red-50 border-red-200': !option.isCorrect
                      }"
                    >
                      <div class="flex items-start justify-between">
                        <div class="flex-1">
                          <p class="font-medium text-gray-900 mb-1">{{ option.optionText }}</p>
                          <p class="text-sm text-gray-600">{{ option.effect }}</p>
                        </div>
                        <span
                          class="text-xs px-2 py-1 rounded"
                          :class="{
                            'bg-green-100 text-green-800': option.isCorrect,
                            'bg-red-100 text-red-800': !option.isCorrect
                          }"
                        >
                          {{ option.isCorrect ? '正确' : '错误' }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 空状态 -->
                <div v-if="currentEvents.length === 0" class="apple-card p-12 text-center">
                  <div class="text-gray-400 mb-4">
                    <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 class="text-xl font-semibold text-gray-900 mb-2">暂无事件</h3>
                  <p class="text-gray-600 mb-4">为这本书添加第一个事件</p>
                  <button
                    @click="showAddEventModal = true"
                    class="apple-btn-primary px-6 py-2"
                  >
                    添加事件
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加/编辑书籍模态框 -->
    <div v-if="showAddBookModal || editingBook" class="apple-modal">
      <div class="apple-modal-content max-w-4xl">
        <div class="flex justify-between items-center mb-8">
          <h3 class="text-2xl font-bold text-gray-900">
            {{ editingBook ? '编辑书籍' : '添加新书籍' }}
          </h3>
          <button
            @click="closeBookModal"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- 书籍表单 -->
        <form @submit.prevent="saveBook" class="space-y-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">书籍标题</label>
              <input
                v-model="bookForm.title"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="输入书籍标题"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">作者</label>
              <input
                v-model="bookForm.author"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="作者姓名"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">副标题</label>
            <input
              v-model="bookForm.subtitle"
              type="text"
              class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="书籍副标题"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">描述</label>
            <textarea
              v-model="bookForm.description"
              required
              rows="4"
              class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="描述这本书的主要内容"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">开始年份</label>
              <input
                v-model.number="bookForm.startYear"
                type="number"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1995"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">结束年份</label>
              <input
                v-model.number="bookForm.endYear"
                type="number"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="2025"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">主题色</label>
              <input
                v-model="bookForm.primaryColor"
                type="color"
                class="w-full h-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">书籍代码</label>
            <input
              v-model="bookForm.bookCode"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="my_book_code"
            />
          </div>

          <!-- 封面图片上传 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">封面图片</label>
            <div class="text-xs text-gray-500 mb-4">
              支持 JPG、PNG、GIF、WebP 格式，最大5MB
            </div>
            <div class="flex items-center space-x-6">
              <input
                ref="bookFileInput"
                type="file"
                accept="image/*"
                @change="handleBookImageUpload"
                class="hidden"
              />
              <button
                type="button"
                @click="bookFileInput?.click()"
                class="apple-btn-secondary px-6 py-3"
              >
                选择封面图片
              </button>
              <span v-if="bookForm.coverImage" class="text-sm text-gray-600">
                已选择图片
              </span>
            </div>
            <div v-if="bookForm.coverImage" class="mt-6">
              <img
                :src="bookForm.coverImage"
                alt="封面预览"
                class="w-40 h-50 object-cover rounded-lg border"
              />
            </div>
            
            <!-- 上传状态提示 -->
            <div v-if="bookUploadStatus.message" class="mt-6 p-6 rounded-lg border"
                 :class="{
                   'bg-blue-50 border-blue-200': bookUploadStatus.isUploading,
                   'bg-green-50 border-green-200': !bookUploadStatus.isUploading && !bookUploadStatus.message.includes('失败'),
                   'bg-red-50 border-red-200': bookUploadStatus.message.includes('失败')
                 }">
              <div class="flex items-start">
                <div class="flex-shrink-0 mr-4">
                  <div v-if="bookUploadStatus.isUploading" class="apple-loading"></div>
                  <svg v-else-if="!bookUploadStatus.message.includes('失败')" class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <svg v-else class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div class="flex-1">
                  <h4 class="text-sm font-medium" 
                      :class="{
                        'text-blue-800': bookUploadStatus.isUploading,
                        'text-green-800': !bookUploadStatus.isUploading && !bookUploadStatus.message.includes('失败'),
                        'text-red-800': bookUploadStatus.message.includes('失败')
                      }">
                    {{ bookUploadStatus.isUploading ? '正在上传图片' : (bookUploadStatus.message.includes('失败') ? '上传失败' : '上传成功') }}
                  </h4>
                  <p class="text-sm text-gray-600 mt-2">{{ bookUploadStatus.message }}</p>
                </div>
                <button
                  @click="clearBookUploadStatus"
                  class="ml-4 text-gray-400 hover:text-gray-600"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- 提交按钮 -->
          <div class="flex justify-end space-x-4 pt-8 border-t">
            <button
              type="button"
              @click="closeBookModal"
              class="apple-btn-secondary px-8 py-3"
            >
              取消
            </button>
            <button
              type="submit"
              class="apple-btn-primary px-8 py-3"
            >
              {{ editingBook ? '更新书籍' : '创建书籍' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 添加/编辑事件模态框 -->
    <div v-if="showAddEventModal || editingEvent" class="apple-modal">
      <div class="apple-modal-content max-w-6xl max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-8">
          <h3 class="text-2xl font-bold text-gray-900">
            {{ editingEvent ? '编辑事件' : '添加新事件' }}
          </h3>
          <button
            @click="closeEventModal"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- 事件表单 -->
        <form @submit.prevent="saveEvent" class="space-y-8">
          <!-- 基本信息 -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">事件标题</label>
              <input
                v-model="eventForm.question"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="输入事件标题"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">年份</label>
              <input
                v-model.number="eventForm.year"
                type="number"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1995"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">排序</label>
              <input
                v-model.number="eventForm.displayOrder"
                type="number"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">事件描述</label>
            <textarea
              v-model="eventForm.description"
              required
              rows="4"
              class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="描述这个事件的背景和情况"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">事件代码</label>
            <input
              v-model="eventForm.eventCode"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="EVENT_1995_BIRTH"
            />
          </div>

          <!-- 图片上传 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">事件图片</label>
            <div class="text-xs text-gray-500 mb-4">
              提示：上传后图片将保存为静态文件，保持原始画质。
            </div>
            <div class="flex items-center space-x-6">
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                @change="handleImageUpload"
                class="hidden"
              />
              <button
                type="button"
                @click="fileInput?.click()"
                class="apple-btn-secondary px-6 py-3"
              >
                选择图片
              </button>
              <span v-if="eventForm.mediaUrl" class="text-sm text-gray-600">
                已选择图片
              </span>
            </div>
            <div v-if="eventForm.mediaUrl" class="mt-6">
              <img
                :src="eventForm.mediaUrl"
                alt="预览"
                class="w-40 h-30 object-cover rounded-lg border"
              />
            </div>
            
            <!-- 上传状态提示 -->
            <div v-if="eventUploadStatus.message" class="mt-6 p-6 rounded-lg border"
                 :class="{
                   'bg-blue-50 border-blue-200': eventUploadStatus.isUploading,
                   'bg-green-50 border-green-200': !eventUploadStatus.isUploading && eventUploadStatus.targetPath,
                   'bg-red-50 border-red-200': !eventUploadStatus.isUploading && !eventUploadStatus.targetPath
                 }">
              <div class="flex items-start">
                <div class="flex-shrink-0 mr-4">
                  <div v-if="eventUploadStatus.isUploading" class="apple-loading"></div>
                  <svg v-else-if="eventUploadStatus.targetPath" class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <svg v-else class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div class="flex-1">
                  <h4 class="text-sm font-medium" 
                      :class="{
                        'text-blue-800': eventUploadStatus.isUploading,
                        'text-green-800': !eventUploadStatus.isUploading && eventUploadStatus.targetPath,
                        'text-red-800': !eventUploadStatus.isUploading && !eventUploadStatus.targetPath
                      }">
                    {{ eventUploadStatus.isUploading ? '正在处理图片' : (eventUploadStatus.targetPath ? '图片处理完成' : '处理失败') }}
                  </h4>
                  <p class="text-sm text-gray-600 mt-2">{{ eventUploadStatus.message }}</p>
                  <div v-if="eventUploadStatus.targetPath" class="mt-4">
                    <p class="text-xs text-gray-500 mb-2">复制以下路径到文件管理器：</p>
                    <div class="bg-gray-100 p-3 rounded text-xs font-mono text-gray-700 break-all">
                      {{ eventUploadStatus.targetPath }}
                    </div>
                    <button 
                      @click="copyToClipboard(eventUploadStatus.targetPath)"
                      class="mt-3 text-blue-600 hover:text-blue-800 underline"
                    >
                      点击复制路径
                    </button>
                  </div>
                </div>
                <button
                  @click="clearEventUploadStatus"
                  class="ml-4 text-gray-400 hover:text-gray-600"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- 选项管理 -->
          <div>
            <div class="flex justify-between items-center mb-4">
              <label class="block text-sm font-medium text-gray-700">选择选项</label>
              <button
                type="button"
                @click="addOption"
                class="apple-btn-secondary px-3 py-1 text-sm"
              >
                + 添加选项
              </button>
            </div>
            
            <div class="space-y-4">
              <div
                v-for="(option, index) in eventForm.options"
                :key="index"
                class="border border-gray-200 rounded-lg p-4"
              >
                <div class="flex justify-between items-start mb-3">
                  <h4 class="text-sm font-medium text-gray-700">选项 {{ index + 1 }}</h4>
                  <button
                    type="button"
                    @click="removeOption(index)"
                    class="text-red-500 hover:text-red-700"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">选项文本</label>
                    <input
                      v-model="option.optionText"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="选项内容"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">是否正确</label>
                    <select
                      v-model="option.isCorrect"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option :value="true">正确选择</option>
                      <option :value="false">错误选择</option>
                    </select>
                  </div>
                </div>

                <div class="mt-3">
                  <label class="block text-xs font-medium text-gray-600 mb-1">选择影响</label>
                  <textarea
                    v-model="option.effect"
                    rows="2"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="描述这个选择的影响和后果"
                  ></textarea>
                </div>

                <div v-if="option.isCorrect" class="mt-3">
                  <label class="block text-xs font-medium text-gray-600 mb-1">正确选择详细描述</label>
                  <textarea
                    v-model="option.correctDescription"
                    rows="2"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="正确选择后显示的详细描述"
                  ></textarea>
                </div>

                <!-- 选项图片上传 -->
                <div class="mt-3">
                  <label class="block text-xs font-medium text-gray-600 mb-1">选项图片</label>
                  <div class="flex items-center space-x-2">
                    <input
                      type="file"
                      accept="image/*"
                      @change="(event: Event) => handleOptionImageUpload(event, index)"
                      class="hidden"
                      :id="`optionFileInput${index}`"
                    />
                    <button
                      type="button"
                      @click="clickOptionFileInput(index)"
                      class="apple-btn-secondary px-2 py-1 text-sm"
                    >
                      选择图片
                    </button>
                    <span v-if="option.mediaUrl" class="text-xs text-gray-600">已选择</span>
                  </div>
                  <div v-if="option.mediaUrl" class="mt-2">
                    <img
                      :src="option.mediaUrl"
                      alt="选项图片"
                      class="w-20 h-16 object-cover rounded border"
                    />
                  </div>
                  
                  <!-- 选项图片上传状态提示 -->
                  <div v-if="optionUploadStatus.message" class="mt-3 p-3 rounded border text-xs"
                       :class="{
                         'bg-blue-50 border-blue-200': optionUploadStatus.isUploading,
                         'bg-green-50 border-green-200': !optionUploadStatus.isUploading && optionUploadStatus.targetPath,
                         'bg-red-50 border-red-200': !optionUploadStatus.isUploading && !optionUploadStatus.targetPath
                       }">
                    <div class="flex items-start">
                      <div class="flex-shrink-0 mr-2">
                        <div v-if="optionUploadStatus.isUploading" class="apple-loading w-3 h-3"></div>
                        <svg v-else-if="optionUploadStatus.targetPath" class="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <svg v-else class="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <div class="flex-1">
                        <p class="font-medium">{{ optionUploadStatus.message }}</p>
                        <div v-if="optionUploadStatus.targetPath" class="mt-2">
                          <div class="bg-gray-100 p-1 rounded font-mono text-gray-700 break-all">
                            {{ optionUploadStatus.targetPath }}
                          </div>
                          <button 
                            @click="copyToClipboard(optionUploadStatus.targetPath)"
                            class="mt-1 text-blue-600 hover:text-blue-800 underline"
                          >
                            复制路径
                          </button>
                        </div>
                      </div>
                      <button
                        @click="clearOptionUploadStatus"
                        class="ml-1 text-gray-400 hover:text-gray-600"
                      >
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 提交按钮 -->
          <div class="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              @click="closeEventModal"
              class="apple-btn-secondary px-6 py-2"
            >
              取消
            </button>
            <button
              type="submit"
              class="apple-btn-primary px-6 py-2"
            >
              {{ editingEvent ? '更新事件' : '创建事件' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useDataStore } from '../stores/dataStore'
import { copyImageFile, validateImagePath, getImageDirectoryInfo, type ImageUploadContext } from '../utils/imageUtils'
import SafeImage from '../components/SafeImage.vue'
import type { CharacterBook, PersonalChoiceEvent, ChoiceOption } from '../types'

const dataStore = useDataStore()

// 响应式状态
const currentView = ref<'books' | 'events'>('books')
const books = computed(() => dataStore.getAllBooks)
const selectedBook = ref<CharacterBook | null>(null)
const currentEvents = ref<PersonalChoiceEvent[]>([])

// 图片上传状态
const uploadStatus = ref<{
  isUploading: boolean
  fileName: string
  targetPath: string
  message: string
}>({
  isUploading: false,
  fileName: '',
  targetPath: '',
  message: ''
})

// 分别为不同类型的上传创建独立状态
const bookUploadStatus = ref<{
  isUploading: boolean
  message: string
}>({
  isUploading: false,
  message: ''
})

const eventUploadStatus = ref<{
  isUploading: boolean
  message: string
  targetPath: string
}>({
  isUploading: false,
  message: '',
  targetPath: ''
})

const optionUploadStatus = ref<{
  isUploading: boolean
  message: string
  targetPath: string
}>({
  isUploading: false,
  message: '',
  targetPath: ''
})

// 书籍管理相关
const showAddBookModal = ref(false)
const editingBook = ref<CharacterBook | null>(null)
const bookFileInput = ref<HTMLInputElement>()

// 事件管理相关
const showAddEventModal = ref(false)
const editingEvent = ref<PersonalChoiceEvent | null>(null)
const fileInput = ref<HTMLInputElement>()
const eventImagePath = ref('')
const optionImagePaths = ref<string[]>([])

// 书籍表单
const bookForm = ref({
  title: '',
  subtitle: '',
  description: '',
  author: '',
  startYear: 1995,
  endYear: 2025,
  primaryColor: '#007AFF',
  bookCode: '',
  coverImage: ''
})

// 事件表单
const eventForm = ref({
  question: '',
  description: '',
  year: 1995,
  eventCode: '',
  mediaUrl: '',
  mediaType: 'image' as 'image' | 'video',
  displayOrder: 1,
  options: [] as any[]
})

// 方法
const selectBook = (book: CharacterBook) => {
  selectedBook.value = book
  currentEvents.value = dataStore.getPersonalChoiceEventsByBookId(book.id)
}

const selectBookForEvents = (book: CharacterBook) => {
  currentView.value = 'events'
  selectBook(book)
}

const getEventCount = (bookId: number): number => {
  return dataStore.getPersonalChoiceEventsByBookId(bookId).length
}

// 图片上传辅助方法
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    // 可以添加一个临时提示表明复制成功
  } catch (err) {
    console.error('复制失败:', err)
  }
}

const clearUploadStatus = () => {
  uploadStatus.value.message = ''
  uploadStatus.value.targetPath = ''
  uploadStatus.value.fileName = ''
  uploadStatus.value.isUploading = false
}

const clearBookUploadStatus = () => {
  bookUploadStatus.value.message = ''
  bookUploadStatus.value.isUploading = false
}

const clearEventUploadStatus = () => {
  eventUploadStatus.value.message = ''
  eventUploadStatus.value.targetPath = ''
  eventUploadStatus.value.isUploading = false
}

const clearOptionUploadStatus = () => {
  optionUploadStatus.value.message = ''
  optionUploadStatus.value.targetPath = ''
  optionUploadStatus.value.isUploading = false
}

// 书籍管理方法
const editBook = (book: CharacterBook) => {
  editingBook.value = book
  bookForm.value = {
    title: book.title,
    subtitle: book.subtitle || '',
    description: book.description,
    author: book.author,
    startYear: book.startYear,
    endYear: book.endYear,
    primaryColor: book.primaryColor,
    bookCode: book.bookCode,
    coverImage: book.coverImage || ''
  }
}

const closeBookModal = () => {
  showAddBookModal.value = false
  editingBook.value = null
  bookForm.value = {
    title: '',
    subtitle: '',
    description: '',
    author: '',
    startYear: 1995,
    endYear: 2025,
    primaryColor: '#007AFF',
    bookCode: '',
    coverImage: ''
  }
}

const handleBookImageUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    try {
      bookUploadStatus.value.isUploading = true
      bookUploadStatus.value.message = '正在上传图片...'
      
      // 创建上传上下文信息
      const context: ImageUploadContext = {
        bookTitle: bookForm.value.title,
        bookId: editingBook.value?.id
      }
      
      const staticUrl = await copyImageFile(file, 'covers', context)
      bookForm.value.coverImage = staticUrl
      
      // 立即更新dataStore中的数据（如果是编辑模式）
      if (editingBook.value) {
        const updatedBook: CharacterBook = {
          ...editingBook.value,
          coverImage: staticUrl,
          updatedAt: new Date().toISOString()
        }
        dataStore.updateBook(updatedBook)
        console.log('✅ 书籍封面已更新并保存到dataStore:', staticUrl)
      }
      
      // 提取文件名用于提示
      const fileName = staticUrl.split('/').pop()
      bookUploadStatus.value.message = `图片上传成功！文件已保存为 ${fileName}`
      bookUploadStatus.value.isUploading = false
      
      // 10秒后清除提示
      setTimeout(() => {
        bookUploadStatus.value.message = ''
      }, 10000)
    } catch (error: any) {
      console.error('图片上传失败:', error)
      bookUploadStatus.value.isUploading = false
      bookUploadStatus.value.message = `图片上传失败: ${error.message}`
      setTimeout(() => {
        bookUploadStatus.value.message = ''
      }, 5000)
    }
  }
}

const saveBook = () => {
  const bookData: CharacterBook = {
    id: editingBook.value?.id || Date.now(),
    bookCode: bookForm.value.bookCode,
    title: bookForm.value.title,
    subtitle: bookForm.value.subtitle,
    description: bookForm.value.description,
    author: bookForm.value.author,
    startYear: bookForm.value.startYear,
    endYear: bookForm.value.endYear,
    primaryColor: bookForm.value.primaryColor,
    coverImage: bookForm.value.coverImage || undefined,
    playCount: editingBook.value?.playCount || 0,
    likeCount: editingBook.value?.likeCount || 0,
    isCompleted: true,
    isUploaded: true,
    userToken: '',
    createdAt: editingBook.value?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  if (editingBook.value) {
    dataStore.updateBook(bookData)
  } else {
    dataStore.addBook(bookData)
  }

  closeBookModal()
}

const deleteBookConfirm = (bookId: number) => {
  if (confirm('确定要删除这本书籍吗？这将同时删除所有相关的事件数据。')) {
    dataStore.deleteBook(bookId)
    if (selectedBook.value?.id === bookId) {
      selectedBook.value = null
      currentEvents.value = []
    }
  }
}

// 事件管理方法
const editEvent = (event: PersonalChoiceEvent) => {
  editingEvent.value = event
  eventForm.value = {
    question: event.question,
    description: event.description,
    year: event.year,
    eventCode: event.eventCode,
    mediaUrl: event.mediaUrl || '',
    mediaType: event.mediaType || 'image',
    displayOrder: event.displayOrder || 1,
    options: event.options.map(opt => ({ ...opt }))
  }
}

const closeEventModal = () => {
  showAddEventModal.value = false
  editingEvent.value = null
  eventForm.value = {
    question: '',
    description: '',
    year: 1995,
    eventCode: '',
    mediaUrl: '',
    mediaType: 'image',
    displayOrder: 1,
    options: []
  }
}

const addOption = () => {
  eventForm.value.options.push({
    id: Date.now(),
    optionText: '',
    effect: '',
    isCorrect: false,
    correctDescription: '',
    mediaUrl: '',
    tags: [],
    actionType: 'NEXT_EVENT'
  })
}

const removeOption = (index: number) => {
  eventForm.value.options.splice(index, 1)
}

const handleImageUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    try {
      eventUploadStatus.value.isUploading = true
      eventUploadStatus.value.message = '正在上传图片...'
      
      // 创建上传上下文信息
      const context: ImageUploadContext = {
        bookTitle: selectedBook.value?.title,
        bookId: selectedBook.value?.id,
        eventTitle: eventForm.value.question,
        eventId: editingEvent.value?.id
      }
      
      const staticUrl = await copyImageFile(file, 'events', context)
      eventForm.value.mediaUrl = staticUrl
      
      // 立即更新dataStore中的事件数据（如果是编辑模式）
      if (editingEvent.value && selectedBook.value) {
        const updatedEvent: PersonalChoiceEvent = {
          ...editingEvent.value,
          mediaUrl: staticUrl,
          mediaType: 'image'
        }
        dataStore.updatePersonalChoiceEvent(updatedEvent)
        console.log('✅ 事件图片已更新并保存到dataStore:', staticUrl)
        
        // 刷新当前事件列表以反映更改
        currentEvents.value = dataStore.getPersonalChoiceEventsByBookId(selectedBook.value.id)
      }
      
      // 提取文件名用于提示
      const fileName = staticUrl.split('/').pop()
      eventUploadStatus.value.message = `图片上传成功！文件已保存为 ${fileName}`
      eventUploadStatus.value.targetPath = `E:\\Fate Echoes\\fate-echoes\\public\\images\\events\\${fileName}`
      eventUploadStatus.value.isUploading = false
      
      // 10秒后清除提示
      setTimeout(() => {
        eventUploadStatus.value.message = ''
        eventUploadStatus.value.targetPath = ''
      }, 10000)
    } catch (error: any) {
      console.error('图片上传失败:', error)
      eventUploadStatus.value.isUploading = false
      eventUploadStatus.value.message = `图片上传失败: ${error.message}`
      setTimeout(() => {
        eventUploadStatus.value.message = ''
      }, 3000)
    }
  }
}

const handleOptionImageUpload = async (event: Event, optionIndex: number) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    try {
      optionUploadStatus.value.isUploading = true
      optionUploadStatus.value.message = '正在上传图片...'
      
      // 创建上传上下文信息
      const option = eventForm.value.options[optionIndex]
      const context: ImageUploadContext = {
        bookTitle: selectedBook.value?.title,
        bookId: selectedBook.value?.id,
        eventTitle: eventForm.value.question,
        eventId: editingEvent.value?.id,
        optionText: option?.optionText,
        optionIndex: optionIndex
      }
      
      const staticUrl = await copyImageFile(file, 'options', context)
      eventForm.value.options[optionIndex].mediaUrl = staticUrl
      
      // 立即更新dataStore中的事件选项数据（如果是编辑模式）
      if (editingEvent.value && selectedBook.value) {
        const updatedEvent: PersonalChoiceEvent = {
          ...editingEvent.value,
          options: eventForm.value.options.map(opt => ({ ...opt }))
        }
        dataStore.updatePersonalChoiceEvent(updatedEvent)
        console.log('✅ 选项图片已更新并保存到dataStore:', staticUrl)
        
        // 刷新当前事件列表以反映更改
        currentEvents.value = dataStore.getPersonalChoiceEventsByBookId(selectedBook.value.id)
      }
      
      // 提取文件名用于提示
      const fileName = staticUrl.split('/').pop()
      optionUploadStatus.value.message = `图片上传成功！文件已保存为 ${fileName}`
      optionUploadStatus.value.targetPath = `E:\\Fate Echoes\\fate-echoes\\public\\images\\options\\${fileName}`
      optionUploadStatus.value.isUploading = false
      
      // 10秒后清除提示
      setTimeout(() => {
        optionUploadStatus.value.message = ''
        optionUploadStatus.value.targetPath = ''
      }, 10000)
    } catch (error: any) {
      console.error('图片上传失败:', error)
      optionUploadStatus.value.isUploading = false
      optionUploadStatus.value.message = `图片上传失败: ${error.message}`
      setTimeout(() => {
        optionUploadStatus.value.message = ''
      }, 3000)
    }
  }
}

const clickOptionFileInput = (index: number) => {
  const element = document.getElementById(`optionFileInput${index}`) as HTMLInputElement
  element?.click()
}

const saveEvent = () => {
  if (!selectedBook.value) return

  const eventData: PersonalChoiceEvent = {
    id: editingEvent.value?.id || Date.now(),
    bookId: selectedBook.value.id,
    question: eventForm.value.question,
    description: eventForm.value.description,
    year: eventForm.value.year,
    eventCode: eventForm.value.eventCode,
    mediaUrl: eventForm.value.mediaUrl || undefined,
    mediaType: eventForm.value.mediaType,
    isStartingEvent: false,
    displayOrder: eventForm.value.displayOrder,
    options: eventForm.value.options
  }

  if (editingEvent.value) {
    dataStore.updatePersonalChoiceEvent(eventData)
  } else {
    dataStore.addPersonalChoiceEvent(eventData)
  }

  // 刷新当前事件列表
  currentEvents.value = dataStore.getPersonalChoiceEventsByBookId(selectedBook.value.id)
  closeEventModal()
}

const deleteEvent = (eventId: number) => {
  if (confirm('确定要删除这个事件吗？')) {
    dataStore.deletePersonalChoiceEvent(eventId)
    if (selectedBook.value) {
      currentEvents.value = dataStore.getPersonalChoiceEventsByBookId(selectedBook.value.id)
    }
  }
}

onMounted(() => {
  // 默认选择第一本书
  if (books.value.length > 0) {
    selectBook(books.value[0])
  }
})
</script> 