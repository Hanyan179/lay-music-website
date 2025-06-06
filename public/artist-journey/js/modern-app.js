/* ================================
   张艺兴纯白简约音乐主题页面 JavaScript
   版本：2025.01.05 - 极简音乐交互
   ================================ */

// —— 应用主类 —— 
class ModernLayApp {
  constructor() {
    this.isLoaded = false;
    this.audioWaveSystem = null;
    this.timelineScene = null;
    this.audioContext = null;
    this.currentAudio = null;
    this.isPlaying = false;
    this.lottieAnimations = new Map(); // 存储Lottie动画实例
    this.currentAlbum = null; // 当前播放的专辑
    this.currentSongIndex = 0; // 当前歌曲索引
    this.globalPlayer = null; // 全局播放器引用
    
    // 音乐主题色彩
    this.colors = {
      primary: '#3B82F6',      // 蓝色 - 主旋律
      secondary: '#8B5CF6',    // 紫色 - 和声
      accent: '#EC4899',       // 粉色 - 强调音
      warm: '#F59E0B',         // 橙色 - 节拍
      cool: '#10B981'          // 绿色 - 低音
    };
    
    // 数据
    this.musicData = [
      {
        id: 1,
        albumTitle: "莲 (LIT)",
        albumCover: "assets/background.jpg",
        year: 2020,
        color: this.colors.primary,
        genre: "中式流行",
        description: "中华文化与现代音乐的完美融合",
        lottieAnimation: "/lottie/Animation - 1749134860760.lottie",
        iframeUrl: "//music.163.com/outchain/player?type=1&id=90225022&auto=1&height=90",
        songs: [
          { title: "莲 (Lit)", duration: "04:32" },
          { title: "飞天", duration: "04:15" },
          { title: "玉", duration: "03:48" },
          { title: "祖国", duration: "04:22" }
        ]
      },
      {
        id: 2,
        albumTitle: "NAMANANA",
        albumCover: "assets/background.jpg",
        year: 2018,
        color: this.colors.accent,
        genre: "流行舞曲",
        description: "充满活力的音乐探索",
        lottieAnimation: "/lottie/Animation - 1749134860760.lottie",
        iframeUrl: "//music.163.com/outchain/player?type=1&id=90225022&auto=1&height=90",
        songs: [
          { title: "NAMANANA", duration: "03:45" },
          { title: "HONEY", duration: "03:28" },
          { title: "SHEEP", duration: "03:52" },
          { title: "BOOM", duration: "03:33" }
        ]
      },
      {
        id: 3,
        albumTitle: "LOSE CONTROL",
        albumCover: "assets/background.jpg",
        year: 2016,
        color: this.colors.secondary,
        genre: "流行",
        description: "首张个人专辑的突破之作",
        lottieAnimation: "/lottie/Animation - 1749134860760.lottie",
        iframeUrl: "//music.163.com/outchain/player?type=1&id=90225022&auto=1&height=90",
        songs: [
          { title: "LOSE CONTROL", duration: "04:28" },
          { title: "MYM", duration: "03:55" },
          { title: "YESTERDAY", duration: "04:12" },
          { title: "MONODRAMA", duration: "03:39" }
        ]
      },
      {
        id: 4,
        albumTitle: "LAY 02 SHEEP",
        albumCover: "assets/background.jpg",
        year: 2017,
        color: this.colors.warm,
        genre: "嘻哈",
        description: "独特风格的嘻哈音乐表达",
        lottieAnimation: "/lottie/Animation - 1749134860760.lottie",
        iframeUrl: "//music.163.com/outchain/player?type=1&id=90225022&auto=1&height=90",
        songs: [
          { title: "SHEEP", duration: "03:52" },
          { title: "PEACH", duration: "03:25" },
          { title: "MASK", duration: "04:08" },
          { title: "TONIGHT", duration: "03:47" }
        ]
      },
      {
        id: 5,
        albumTitle: "PRODUCER",
        albumCover: "assets/background.jpg",
        year: 2019,
        color: this.colors.cool,
        genre: "制作专辑",
        description: "展现制作人才华的音乐作品",
        lottieAnimation: "/lottie/Animation - 1749134860760.lottie",
        iframeUrl: "//music.163.com/outchain/player?type=1&id=90225022&auto=1&height=90",
        songs: [
          { title: "LATE NIGHT", duration: "04:15" },
          { title: "COCKTAIL", duration: "03:33" },
          { title: "RUSH", duration: "03:58" },
          { title: "ELEVATOR", duration: "04:02" }
        ]
      },
      {
        id: 6,
        albumTitle: "EAST",
        albumCover: "assets/background.jpg",
        year: 2022,
        color: this.colors.primary,
        genre: "东方音乐",
        description: "东方韵味的现代诠释",
        lottieAnimation: "/lottie/Animation - 1749134860760.lottie",
        iframeUrl: "//music.163.com/outchain/player?type=1&id=90225022&auto=1&height=90",
        songs: [
          { title: "EAST", duration: "04:20" },
          { title: "SOUL", duration: "03:55" },
          { title: "KARMA", duration: "04:08" },
          { title: "DYNASTY", duration: "04:35" }
        ]
      }
    ];
    
    this.videoData = [
      {
        id: 1,
        title: "莲 (Lit) MV",
        duration: "04:32",
        views: "2.1M",
        thumbnail: "assets/background.jpg",
        description: "中式古典美学与现代音乐的完美融合",
        platform: "bilibili",
        iframeCode: '<iframe src="//player.bilibili.com/player.html?isOutside=true&aid=455862130&bvid=BV1V5411x7Vt&cid=197211855&p=1&autoplay=0" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" width="100%" height="400"></iframe>'
      },
      {
        id: 2,
        title: "飞天 MV",
        duration: "04:15",
        views: "1.8M",
        thumbnail: "assets/background.jpg",
        description: "敦煌文化的音乐视觉表达",
        platform: "bilibili",
        iframeCode: '<iframe src="//player.bilibili.com/player.html?isOutside=true&aid=455862130&bvid=BV1V5411x7Vt&cid=197211855&p=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" width="100%" height="400"></iframe>'
      },
      {
        id: 3,
        title: "HONEY MV",
        duration: "03:28",
        views: "5.2M",
        thumbnail: "assets/background.jpg",
        description: "甜蜜律动的都市风情",
        platform: "douyin",
        iframeCode: '<iframe src="//www.douyin.com/player/v1/BV1V5411x7Vt" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" width="100%" height="400"></iframe>'
      },
      {
        id: 4,
        title: "NAMANANA MV",
        duration: "03:45",
        views: "12.5M",
        thumbnail: "assets/background.jpg",
        description: "充满活力的舞蹈盛宴",
        platform: "bilibili",
        iframeCode: '<iframe src="//player.bilibili.com/player.html?isOutside=true&aid=455862130&bvid=BV1V5411x7Vt&cid=197211855&p=1&autoplay=0" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" width="100%" height="400"></iframe>'
      },
      {
        id: 5,
        title: "SHEEP MV",
        duration: "03:52",
        views: "3.7M",
        thumbnail: "assets/background.jpg",
        description: "创意十足的嘻哈风格",
        platform: "douyin",
        iframeCode: '<iframe src="//www.douyin.com/player/v1/BV1V5411x7Vt" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" width="100%" height="400"></iframe>'
      },
      {
        id: 6,
        title: "LOSE CONTROL MV",
        duration: "04:28", 
        views: "8.9M",
        thumbnail: "assets/background.jpg",
        description: "情感释放的音乐故事",
        platform: "bilibili",
        iframeCode: '<iframe src="//player.bilibili.com/player.html?isOutside=true&aid=455862130&bvid=BV1V5411x7Vt&cid=197211855&p=1&autoplay=0" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" width="100%" height="400"></iframe>'
      }
    ];
    
    // 抖音精选数据
    this.douyinData = [
      {
        id: 1,
        title: "练习室日常",
        description: "分享日常练习的点点滴滴，汗水与坚持的记录",
        views: "1.2M",
        likes: "89K",
        videoId: "7145518957762530573",
        thumbnail: "assets/background.jpg"
      },
      {
        id: 2,
        title: "舞蹈创作过程",
        description: "展示舞蹈动作的创作灵感和编排过程",
        views: "956K",
        likes: "67K", 
        videoId: "7145518957762530574",
        thumbnail: "assets/background.jpg"
      },
      {
        id: 3,
        title: "音乐制作幕后",
        description: "揭秘音乐制作的幕后故事和创作心得",
        views: "2.1M",
        likes: "156K",
        videoId: "7145518957762530575", 
        thumbnail: "assets/background.jpg"
      },
      {
        id: 4,
        title: "生活随拍",
        description: "记录生活中的美好瞬间和感动时刻",
        views: "778K",
        likes: "45K",
        videoId: "7145518957762530576",
        thumbnail: "assets/background.jpg"
      }
    ];
    
    this.timelineData = [
      {
        year: 2005,
        month: "07",
        day: "15",
        title: "初入音乐世界",
        description: "在SM Entertainment开始练习生生活，踏上音乐梦想之路",
        type: "milestone",
        category: "音乐",
        image: "assets/background.jpg",
        lyrics: "梦想从这里开始\n每一次汗水都是成长的印记",
        quote: "那时的我只有一个信念：无论多苦多累，都要坚持下去，因为这是我的梦想。",
        mood: "determined",
        colorTheme: "#3B82F6",
        story: "15岁的张艺兴怀着忐忑而兴奋的心情踏进了练习室，那一刻他知道，人生即将翻开全新的篇章。"
      },
      {
        year: 2008,
        month: "03",
        day: "22",
        title: "练习生历练",
        description: "在韩国接受严格的音乐和舞蹈训练，不断磨砺自己",
        type: "training",
        category: "成长",
        image: "assets/background.jpg",
        lyrics: "汗水浇灌梦想的种子\n每一天都是新的开始",
        quote: "练习室里的每一个夜晚都是痛苦的，但也是充满希望的。",
        mood: "persistent",
        colorTheme: "#8B5CF6",
        story: "无数个深夜的练习，无数次的跌倒与爬起，每一滴汗水都在为未来的绽放做准备。"
      },
      {
        year: 2012,
        month: "04",
        day: "08",
        title: "EXO华丽出道",
        description: "作为EXO-M成员正式出道，开启国际化音乐之旅",
        type: "debut",
        category: "音乐",
        image: "assets/background.jpg",
        lyrics: "我们是一体的\n十二个人，一个梦想",
        quote: "出道的那一刻，我知道我不再是一个人在战斗，我们是EXO，我们要让全世界听到我们的声音。",
        mood: "euphoric",
        colorTheme: "#EC4899",
        story: "舞台灯光亮起的瞬间，七年的练习生生涯终于迎来了绽放的时刻。十二个少年，一个梦想，一起出发。"
      },
      {
        year: 2014,
        month: "11",
        day: "18",
        title: "个人活动拓展",
        description: "开始在中国发展个人事业，参与各种音乐和影视项目",
        type: "expansion",
        category: "事业",
        image: "assets/background.jpg",
        lyrics: "双重身份，双倍努力\n在两个舞台上发光发热",
        quote: "我要在两个国家都证明自己，音乐没有国界，梦想也没有界限。",
        mood: "ambitious",
        colorTheme: "#F59E0B",
        story: "在韩国和中国之间奔波，用实际行动诠释什么叫做音乐无国界。"
      },
      {
        year: 2016,
        month: "10",
        day: "07",
        title: "个人音乐起航",
        description: "发行首张个人专辑《LOSE CONTROL》，展现独特音乐风格",
        type: "album",
        category: "音乐",
        image: "assets/background.jpg",
        lyrics: "I lose control\n当我面对真实的自己",
        quote: "这张专辑是我内心最真实的表达，我想告诉大家，张艺兴不只是EXO的成员，更是一个独立的音乐人。",
        mood: "introspective",
        colorTheme: "#8B5CF6",
        story: "站在个人与团体的十字路口，他选择用音乐为自己发声，每一个音符都承载着突破与坚持的勇气。"
      },
      {
        year: 2017,
        month: "07",
        day: "13",
        title: "《极限挑战》爆红",
        description: "在综艺节目中展现真实性格，收获大量粉丝喜爱",
        type: "variety",
        category: "综艺",
        image: "assets/background.jpg",
        lyrics: "真实的自己最珍贵\n笑容是最好的名片",
        quote: "在节目里，我可以做回最真实的自己，那种快乐是发自内心的。",
        mood: "joyful",
        colorTheme: "#10B981",
        story: "镜头前的小绵羊形象深入人心，观众看到了一个真实、可爱、努力的张艺兴。"
      },
      {
        year: 2018,
        month: "06",
        day: "20",
        title: "NAMANANA热潮",
        description: "发行热门单曲《NAMANANA》，引领新的音乐潮流",
        type: "single",
        category: "音乐",
        image: "assets/background.jpg",
        lyrics: "NAMANANA\n这是属于我们的时代",
        quote: "音乐没有界限，我要用我的方式让世界感受到中国音乐的力量和魅力。",
        mood: "confident",
        colorTheme: "#10B981",
        story: "一首《NAMANANA》点燃了整个夏天，那份自信与张扬，是对过往所有质疑的最好回应。"
      },
      {
        year: 2019,
        month: "12",
        day: "31",
        title: "制作人身份确立",
        description: "作为制作人参与更多音乐制作，展现全方位音乐才华",
        type: "producer",
        category: "音乐",
        image: "assets/background.jpg",
        lyrics: "音乐制作是我的另一个战场\n每一个细节都要完美",
        quote: "我不只想当一个歌手，我想成为一个全能的音乐人，从创作到制作，每个环节都要参与。",
        mood: "focused",
        colorTheme: "#8B5CF6",
        story: "从台前走向幕后，用专业的制作能力为华语音乐注入新的活力。"
      },
      {
        year: 2020,
        month: "09",
        day: "25",
        title: "文化传承之作",
        description: "发行专辑《莲》，将中华文化元素融入现代音乐",
        type: "album",
        category: "音乐",
        image: "assets/background.jpg",
        lyrics: "莲花出淤泥而不染\n如我心中的坚持",
        quote: "我想用音乐架起一座桥梁，让世界看到中华文化的美好，这是我的责任，也是我的荣耀。",
        mood: "profound",
        colorTheme: "#F59E0B",
        story: "当古典与现代碰撞，当东方遇见西方，《莲》不仅是一张专辑，更是一次文化的传承与创新。"
      },
      {
        year: 2021,
        month: "05",
        day: "18",
        title: "国际舞台绽放",
        description: "在国际音乐节上表演，向世界展示华语音乐魅力",
        type: "international",
        category: "国际",
        image: "assets/background.jpg",
        lyrics: "音乐是世界通用的语言\n我要让华语音乐响彻全球",
        quote: "站在国际舞台上，我代表的不只是我自己，更是华语音乐的力量。",
        mood: "proud",
        colorTheme: "#EC4899",
        story: "当华语音乐在国际舞台上响起，那一刻所有的努力都得到了最好的回报。"
      },
      {
        year: 2022,
        month: "08",
        day: "12",
        title: "慈善公益活动",
        description: "积极参与公益活动，用音乐传递正能量",
        type: "charity",
        category: "公益",
        image: "assets/background.jpg",
        lyrics: "用音乐传递爱与希望\n让世界变得更美好",
        quote: "音乐给了我很多，现在我想用音乐回馈社会，让更多人感受到温暖。",
        mood: "caring",
        colorTheme: "#10B981",
        story: "用音乐做公益，用爱心传递温暖，这是一个艺术家最美好的社会责任。"
      },
      {
        year: 2023,
        month: "12",
        day: "08",
        title: "音乐探索不止",
        description: "继续在音乐道路上探索创新，传递正能量",
        type: "ongoing",
        category: "音乐",
        image: "assets/background.jpg",
        lyrics: "路还很长\n但我永远向前",
        quote: "音乐是我生命的一部分，无论走到哪里，我都会继续创作，用音乐连接世界，传递爱与希望。",
        mood: "hopeful",
        colorTheme: "#8B5CF6",
        story: "十八年的音乐路，从青涩到成熟，从追梦到逐梦。未来还有无数可能，而音乐永远是他前行的动力。"
      }
    ];
    
    this.init();
  }
  
