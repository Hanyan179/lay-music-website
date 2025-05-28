<html>
<head>
  <link rel="preconnect" href="https://fonts.gstatic.com/" crossorigin="" />
  <link
      rel="stylesheet"
      as="style"
      onload="this.rel='stylesheet'"
      href="https://fonts.googleapis.com/css2?display=swap&amp;family=Noto+Serif%3Awght%40400%3B500%3B700%3B900&amp;family=Noto+Sans%3Awght%40400%3B500%3B700%3B900"
  />

  <title>Galileo Design</title>
  <link rel="icon" type="image/x-icon" href="data:image/x-icon;base64," />

  <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
</head>
<body>
<div class="relative flex size-full min-h-screen flex-col bg-[#FFFFFF] group/design-root overflow-x-hidden" style='font-family: "Noto Serif", "Noto Sans", sans-serif;'>
  <div class="layout-container flex h-full grow flex-col">
    <div class="px-40 flex flex-1 justify-center py-5">
      <div class="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5 max-w-[960px] flex-1">
        <div class="flex flex-wrap justify-between gap-3 p-4"><p class="text-[#141414] tracking-light text-[32px] font-bold leading-tight min-w-72">游览选择</p></div>
        <div class="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
          <label class="flex flex-col min-w-40 flex-1">
            <p class="text-[#141414] text-base font-medium leading-normal pb-2">被游览人姓名</p>
            <input
                placeholder="闫涵"
                class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#141414] focus:outline-0 focus:ring-0 border-none bg-[#F0F2F5] focus:border-none h-14 placeholder:text-[#3E4D5B] p-4 text-base font-normal leading-normal"
                value=""
            />
          </label>
        </div>
        <div class="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
          <label class="flex flex-col min-w-40 flex-1">
            <p class="text-[#141414] text-base font-medium leading-normal pb-2">出生日期</p>
            <input
                placeholder="1990"
                class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#141414] focus:outline-0 focus:ring-0 border-none bg-[#F0F2F5] focus:border-none h-14 placeholder:text-[#3E4D5B] p-4 text-base font-normal leading-normal"
                value=""
            />
          </label>
          <label class="flex flex-col min-w-40 flex-1">
            <p class="text-[#141414] text-base font-medium leading-normal pb-2">地址</p>
            <input
                placeholder="123 Main St"
                class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#141414] focus:outline-0 focus:ring-0 border-none bg-[#F0F2F5] focus:border-none h-14 placeholder:text-[#3E4D5B] p-4 text-base font-normal leading-normal"
                value=""
            />
          </label>
        </div>
        <h3 class="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">人物属性</h3>
        <div class="@container">
          <div class="relative flex w-full flex-col items-start justify-between gap-3 p-4 @[480px]:flex-row @[480px]:items-center">
            <div class="flex w-full shrink-[3] items-center justify-between">
              <p class="text-[#141414] text-base font-medium leading-normal">Rating</p>
              <p class="text-[#141414] text-sm font-normal leading-normal @[480px]:hidden">5</p>
            </div>
            <div class="flex h-4 w-full items-center gap-4">
              <div class="flex h-1 flex-1 rounded-sm bg-[#DBE1E6]">
                <div class="h-full w-[32%] rounded-sm bg-[#359EFF]"></div>
                <div class="relative"><div class="absolute -left-2 -top-1.5 size-4 rounded-full bg-[#359EFF]"></div></div>
              </div>
              <p class="text-[#141414] text-sm font-normal leading-normal hidden @[480px]:block">5</p>
            </div>
          </div>
        </div>
        <h3 class="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Physical Function</h3>
        <div class="@container">
          <div class="relative flex w-full flex-col items-start justify-between gap-3 p-4 @[480px]:flex-row @[480px]:items-center">
            <div class="flex w-full shrink-[3] items-center justify-between">
              <p class="text-[#141414] text-base font-medium leading-normal">Rating</p>
              <p class="text-[#141414] text-sm font-normal leading-normal @[480px]:hidden">5</p>
            </div>
            <div class="flex h-4 w-full items-center gap-4">
              <div class="flex h-1 flex-1 rounded-sm bg-[#DBE1E6]">
                <div class="h-full w-[32%] rounded-sm bg-[#359EFF]"></div>
                <div class="relative"><div class="absolute -left-2 -top-1.5 size-4 rounded-full bg-[#359EFF]"></div></div>
              </div>
              <p class="text-[#141414] text-sm font-normal leading-normal hidden @[480px]:block">5</p>
            </div>
          </div>
        </div>
        <h3 class="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Learning Talent</h3>
        <div class="@container">
          <div class="relative flex w-full flex-col items-start justify-between gap-3 p-4 @[480px]:flex-row @[480px]:items-center">
            <div class="flex w-full shrink-[3] items-center justify-between">
              <p class="text-[#141414] text-base font-medium leading-normal">Rating</p>
              <p class="text-[#141414] text-sm font-normal leading-normal @[480px]:hidden">5</p>
            </div>
            <div class="flex h-4 w-full items-center gap-4">
              <div class="flex h-1 flex-1 rounded-sm bg-[#DBE1E6]">
                <div class="h-full w-[32%] rounded-sm bg-[#359EFF]"></div>
                <div class="relative"><div class="absolute -left-2 -top-1.5 size-4 rounded-full bg-[#359EFF]"></div></div>
              </div>
              <p class="text-[#141414] text-sm font-normal leading-normal hidden @[480px]:block">5</p>
            </div>
          </div>
        </div>
        <h3 class="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Appearance</h3>
        <div class="@container">
          <div class="relative flex w-full flex-col items-start justify-between gap-3 p-4 @[480px]:flex-row @[480px]:items-center">
            <div class="flex w-full shrink-[3] items-center justify-between">
              <p class="text-[#141414] text-base font-medium leading-normal">Rating</p>
              <p class="text-[#141414] text-sm font-normal leading-normal @[480px]:hidden">5</p>
            </div>
            <div class="flex h-4 w-full items-center gap-4">
              <div class="flex h-1 flex-1 rounded-sm bg-[#DBE1E6]">
                <div class="h-full w-[32%] rounded-sm bg-[#359EFF]"></div>
                <div class="relative"><div class="absolute -left-2 -top-1.5 size-4 rounded-full bg-[#359EFF]"></div></div>
              </div>
              <p class="text-[#141414] text-sm font-normal leading-normal hidden @[480px]:block">5</p>
            </div>
          </div>
        </div>
        <h3 class="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Opportunity Perception</h3>
        <div class="@container">
          <div class="relative flex w-full flex-col items-start justify-between gap-3 p-4 @[480px]:flex-row @[480px]:items-center">
            <div class="flex w-full shrink-[3] items-center justify-between">
              <p class="text-[#141414] text-base font-medium leading-normal">Rating</p>
              <p class="text-[#141414] text-sm font-normal leading-normal @[480px]:hidden">5</p>
            </div>
            <div class="flex h-4 w-full items-center gap-4">
              <div class="flex h-1 flex-1 rounded-sm bg-[#DBE1E6]">
                <div class="h-full w-[32%] rounded-sm bg-[#359EFF]"></div>
                <div class="relative"><div class="absolute -left-2 -top-1.5 size-4 rounded-full bg-[#359EFF]"></div></div>
              </div>
              <p class="text-[#141414] text-sm font-normal leading-normal hidden @[480px]:block">5</p>
            </div>
          </div>
        </div>
        <p class="text-[#3E4D5B] text-sm font-normal leading-normal pb-3 pt-1 px-4">Ratings are from 1 to 10</p>
        <div class="flex justify-stretch">
          <div class="flex flex-1 gap-3 flex-wrap px-4 py-3 justify-end">
            <button
                class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#F0F2F5] text-[#141414] text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span class="truncate">Randomize</span>
            </button>
            <button
                class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#F0F2F5] text-[#141414] text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span class="truncate">?</span>
            </button>
            <button
                class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#359EFF] text-[#FFFFFF] text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span class="truncate">Done</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</body>
</html>
