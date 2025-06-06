import * as THREE from 'https://unpkg.com/three@0.157.0/build/three.module.js'

// ===== 全局变量 =====
let scene, camera, renderer, raycaster, timelineGroup
let points = []
let hoveredIndex = -1
let scrollTargetZ = 0
let isMobile = window.innerWidth < 768
const YEAR_START = 2006
const YEAR_END   = 2024
const YEAR_GAP   = 250 // 点之间距离

// 每个年份事件数据
const EVENTS = Array.from({ length: YEAR_END - YEAR_START + 1 }, (_, i) => {
  const year = YEAR_START + i
  return {
    year,
    title: `${year} 年大事件`,
    text: `${year} 年的描述信息…`,
    img: 'assets/images/profile.jpg'
  }
})

// ===== 初始化 =====
function initThree () {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 5000)
  camera.position.set(0, 0, YEAR_END * YEAR_GAP)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.getElementById('timeline-container').appendChild(renderer.domElement)

  raycaster = new THREE.Raycaster()
  timelineGroup = new THREE.Group()
  scene.add(timelineGroup)

  // 创建点云
  EVENTS.forEach((ev, idx) => {
    const geometry = new THREE.SphereGeometry(8, 16, 16)
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff })
    const sphere = new THREE.Mesh(geometry, material)
    sphere.position.set(0, 0, -idx * YEAR_GAP)
    sphere.userData = { index: idx }
    timelineGroup.add(sphere)
    points.push(sphere)

    // 连线
    if (idx > 0) {
      const prev = points[idx - 1]
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        prev.position,
        sphere.position
      ])
      const lineMat = new THREE.LineBasicMaterial({ color: 0x444444 })
      const line = new THREE.Line(lineGeo, lineMat)
      timelineGroup.add(line)
    }

    // 年份侧边按钮
    const li = document.createElement('li')
    li.textContent = ev.year
    li.addEventListener('click', () => moveToIndex(idx))
    document.getElementById('year-list').appendChild(li)
  })

  window.addEventListener('resize', onWindowResize)
  document.addEventListener('wheel', onScroll, { passive: false })
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('click', onClick)

  animate()
}

function onWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function onScroll (e) {
  if (isMobile) return
  e.preventDefault()
  scrollTargetZ += e.deltaY * 2
  scrollTargetZ = THREE.MathUtils.clamp(scrollTargetZ, -points.length * YEAR_GAP, YEAR_GAP)
}

function onMouseMove (e) {
  const mouse = new THREE.Vector2(
    (e.clientX / window.innerWidth) * 2 - 1,
    -(e.clientY / window.innerHeight) * 2 + 1
  )
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(points)
  if (intersects.length > 0) {
    const idx = intersects[0].object.userData.index
    if (hoveredIndex !== idx) {
      if (hoveredIndex !== -1) points[hoveredIndex].scale.set(1, 1, 1)
      hoveredIndex = idx
      points[idx].scale.set(1.8, 1.8, 1.8)
      updateYearList(idx)
    }
  } else if (hoveredIndex !== -1) {
    points[hoveredIndex].scale.set(1, 1, 1)
    hoveredIndex = -1
    updateYearList(-1)
  }
}

function onClick (e) {
  if (hoveredIndex === -1) return
  const ev = EVENTS[hoveredIndex]
  showOverlay(ev)
}

function moveToIndex (idx) {
  scrollTargetZ = -idx * YEAR_GAP
}

function updateYearList (activeIdx) {
  const items = document.querySelectorAll('#year-list li')
  items.forEach((li, i) => {
    li.classList.toggle('active', i === activeIdx)
  })
}

function animate () {
  requestAnimationFrame(animate)
  // 相机缓动
  camera.position.z += (scrollTargetZ - camera.position.z) * 0.05
  renderer.render(scene, camera)
}

// ===== Overlay 弹窗 =====
function showOverlay (ev) {
  const overlay = document.getElementById('overlay')
  document.getElementById('overlay-img').src = ev.img
  document.getElementById('overlay-title').textContent = ev.title
  document.getElementById('overlay-text').textContent = ev.text
  overlay.classList.remove('hidden')
  document.getElementById('overlay-close').onclick = () => overlay.classList.add('hidden')
}

// ===== 统计数字 =====
function initCounters () {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target
        const target = +card.dataset.target
        const numSpan = card.querySelector('.stat-num')
        let current = 0
        const step = () => {
          current += Math.ceil(target / 60)
          if (current > target) current = target
          numSpan.textContent = current
          if (current < target) requestAnimationFrame(step)
        }
        step()
        observer.unobserve(card)
      }
    })
  }, { threshold: 0.4 })
  document.querySelectorAll('.stat-card').forEach(card => observer.observe(card))
}

// ===== 作品展示 =====
function initWorks () {
  const works = [
    { img: 'assets/images/work1.jpg', title: '作品一', year: 2018 },
    { img: 'assets/images/work2.jpg', title: '作品二', year: 2019 },
    { img: 'assets/images/work3.jpg', title: '作品三', year: 2020 },
    { img: 'assets/images/work4.jpg', title: '作品四', year: 2021 }
  ]
  const grid = document.getElementById('works-grid')
  works.forEach(w => {
    const card = document.createElement('div')
    card.className = 'work-card'
    card.innerHTML = `<img src="${w.img}" alt="${w.title}"><div class="work-info"><h4>${w.title}</h4><span>${w.year}</span></div>`
    card.onclick = () => alert(`${w.title} - ${w.year}`)
    grid.appendChild(card)
  })
}

// ===== 导航滚动效果 =====
function initNavbar () {
  window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50)
  })
}

// ===== 移动端降级 =====
function checkMobile () {
  if (!isMobile) return
  // 移除3D，展示年份列表
  document.getElementById('timeline-container').remove()
  const list = document.getElementById('year-list')
  list.style.position = 'static'
  list.style.display = 'flex'
  list.style.flexDirection = 'column'
  list.style.alignItems = 'center'
  list.style.padding = '40px 0'
  list.innerHTML = EVENTS.map(ev => `<li>${ev.year}</li>`).join('')
  list.querySelectorAll('li').forEach((li, idx) => li.onclick = () => showOverlay(EVENTS[idx]))
}

// ===== 启动 =====
window.addEventListener('DOMContentLoaded', () => {
  initNavbar()
  initCounters()
  initWorks()
  if (!isMobile) {
    initThree()
  } else {
    checkMobile()
  }
}) 