  // —— 初始化 —— 
  async init() {
    try {
      this.setupEventListeners();
      this.initAudioWaveBackground();
      this.initScrollAnimations();
      this.renderMusicCards();
      this.renderVideoCards();
      this.renderDouyinHighlights(); // 添加抖音精选渲染
      this.init3DTimeline();
      this.initMusicSectionLottie();
      this.initGlobalPlayer(); // 初始化全局播放器
      
      // 延迟初始化音频
      setTimeout(() => {
        this.initAudioContext();
      }, 1000);
      
      this.isLoaded = true;
      console.log('🎵 纯白简约 LAY 网站加载完成');
      
    } catch (error) {
      console.error('初始化失败:', error);
      this.showError('加载失败，请刷新页面重试');
    }
  }
  
  // —— 事件监听器 —— 
  setupEventListeners() {
    // 导航菜单
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuToggle && mobileMenu) {
      menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });
    }
    
    // 导航链接平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        this.scrollToSection(targetId);
      });
    });
    
    // 时间轴重置按钮
    const timelineReset = document.getElementById('timeline-reset');
    if (timelineReset) {
      timelineReset.addEventListener('click', () => {
        this.resetTimeline();
      });
    }
    
    // 窗口大小变化
    window.addEventListener('resize', () => {
      this.handleResize();
    });
    
    // 滚动事件
    window.addEventListener('scroll', () => {
      this.handleScroll();
    });
  }
  
  // —— 音波可视化背景系统 —— 
  initAudioWaveBackground() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // 设置画布大小
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // 音波粒子类
    class AudioWave {
      constructor() {
        this.reset();
        this.y = Math.random() * canvas.height;
        this.amplitude = Math.random() * 0.5 + 0.3;
        this.frequency = Math.random() * 0.02 + 0.01;
        this.phase = Math.random() * Math.PI * 2;
      }
      
      reset() {
        this.x = -50;
        this.y = Math.random() * canvas.height;
        this.speed = Math.random() * 2 + 0.5;
        this.size = Math.random() * 3 + 1;
        this.opacity = Math.random() * 0.3 + 0.1;
        this.color = this.getRandomMusicColor();
      }
      
      getRandomMusicColor() {
        const colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'];
        return colors[Math.floor(Math.random() * colors.length)];
      }
      
      update() {
        this.x += this.speed;
        
        // 音波效果
        const waveY = Math.sin(this.x * this.frequency + this.phase) * this.amplitude * 50;
        this.currentY = this.y + waveY;
        
        // 透明度脉动
        this.opacity = 0.2 + Math.sin(Date.now() * 0.003 + this.phase) * 0.1;
        
        if (this.x > canvas.width + 50) {
          this.reset();
        }
      }
      
      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        
        // 创建径向渐变
        const gradient = ctx.createRadialGradient(
          this.x, this.currentY, 0,
          this.x, this.currentY, this.size * 3
        );
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.currentY, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // 添加连线效果（模拟音波）
        if (this.x > 0) {
          ctx.strokeStyle = this.color;
          ctx.lineWidth = 0.5;
          ctx.globalAlpha = this.opacity * 0.3;
          ctx.beginPath();
          ctx.moveTo(this.x - this.speed * 5, this.currentY);
          ctx.lineTo(this.x, this.currentY);
          ctx.stroke();
        }
        
        ctx.restore();
      }
    }
    
    // 创建音波系统
    const waves = [];
    const waveCount = 80;
    
    for (let i = 0; i < waveCount; i++) {
      waves.push(new AudioWave());
    }
    
    // 动画循环
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      waves.forEach(wave => {
        wave.update();
        wave.draw();
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    this.audioWaveSystem = { canvas, ctx, waves };
  }
  
  // —— 滚动动画 —— 
  initScrollAnimations() {
    // 注册GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // 导航栏状态变化
    gsap.to('nav', {
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: '100px top',
        scrub: true,
        onUpdate: (self) => {
          const nav = document.querySelector('nav');
          if (self.progress > 0.1) {
            nav.classList.add('scrolled');
          } else {
            nav.classList.remove('scrolled');
          }
        }
      }
    });
    
    // 章节标题动画
    gsap.utils.toArray('.section-title').forEach(title => {
      gsap.fromTo(title, 
        {
          opacity: 0,
          y: 80,
          scale: 0.8
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: title,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
    
    // 卡片交错动画
    gsap.utils.toArray('.music-card, .video-card').forEach((card, index) => {
      gsap.fromTo(card,
        {
          opacity: 0,
          y: 60,
          scale: 0.9
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          delay: index * 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
    
    // 节拍点动画
    gsap.utils.toArray('.rhythm-dots').forEach(dotsContainer => {
      const dots = dotsContainer.querySelectorAll('.rhythm-dot');
      gsap.fromTo(dots,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: dotsContainer,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  }
  
  // —— 音乐卡片渲染 —— 
  renderMusicCards() {
    const container = document.querySelector('#music .grid');
    if (!container) return;
    
    container.innerHTML = '';
    
    this.musicData.forEach((album, index) => {
      const card = document.createElement('div');
      card.className = 'music-card album-card';
      card.setAttribute('data-album-id', album.id);
      
      card.innerHTML = `
        <div class="album-cover aspect-square mb-6" id="album-cover-${album.id}">
          <img src="${album.albumCover}" alt="${album.albumTitle}" class="w-full h-full object-cover">
          
          <!-- 专辑封面悬停Lottie动画 -->
          <div class="absolute inset-0 album-cover-lottie opacity-0 transition-opacity duration-500" id="album-cover-lottie-${album.id}">
          </div>
          
          <div class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
            <button class="play-button" onclick="window.layApp.playAlbum(${JSON.stringify(album).replace(/"/g, '&quot;')})">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
          </div>
          <div class="absolute top-3 right-3 bg-white bg-opacity-90 rounded-full px-3 py-1 text-xs font-medium text-gray-700">
            ${album.year}
          </div>
          <div class="absolute bottom-3 left-3 bg-white bg-opacity-90 rounded-full px-3 py-1 text-xs font-medium text-gray-700">
            ${album.songs.length} 首歌
          </div>
        </div>
        
        <div class="space-y-4">
          <h3 class="text-xl font-bold text-gray-900">${album.albumTitle}</h3>
          <p class="text-gray-500 text-sm">${album.description}</p>
          <div class="text-gray-400 text-xs">${album.genre} · ${album.year}</div>
          
          <!-- 动态歌名展示 -->
          <div class="song-display-container" style="height: 60px; overflow: hidden;">
            <div class="song-display" data-album-id="${album.id}">
              <div class="song-item current">${album.songs[0].title}</div>
              ${album.songs.slice(1).map(song => `<div class="song-item">${song.title}</div>`).join('')}
            </div>
          </div>
          
          <!-- 播放控制按钮 -->
          <div class="album-controls flex items-center justify-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <button class="control-btn prev-btn" onclick="window.layApp.previousSong()" title="上一首">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
              </svg>
            </button>
            <button class="control-btn play-pause-btn ${this.currentAlbum?.id === album.id && this.isPlaying ? 'playing' : ''}" 
                    onclick="window.layApp.togglePlayPause(${album.id})" title="播放/暂停">
              <svg class="play-icon w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <svg class="pause-icon w-6 h-6 hidden" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            </button>
            <button class="control-btn next-btn" onclick="window.layApp.nextSong()" title="下一首">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
              </svg>
            </button>
          </div>
          
          <!-- Lottie动画容器 -->
          <div class="album-lottie" id="album-lottie-${album.id}"></div>
          
          <!-- 歌单管理按钮 -->
          <div class="flex items-center justify-between">
            <button class="text-sm text-blue-500 hover:text-blue-700 font-medium" onclick="window.layApp.editPlaylist(${album.id})">
              <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              编辑歌单
            </button>
            <div class="text-xs text-gray-400">${album.songs.reduce((total, song) => {
              const [min, sec] = song.duration.split(':').map(Number);
              return total + min * 60 + sec;
            }, 0) > 3600 ? 
              Math.floor(album.songs.reduce((total, song) => {
                const [min, sec] = song.duration.split(':').map(Number);
                return total + min * 60 + sec;
              }, 0) / 3600) + '小时' + 
              Math.floor((album.songs.reduce((total, song) => {
                const [min, sec] = song.duration.split(':').map(Number);
                return total + min * 60 + sec;
              }, 0) % 3600) / 60) + '分钟' :
              Math.floor(album.songs.reduce((total, song) => {
                const [min, sec] = song.duration.split(':').map(Number);
                return total + min * 60 + sec;
              }, 0) / 60) + '分钟'
            }</div>
          </div>
        </div>
      `;
      
      // 初始化专辑封面Lottie动画
      setTimeout(() => {
        this.initAlbumCoverLottie(album.id);
      }, index * 100);
      
      // 初始化Lottie动画
      if (album.lottieAnimation) {
        setTimeout(() => {
          this.initAlbumLottie(album.id, album.lottieAnimation);
        }, index * 200);
      }
      
      // 专辑封面悬停事件
      const albumCover = card.querySelector('.album-cover');
      albumCover.addEventListener('mouseenter', () => {
        this.onAlbumCoverHover(album.id, true);
      });
      
      albumCover.addEventListener('mouseleave', () => {
        this.onAlbumCoverHover(album.id, false);
      });
      
      // 卡片悬停事件
      card.addEventListener('mouseenter', () => {
        this.onAlbumHover(album.id, true);
      });
      
      card.addEventListener('mouseleave', () => {
        this.onAlbumHover(album.id, false);
      });
      
      container.appendChild(card);
      
      // 启动歌名动态变幻
      this.startSongRotation(album.id, album.songs);
    });
  }
  
  // —— 视频卡片渲染 —— 
  renderVideoCards() {
    const container = document.querySelector('#videos .grid');
    if (!container) return;
    
    container.innerHTML = '';
    
    this.videoData.forEach((video, index) => {
      const card = document.createElement('div');
      card.className = 'video-card';
      card.setAttribute('data-video-id', video.id);
      
      const platformIcon = video.platform === 'bilibili' ? 
        '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.249 1.524-3.76 1.56H5.32c-1.51-.036-2.769-.556-2.773-1.56V9.987c.004-1.511.263-2.765 1.26-3.76C4.569 5.231 5.347 4.707 6.16 4.653h.854L5.06 2.7c-.329-.31-.344-.803-.034-1.132.31-.329.803-.344 1.132-.034L7.574 3.27h8.852l1.417-1.736c.329-.31.822-.295 1.132.034.31.329.295.822-.034 1.132L17.813 4.653z"/></svg>' :
        '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.326 7.5c.861 0 1.56.699 1.56 1.56s-.699 1.56-1.56 1.56-1.56-.699-1.56-1.56.699-1.56 1.56-1.56zm-8.652 0c.861 0 1.56.699 1.56 1.56s-.699 1.56-1.56 1.56-1.56-.699-1.56-1.56.699-1.56 1.56-1.56z"/></svg>';
      
      card.innerHTML = `
        <div class="album-cover aspect-video mb-4">
          <img src="${video.thumbnail}" alt="${video.title}" class="w-full h-full object-cover">
          <div class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
            <button class="play-button" onclick="window.layApp.playVideo(${JSON.stringify(video).replace(/"/g, '&quot;')})">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
          </div>
          <div class="absolute bottom-3 right-3 bg-black bg-opacity-70 rounded px-2 py-1 text-xs text-white">
            ${video.duration}
          </div>
          <div class="absolute top-3 left-3 bg-white bg-opacity-90 rounded-full px-3 py-1 text-xs font-medium text-gray-700 flex items-center space-x-1">
            ${platformIcon}
            <span>${video.platform === 'bilibili' ? 'B站' : '抖音'}</span>
          </div>
        </div>
        
        <div class="space-y-3">
          <h3 class="text-lg font-bold text-gray-900">${video.title}</h3>
          <p class="text-gray-600 text-sm leading-relaxed">${video.description}</p>
          <div class="flex items-center justify-between text-sm text-gray-500">
            <div class="flex items-center space-x-4">
              <span class="flex items-center space-x-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                <span>${video.views}</span>
              </span>
            </div>
            <div class="flex items-center space-x-2">
              <svg class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
              <span>${Math.floor(Math.random() * 50 + 10)}K</span>
            </div>
          </div>
        </div>
      `;
      
      container.appendChild(card);
    });
  }
  
  // —— 3D 时间轴简化版（年份居中布局）—— 
  init3DTimeline() {
    const container = document.getElementById('timeline-3d');
    if (!container) return;
    
    // 清空容器并设置为新的布局
    container.innerHTML = '';
    container.className = 'timeline-simple-container';
    
    // 按年份分组事件
    const eventsByYear = {};
    this.timelineData.forEach((data, index) => {
      if (!eventsByYear[data.year]) {
        eventsByYear[data.year] = [];
      }
      eventsByYear[data.year].push({...data, index});
    });
    
    // 创建按年份分组的时间轴节点
    Object.keys(eventsByYear).sort().forEach(year => {
      const yearEvents = eventsByYear[year];
      
      yearEvents.forEach((data, eventIndex) => {
        const nodeContainer = document.createElement('div');
        nodeContainer.className = 'timeline-node-container';
        nodeContainer.setAttribute('data-year', data.year);
        
        nodeContainer.innerHTML = `
          <div class="timeline-node-wrapper">
            <!-- 图片容器 -->
            <div class="timeline-image-container" id="timeline-image-${data.index}">
              <img src="${data.image}" alt="${data.title}" class="timeline-event-image">
              <div class="timeline-image-overlay">
                <div class="timeline-image-icon">${this.getTypeIcon(data.type)}</div>
              </div>
            </div>
            
            <!-- 年份标记（只在该年份第一个事件显示） -->
            ${eventIndex === 0 ? `
              <div class="timeline-year-marker">${year}</div>
            ` : ''}
            
            <!-- 事件信息 -->
            <div class="timeline-node-info">
              <div class="timeline-date-label">${data.month}.${data.day}</div>
              <h3 class="timeline-node-title">${data.title}</h3>
              <p class="timeline-node-desc">${data.description}</p>
              <div class="timeline-node-type">${this.getTypeText(data.type)}</div>
            </div>
          </div>
        `;
        
        // 点击事件
        nodeContainer.addEventListener('click', () => {
          // 触发动画效果
          this.triggerTimelineNodeClick(nodeContainer, data, data.index);
          
          // 显示详情
          setTimeout(() => {
            this.showTimelineDetail(data);
          }, 800);
        });
        
        // 悬停事件
        nodeContainer.addEventListener('mouseenter', () => {
          this.onTimelineNodeHover(data.index, true);
        });
        
        nodeContainer.addEventListener('mouseleave', () => {
          this.onTimelineNodeHover(data.index, false);
        });
        
        container.appendChild(nodeContainer);
      });
    });
    
    // 添加滚动视差效果
    this.initTimelineScrollEffects();
  }
  
  // —— 音频系统 —— 
  initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      console.log('🎵 音频上下文初始化成功');
    } catch (error) {
      console.warn('音频上下文初始化失败:', error);
    }
  }
  
  // —— 工具方法 —— 
  getNodeColor(type) {
    const colors = {
      milestone: 0x3B82F6,  // 蓝色
      debut: 0xEC4899,     // 粉色
      album: 0x8B5CF6,     // 紫色
      single: 0x10B981,    // 绿色
      ongoing: 0xF59E0B    // 橙色
    };
    return colors[type] || 0x3B82F6;
  }
  
  getNodeColorHex(type) {
    return this.getNodeColor(type);
  }
  
  // 音频节拍反馈
  playBeatSound() {
    if (!this.audioContext) return;
    
    try {
      // 创建音频节拍声效
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // 设置音频参数（模拟鼓点）
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(80, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(40, this.audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.2);
      
      // 添加高频点击音
      setTimeout(() => {
        const clickOsc = this.audioContext.createOscillator();
        const clickGain = this.audioContext.createGain();
        
        clickOsc.connect(clickGain);
        clickGain.connect(this.audioContext.destination);
        
        clickOsc.type = 'triangle';
        clickOsc.frequency.setValueAtTime(800, this.audioContext.currentTime);
        
        clickGain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        clickGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);
        
        clickOsc.start(this.audioContext.currentTime);
        clickOsc.stop(this.audioContext.currentTime + 0.05);
      }, 50);
      
    } catch (error) {
      console.warn('音频播放失败:', error);
    }
  }
  
  // 悬停音效
  playHoverSound() {
    if (!this.audioContext) return;
    
    try {
      // 创建柔和的悬停音效
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // 设置音频参数（柔和的铃声）
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.08, this.audioContext.currentTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.15);
      
    } catch (error) {
      console.warn('悬停音效播放失败:', error);
    }
  }
  
  scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  playMusic(music) {
    console.log('播放音乐:', music.title);
    const musicPlayer = document.getElementById('music-player');
    if (musicPlayer) {
      musicPlayer.classList.add('active');
      
      // 更新播放器信息
      const titleElement = musicPlayer.querySelector('h4');
      const artistElement = musicPlayer.querySelector('p');
      if (titleElement) titleElement.textContent = music.title;
      if (artistElement) artistElement.textContent = `${music.album} · ${music.genre}`;
    }
    
    this.showNotification(`♪ 正在播放：${music.title}`, 'success');
  }
  
  playVideo(video) {
    console.log('播放视频:', video.title);
    
    // 创建视频播放模态框
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm z-50 flex items-center justify-center p-6';
    
    modal.innerHTML = `
      <div class="glass-card max-w-6xl w-full max-h-[90vh] overflow-hidden relative">
        <div class="flex items-center justify-between p-4 border-b border-gray-100">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900">${video.title}</h3>
              <p class="text-sm text-gray-500">${video.platform === 'bilibili' ? 'B站' : '抖音'} · ${video.views} 观看</p>
            </div>
          </div>
          <button class="control-button" onclick="this.closest('.glass-card').parentElement.remove()">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="video-player-container">
          ${video.iframeCode}
        </div>
        
        <div class="p-4">
          <p class="text-gray-700 leading-relaxed">${video.description}</p>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // 添加关闭事件
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
    
    // 播放通知
    this.showNotification(`▶ 正在播放：${video.title}`, 'success');
  }
  
  showTimelineDetail(data) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center p-6';
    
    modal.innerHTML = `
      <div class="glass-card max-w-4xl w-full max-h-[90vh] overflow-y-auto relative" style="transform: perspective(1000px) rotateY(-15deg);">
        <button class="absolute top-6 right-6 control-button z-10" onclick="this.parentElement.parentElement.remove()">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        
        <!-- 封面区域 -->
        <div class="relative h-80 bg-gradient-to-br from-gray-100 via-white to-gray-50 overflow-hidden">
          <div class="absolute inset-0">
            <img src="assets/background.jpg" alt="${data.title}" class="w-full h-full object-cover opacity-30">
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
          
          <!-- 年份大标题 -->
          <div class="absolute top-8 left-8">
            <div class="text-8xl font-black text-gray-200 opacity-50" style="font-family: 'Times New Roman', serif;">${data.year}</div>
          </div>
          
          <!-- 主标题区域 -->
          <div class="absolute bottom-8 left-8 right-16">
            <div class="flex items-center mb-4">
              <span class="text-6xl mr-4" style="animation: bounce 2s ease-in-out infinite;">${this.getTypeIcon(data.type)}</span>
              <div>
                <h1 class="text-4xl font-black text-gray-900 mb-2">${data.title}</h1>
                <div class="flex items-center space-x-4">
                  <span class="achievement-tag text-lg px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                    ${this.getTypeText(data.type)}
                  </span>
                  <span class="text-lg text-gray-600 font-medium">${data.mood || 'inspiring'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 内容区域 -->
        <div class="p-8 space-y-8">
          <!-- 故事叙述 -->
          <section class="prose prose-lg max-w-none">
            <h3 class="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span class="mr-3">📖</span>
              时光记忆
            </h3>
            <p class="text-gray-700 leading-relaxed text-lg">${data.story}</p>
          </section>
          
          <!-- 歌词区域 -->
          <section class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
            <h3 class="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span class="mr-3">🎵</span>
              经典歌词
            </h3>
            <div class="bg-white rounded-xl p-6 shadow-sm border-l-4 border-blue-500">
              <p class="text-gray-800 text-lg leading-relaxed italic whitespace-pre-line font-medium">${data.lyrics}</p>
            </div>
          </section>
          
          <!-- 创作心路 -->
          <section class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
            <h3 class="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span class="mr-3">💭</span>
              创作心声
            </h3>
            <div class="bg-white rounded-xl p-6 shadow-sm border-l-4 border-purple-500 relative">
              <div class="absolute top-4 right-4 text-6xl text-purple-200 font-serif">"</div>
              <p class="text-gray-800 text-lg leading-relaxed italic">${data.quote}</p>
              <div class="text-right mt-4">
                <span class="text-purple-600 font-medium">— 张艺兴</span>
              </div>
            </div>
          </section>
          
          <!-- 音乐可视化装饰 -->
          <section class="text-center py-8">
            <div class="flex justify-center mb-6">
              <div class="audio-visualizer">
                <div class="audio-bar"></div>
                <div class="audio-bar"></div>
                <div class="audio-bar"></div>
                <div class="audio-bar"></div>
                <div class="audio-bar"></div>
                <div class="audio-bar"></div>
                <div class="audio-bar"></div>
              </div>
            </div>
            
            <!-- 节拍点装饰 -->
            <div class="rhythm-dots">
              <div class="rhythm-dot"></div>
              <div class="rhythm-dot"></div>
              <div class="rhythm-dot"></div>
              <div class="rhythm-dot"></div>
              <div class="rhythm-dot"></div>
            </div>
          </section>
          
          <!-- 操作按钮 -->
          <section class="flex justify-center space-x-6 pt-4 border-t border-gray-100">
            <button class="btn-primary px-8 py-3 text-lg" onclick="this.closest('.glass-card').parentElement.remove()">
              <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>继续时光之旅</span>
            </button>
            <button class="btn-secondary px-8 py-3 text-lg" onclick="this.closest('.glass-card').parentElement.remove(); window.layApp?.resetTimeline()">
              <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              <span>重置视角</span>
            </button>
          </section>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // "翻书"般的入场动画
    const card = modal.querySelector('.glass-card');
    gsap.timeline()
      .fromTo(modal,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: "power2.out" }
      )
      .fromTo(card, 
        { 
          scale: 0.8, 
          opacity: 0, 
          rotateY: -45,
          transformOrigin: "left center"
        },
        { 
          scale: 1, 
          opacity: 1, 
          rotateY: 0,
          duration: 1,
          ease: "power3.out"
        },
        0.2
      )
      .fromTo(card.querySelectorAll('.audio-bar'), 
        { scaleY: 0, opacity: 0 },
        { 
          scaleY: 1, 
          opacity: 1,
          duration: 0.6, 
          stagger: 0.1, 
          ease: "back.out(1.7)" 
        },
        0.8
      )
      .fromTo(card.querySelectorAll('section'), 
        { y: 30, opacity: 0 },
        { 
          y: 0, 
          opacity: 1,
          duration: 0.8, 
          stagger: 0.2, 
          ease: "power2.out" 
        },
        0.6
      );
    
    // 添加点击外部关闭
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        gsap.timeline()
          .to(card, {
            scale: 0.9,
            opacity: 0,
            rotateY: 30,
            duration: 0.5,
            ease: "power2.in"
          })
          .to(modal, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => modal.remove()
          }, 0.2);
      }
    });
    
    // 播放打开音效
    if (this.audioContext) {
      this.playBeatSound();
    }
  }
  
  getTypeIcon(type) {
    const icons = {
      milestone: '🌟',
      debut: '🎤',
      album: '💿',
      single: '🔥',
      ongoing: '🚀'
    };
    return icons[type] || '🎵';
  }
  
  getTypeText(type) {
    const types = {
      milestone: '里程碑',
      debut: '出道',
      album: '专辑',
      single: '单曲',
      ongoing: '进行中'
    };
    return types[type] || type;
  }
  
  resetTimeline() {
    // 对于简化版时间轴，重置到顶部
    const timelineContainer = document.getElementById('timeline-3d');
    if (timelineContainer) {
      timelineContainer.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start' 
      });
      
      // 重置所有时间轴节点的动画状态
      const nodes = timelineContainer.querySelectorAll('.timeline-node-container');
      nodes.forEach(node => {
        gsap.to(node, {
          scale: 1,
          rotation: 0,
          duration: 0.5,
          ease: "power2.out"
        });
      });
      
      // 播放重置音效
      if (this.audioContext) {
        setTimeout(() => {
          this.playBeatSound();
        }, 300);
      }
      
      this.showNotification('🔄 时间轴已重置到初始状态', 'success');
    }
  }
  
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-6 z-50 p-4 rounded-xl shadow-lg transform translate-x-full transition-all duration-300 ${
      type === 'success' ? 'success-message' : 
      type === 'error' ? 'error-message' : 
      'glass-card'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }
  
  showError(message) {
    this.showNotification(message, 'error');
  }
  
  handleResize() {
    if (this.timelineScene) {
      const container = this.timelineScene.container;
      if (container.clientWidth && container.clientHeight) {
        this.timelineScene.camera.aspect = container.clientWidth / container.clientHeight;
        this.timelineScene.camera.updateProjectionMatrix();
        this.timelineScene.renderer.setSize(container.clientWidth, container.clientHeight);
      }
    }
    
    if (this.audioWaveSystem) {
      const canvas = this.audioWaveSystem.canvas;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  }
  
  handleScroll() {
    const scrollY = window.scrollY;
    
    // 导航栏在CSS中处理
    
    // 音波背景响应滚动
    if (this.audioWaveSystem) {
      const scrollFactor = scrollY * 0.0001;
      this.audioWaveSystem.waves.forEach((wave, index) => {
        wave.frequency = wave.frequency + scrollFactor * (index % 2 === 0 ? 1 : -1);
      });
    }
  }
  
  // —— Lottie 动画管理 ——
  createLottieContainer(animationPath, containerId) {
    const container = document.createElement('div');
    container.id = containerId;
    container.className = 'lottie-container';
    
    if (window.lottie) {
      try {
        const animation = window.lottie.loadAnimation({
          container: container,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: animationPath
        });
        
        this.lottieAnimations.set(containerId, animation);
        return container;
      } catch (error) {
        console.warn('Lottie动画加载失败:', error);
        return container;
      }
    } else {
      console.warn('Lottie库未加载');
      return container;
    }
  }
  
  // 初始化音乐板块旁边的Lottie动画
  initMusicSectionLottie() {
    const musicLottieContainer = document.getElementById('music-lottie');
    if (musicLottieContainer) {
      // 暂时禁用音乐板块Lottie动画
      console.log('🎨 音乐板块Lottie动画已禁用，避免加载错误');
      musicLottieContainer.style.display = 'none';
      return;
      
      /* 原代码备份
      if (window.lottie) {
        try {
          const animation = window.lottie.loadAnimation({
            container: musicLottieContainer,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: '/lottie/Animation - 1749135116565.lottie'
          });
          
          this.lottieAnimations.set('music-section', animation);
          console.log('🎨 音乐板块Lottie动画加载成功');
        } catch (error) {
          console.warn('音乐板块Lottie动画加载失败:', error);
        }
      }
      */
    }
  }
  
  // 播放特定动画
  playLottieAnimation(containerId) {
    const animation = this.lottieAnimations.get(containerId);
    if (animation) {
      animation.play();
    }
  }
  
  // 暂停特定动画
  pauseLottieAnimation(containerId) {
    const animation = this.lottieAnimations.get(containerId);
    if (animation) {
      animation.pause();
    }
  }
  
  // 设置动画速度
  setLottieSpeed(containerId, speed) {
    const animation = this.lottieAnimations.get(containerId);
    if (animation) {
      animation.setSpeed(speed);
    }
  }
  
  // —— 专辑Lottie动画管理 ——
  initAlbumLottie(albumId, animationPath) {
    const container = document.getElementById(`album-lottie-${albumId}`);
    if (container) {
      // 暂时禁用专辑Lottie动画
      console.log('🎨 专辑Lottie动画已禁用，避免加载错误:', albumId);
      container.style.display = 'none';
      return;
      
      /* 原代码备份
      if (window.lottie) {
        try {
          const animation = window.lottie.loadAnimation({
            container: container,
            renderer: 'svg',
            loop: true,
            autoplay: false,
            path: animationPath
          });
          
          this.lottieAnimations.set(`album-${albumId}`, animation);
          console.log('🎨 专辑Lottie动画加载成功:', albumId);
        } catch (error) {
          console.warn('专辑Lottie动画加载失败:', error);
        }
      }
      */
    }
  }
  
  // 专辑悬停事件
  onAlbumHover(albumId, isHovering) {
    const animation = this.lottieAnimations.get(`album-${albumId}`);
    if (animation) {
      if (isHovering) {
        animation.play();
        animation.setSpeed(1.2);
      } else {
        animation.pause();
      }
    }
  }
  
  // 歌名动态变幻
  startSongRotation(albumId, songs) {
    const songDisplay = document.querySelector(`.song-display[data-album-id="${albumId}"]`);
    if (!songDisplay || songs.length <= 1) return;
    
    let currentIndex = 0;
    
    setInterval(() => {
      const currentItem = songDisplay.querySelector('.song-item.current');
      if (currentItem) {
        currentItem.classList.remove('current');
        currentItem.classList.add('exiting');
        
        setTimeout(() => {
          currentIndex = (currentIndex + 1) % songs.length;
          const nextItem = songDisplay.children[currentIndex];
          if (nextItem) {
            // 移除所有状态类
            Array.from(songDisplay.children).forEach(item => {
              item.classList.remove('current', 'exiting', 'entering');
            });
            
            nextItem.classList.add('entering');
            setTimeout(() => {
              nextItem.classList.remove('entering');
              nextItem.classList.add('current');
            }, 50);
          }
        }, 250);
      }
    }, 3000); // 每3秒切换一次
  }
  
  // 时间轴Lottie动画初始化
  initTimelineLottie(index, animationPath) {
    const container = document.getElementById(`timeline-lottie-simple-${index}`);
    if (container && window.lottie) {
      try {
        const animation = window.lottie.loadAnimation({
          container: container,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: animationPath
        });
        
        this.lottieAnimations.set(`timeline-simple-${index}`, animation);
        console.log('🎨 时间轴Lottie动画加载成功:', index);
      } catch (error) {
        console.warn('时间轴Lottie动画加载失败:', error);
      }
    }
  }
  
  // 时间轴节点悬停
  onTimelineNodeHover(index, isHovering) {
    const imageContainer = document.getElementById(`timeline-image-${index}`);
    if (imageContainer) {
      if (isHovering) {
        gsap.to(imageContainer, {
          scale: 1.1,
          duration: 0.3,
          ease: "power2.out"
        });
        
        const overlay = imageContainer.querySelector('.timeline-image-overlay');
        if (overlay) {
          gsap.to(overlay, {
            opacity: 1,
            duration: 0.3
          });
        }
        
        // 播放悬停音效
        if (this.audioContext) {
          this.playHoverSound();
        }
      } else {
        gsap.to(imageContainer, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        });
        
        const overlay = imageContainer.querySelector('.timeline-image-overlay');
        if (overlay) {
          gsap.to(overlay, {
            opacity: 0,
            duration: 0.3
          });
        }
      }
    }
  }
  
  // 时间轴节点点击效果
  triggerTimelineNodeClick(nodeContainer, data, index) {
    const imageContainer = document.getElementById(`timeline-image-${index}`);
    if (imageContainer) {
      gsap.timeline()
        .to(imageContainer, {
          scale: 1.2,
          duration: 0.2,
          ease: "power2.out"
        })
        .to(imageContainer, {
          scale: 1,
          duration: 0.4,
          ease: "back.out(1.7)"
        });
    }
    
    // 节点动画效果
    gsap.timeline()
      .to(nodeContainer, {
        scale: 1.05,
        duration: 0.2,
        ease: "power2.out"
      })
      .to(nodeContainer, {
        scale: 1,
        duration: 0.4,
        ease: "back.out(1.7)"
      });
    
    // 播放音效
    if (this.audioContext) {
      this.playBeatSound();
    }
  }
  
  // 时间轴滚动效果
  initTimelineScrollEffects() {
    gsap.utils.toArray('.timeline-node-container').forEach((node, index) => {
      gsap.fromTo(node,
        {
          opacity: 0,
          y: 100,
          scale: 0.8
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          delay: index * 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: node,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  }
  
  playAlbum(album) {
    console.log('播放专辑:', album.albumTitle);
    const musicPlayer = document.getElementById('music-player');
    if (musicPlayer) {
      musicPlayer.classList.add('active');
      
      // 更新播放器信息
      const titleElement = musicPlayer.querySelector('h4');
      const artistElement = musicPlayer.querySelector('p');
      if (titleElement) titleElement.textContent = album.songs[0].title;
      if (artistElement) artistElement.textContent = `${album.albumTitle} · ${album.genre}`;
    }
    
    this.showNotification(`♪ 正在播放专辑：${album.albumTitle}`, 'success');
  }
  
  // 编辑歌单功能
  editPlaylist(albumId) {
    const album = this.musicData.find(a => a.id === albumId);
    if (!album) return;
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center p-6';
    
    modal.innerHTML = `
      <div class="glass-card max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-900">编辑歌单 - ${album.albumTitle}</h2>
            <button class="control-button" onclick="this.closest('.glass-card').parentElement.remove()">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div class="space-y-4" id="playlist-editor">
            ${album.songs.map((song, index) => `
              <div class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg" data-song-index="${index}">
                <div class="flex-1">
                  <input type="text" value="${song.title}" class="song-title-input w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-gray-900">
                </div>
                <div class="w-24">
                  <input type="text" value="${song.duration}" class="song-duration-input w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-gray-900 text-center">
                </div>
                <button class="control-button text-red-500 hover:text-red-700" onclick="this.parentElement.remove()">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            `).join('')}
          </div>
          
          <div class="flex items-center justify-between mt-6">
            <button class="btn-secondary" onclick="window.layApp.addNewSong(${albumId})">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              添加歌曲
            </button>
            <div class="space-x-3">
              <button class="btn-secondary" onclick="this.closest('.glass-card').parentElement.remove()">取消</button>
              <button class="btn-primary" onclick="window.layApp.savePlaylist(${albumId})">保存</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  }
  
  // 添加新歌曲
  addNewSong(albumId) {
    const editor = document.getElementById('playlist-editor');
    if (editor) {
      const songCount = editor.children.length;
      const newSongDiv = document.createElement('div');
      newSongDiv.className = 'flex items-center space-x-4 p-4 bg-gray-50 rounded-lg';
      newSongDiv.setAttribute('data-song-index', songCount);
      
      newSongDiv.innerHTML = `
        <div class="flex-1">
          <input type="text" placeholder="歌曲名称" class="song-title-input w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-gray-900">
        </div>
        <div class="w-24">
          <input type="text" placeholder="03:30" class="song-duration-input w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-gray-900 text-center">
        </div>
        <button class="control-button text-red-500 hover:text-red-700" onclick="this.parentElement.remove()">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        </button>
      `;
      
      editor.appendChild(newSongDiv);
    }
  }
  
  // 保存歌单
  savePlaylist(albumId) {
    const album = this.musicData.find(a => a.id === albumId);
    if (!album) return;
    
    const editor = document.getElementById('playlist-editor');
    if (editor) {
      const newSongs = [];
      const songItems = editor.querySelectorAll('[data-song-index]');
      
      songItems.forEach(item => {
        const titleInput = item.querySelector('.song-title-input');
        const durationInput = item.querySelector('.song-duration-input');
        
        if (titleInput.value.trim() && durationInput.value.trim()) {
          newSongs.push({
            title: titleInput.value.trim(),
            duration: durationInput.value.trim()
          });
        }
      });
      
      if (newSongs.length > 0) {
        album.songs = newSongs;
        
        // 重新渲染音乐卡片
        this.renderMusicCards();
        
        // 关闭模态框
        editor.closest('.glass-card').parentElement.remove();
        
        this.showNotification(`歌单已更新：${album.albumTitle}`, 'success');
      } else {
        this.showNotification('至少需要保留一首歌曲', 'error');
      }
    }
  }
  
  // —— 专辑封面Lottie动画管理 ——
  initAlbumCoverLottie(albumId) {
    const container = document.getElementById(`album-cover-lottie-${albumId}`);
    if (container && window.lottie) {
      // 暂时禁用Lottie动画以避免XMLHttpRequest错误
      console.log('🎨 专辑封面Lottie动画已禁用，避免加载错误:', albumId);
      container.style.display = 'none';
      return;
      
      /* 原代码备份
      try {
        const animation = window.lottie.loadAnimation({
          container: container,
          renderer: 'svg',
          loop: true,
          autoplay: false,
          path: '/lottie/Animation - 1749135116565.lottie',
          rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
          }
        });
        
        // 添加加载完成和错误处理
        animation.addEventListener('config_ready', () => {
          console.log('🎨 专辑封面Lottie动画配置完成:', albumId);
        });
        
        animation.addEventListener('data_ready', () => {
          console.log('🎨 专辑封面Lottie动画数据加载完成:', albumId);
        });
        
        animation.addEventListener('data_failed', () => {
          console.warn('专辑封面Lottie动画数据加载失败:', albumId);
          if (container) {
            container.style.display = 'none';
          }
        });
        
        this.lottieAnimations.set(`album-cover-${albumId}`, animation);
        console.log('🎨 专辑封面Lottie动画初始化成功:', albumId);
      } catch (error) {
        console.warn('专辑封面Lottie动画加载失败:', error);
        if (container) {
          container.style.display = 'none';
        }
      }
      */
    }
  }
  
  // 专辑封面悬停事件
  onAlbumCoverHover(albumId, isHovering) {
    const animation = this.lottieAnimations.get(`album-cover-${albumId}`);
    const lottieContainer = document.getElementById(`album-cover-lottie-${albumId}`);
    
    if (animation && lottieContainer) {
      if (isHovering) {
        // 显示Lottie动画并播放
        lottieContainer.style.opacity = '1';
        animation.play();
        animation.setSpeed(1.2);
        
        // 播放悬停音效
        if (this.audioContext) {
          this.playHoverSound();
        }
      } else {
        // 隐藏Lottie动画并暂停
        lottieContainer.style.opacity = '0';
        animation.pause();
      }
    }
  }
  
  // —— 全局播放器初始化 ——
  initGlobalPlayer() {
    // 创建全局播放器容器
    const playerContainer = document.createElement('div');
    playerContainer.id = 'global-music-player';
    playerContainer.className = 'fixed top-20 right-6 z-40 hidden';
    
    playerContainer.innerHTML = `
      <div class="glass-card p-4" style="min-width: 350px;">
        <div class="flex items-center justify-between mb-3">
          <div class="text-sm font-medium text-gray-600">正在播放</div>
          <button class="control-button text-xs" onclick="window.layApp.hideGlobalPlayer()">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="flex items-center space-x-3 mb-3">
          <div class="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
            <img id="player-album-cover" src="" alt="" class="w-full h-full object-cover">
          </div>
          <div class="flex-1 min-w-0">
            <div id="player-song-title" class="font-medium text-gray-900 truncate">歌曲名</div>
            <div id="player-album-title" class="text-sm text-gray-500 truncate">专辑名</div>
          </div>
        </div>
        
        <div class="mb-3">
          <iframe id="global-player-iframe" frameborder="no" border="0" marginwidth="0" marginheight="0" 
                  width="100%" height="90" 
                  src=""
                  style="border-radius: 8px; background: #f8fafc;">
          </iframe>
        </div>
      </div>
    `;
    
    document.body.appendChild(playerContainer);
    this.globalPlayer = playerContainer;
  }
  
  // 显示全局播放器
  showGlobalPlayer() {
    if (this.globalPlayer) {
      this.globalPlayer.classList.remove('hidden');
    }
  }
  
  // 隐藏全局播放器
  hideGlobalPlayer() {
    if (this.globalPlayer) {
      this.globalPlayer.classList.add('hidden');
    }
    this.isPlaying = false;
    this.currentAlbum = null;
    this.updatePlayButtonStates();
  }
  
  // 播放专辑
  playAlbum(album) {
    this.currentAlbum = album;
    this.currentSongIndex = 0;
    this.isPlaying = true;
    
    this.updateGlobalPlayer();
    this.showGlobalPlayer();
    this.updatePlayButtonStates();
    
    this.showNotification(`♪ 正在播放专辑：${album.albumTitle}`, 'success');
  }
  
  // 切换播放/暂停
  togglePlayPause(albumId) {
    const album = this.musicData.find(a => a.id === albumId);
    if (!album) return;
    
    if (this.currentAlbum?.id === albumId) {
      // 当前专辑，切换播放/暂停状态
      this.isPlaying = !this.isPlaying;
    } else {
      // 播放新专辑
      this.playAlbum(album);
      return;
    }
    
    this.updatePlayButtonStates();
    this.showNotification(this.isPlaying ? '▶ 继续播放' : '⏸ 暂停播放', 'success');
  }
  
  // 下一首
  nextSong() {
    if (!this.currentAlbum) return;
    
    this.currentSongIndex = (this.currentSongIndex + 1) % this.currentAlbum.songs.length;
    this.updateGlobalPlayer();
    this.showNotification(`♪ ${this.currentAlbum.songs[this.currentSongIndex].title}`, 'success');
  }
  
  // 上一首
  previousSong() {
    if (!this.currentAlbum) return;
    
    this.currentSongIndex = this.currentSongIndex > 0 ? this.currentSongIndex - 1 : this.currentAlbum.songs.length - 1;
    this.updateGlobalPlayer();
    this.showNotification(`♪ ${this.currentAlbum.songs[this.currentSongIndex].title}`, 'success');
  }
  
  // 更新全局播放器
  updateGlobalPlayer() {
    if (!this.currentAlbum || !this.globalPlayer) return;
    
    const currentSong = this.currentAlbum.songs[this.currentSongIndex];
    
    // 更新播放器信息
    const albumCover = this.globalPlayer.querySelector('#player-album-cover');
    const songTitle = this.globalPlayer.querySelector('#player-song-title');
    const albumTitle = this.globalPlayer.querySelector('#player-album-title');
    const iframe = this.globalPlayer.querySelector('#global-player-iframe');
    
    if (albumCover) albumCover.src = this.currentAlbum.albumCover;
    if (songTitle) songTitle.textContent = currentSong.title;
    if (albumTitle) albumTitle.textContent = this.currentAlbum.albumTitle;
    if (iframe) iframe.src = this.currentAlbum.iframeUrl;
  }
  
  // 更新播放按钮状态
  updatePlayButtonStates() {
    document.querySelectorAll('.play-pause-btn').forEach(btn => {
      const albumId = parseInt(btn.getAttribute('onclick').match(/\d+/)[0]);
      const playIcon = btn.querySelector('.play-icon');
      const pauseIcon = btn.querySelector('.pause-icon');
      
      if (this.currentAlbum?.id === albumId && this.isPlaying) {
        btn.classList.add('playing');
        if (playIcon) playIcon.classList.add('hidden');
        if (pauseIcon) pauseIcon.classList.remove('hidden');
      } else {
        btn.classList.remove('playing');
        if (playIcon) playIcon.classList.remove('hidden');
        if (pauseIcon) pauseIcon.classList.add('hidden');
      }
    });
  }
  
  // —— 抖音精选卡片渲染 —— 
  renderDouyinHighlights() {
    const container = document.querySelector('#douyin-highlights .grid');
    if (!container) return;
    
    container.innerHTML = '';
    
    this.douyinData.forEach((video, index) => {
      const card = document.createElement('div');
      card.className = 'douyin-card glass-card overflow-hidden';
      card.setAttribute('data-video-id', video.id);
      
      card.innerHTML = `
        <div class="relative">
          <!-- 抖音视频iframe -->
          <div class="douyin-player-container">
            <iframe 
              width="100%" 
              height="400" 
              src="https://open.douyin.com/player/video?vid=${video.videoId}&autoplay=0" 
              frameborder="0" 
              allowfullscreen
              referrerpolicy="unsafe-url"
              loading="lazy">
            </iframe>
          </div>
          
          <!-- 悬停遮罩 -->
          <div class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
            <button class="play-button" onclick="window.layApp.playDouyinVideo(${JSON.stringify(video).replace(/"/g, '&quot;')})">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
          </div>
          
          <!-- 抖音标识 -->
          <div class="absolute top-3 right-3 bg-black text-white rounded-full px-3 py-1 text-xs font-medium flex items-center space-x-1">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.326 7.5c.861 0 1.56.699 1.56 1.56s-.699 1.56-1.56 1.56-1.56-.699-1.56-1.56.699-1.56 1.56-1.56zm-8.652 0c.861 0 1.56.699 1.56 1.56s-.699 1.56-1.56 1.56-1.56-.699-1.56-1.56.699-1.56 1.56-1.56z"/>
            </svg>
            <span>抖音</span>
          </div>
        </div>
        
        <div class="p-6 space-y-4">
          <h3 class="text-xl font-bold text-gray-900">${video.title}</h3>
          <p class="text-gray-600 text-sm leading-relaxed">${video.description}</p>
          
          <div class="flex items-center justify-between text-sm text-gray-500">
            <div class="flex items-center space-x-4">
              <span class="flex items-center space-x-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                <span>${video.views}</span>
              </span>
            </div>
            
            <div class="flex items-center space-x-2">
              <svg class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
              <span>${video.likes}</span>
            </div>
          </div>
        </div>
      `;
      
      container.appendChild(card);
    });
  }
  
  // 播放抖音视频
  playDouyinVideo(video) {
    console.log('播放抖音视频:', video.title);
    
    // 创建抖音视频播放模态框
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm z-50 flex items-center justify-center p-6';
    
    modal.innerHTML = `
      <div class="glass-card max-w-4xl w-full max-h-[90vh] overflow-hidden relative">
        <div class="flex items-center justify-between p-4 border-b border-gray-100">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.326 7.5c.861 0 1.56.699 1.56 1.56s-.699 1.56-1.56 1.56-1.56-.699-1.56-1.56.699-1.56 1.56-1.56zm-8.652 0c.861 0 1.56.699 1.56 1.56s-.699 1.56-1.56 1.56-1.56-.699-1.56-1.56.699-1.56 1.56-1.56z"/>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900">${video.title}</h3>
              <p class="text-sm text-gray-500">抖音 · ${video.views} 观看 · ${video.likes} 点赞</p>
            </div>
          </div>
          <button class="control-button" onclick="this.closest('.glass-card').parentElement.remove()">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="douyin-modal-player">
          <iframe 
            width="100%" 
            height="500" 
            src="https://open.douyin.com/player/video?vid=${video.videoId}&autoplay=1" 
            frameborder="0" 
            allowfullscreen
            referrerpolicy="unsafe-url">
          </iframe>
        </div>
        
        <div class="p-4">
          <p class="text-gray-700 leading-relaxed">${video.description}</p>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // 添加关闭事件
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
    
    // 播放通知
    this.showNotification(`📱 正在播放抖音：${video.title}`, 'success');
  }
}

// —— 全局函数 —— 
window.scrollToSection = (sectionId) => {
  if (window.layApp) {
    window.layApp.scrollToSection(sectionId);
  }
};

window.playMusic = () => {
  if (window.layApp) {
    const firstMusic = window.layApp.musicData[0];
    window.layApp.playMusic(firstMusic);
  }
};

window.closeMobileMenu = () => {
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenu) {
    mobileMenu.classList.add('hidden');
  }
};

// —— 应用启动 —— 
document.addEventListener('DOMContentLoaded', () => {
  window.layApp = new ModernLayApp();
});

// —— 错误处理 —— 
window.addEventListener('error', (event) => {
  console.error('全局错误:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('未处理的Promise拒绝:', event.reason);
}); 