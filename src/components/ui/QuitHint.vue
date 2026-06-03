<template>
  <div
    class="overflow-hidden transition-all duration-300 ease-in-out mt-16"
    :class="visible ? 'max-h-16' : 'max-h-0'"
  >
    <div
      v-show="visible"
      class="flex items-center justify-between px-5 py-3 text-sm border-l-4"
      style="background:#222;border-left-color:#f43f5e;border-bottom:1px solid #333"
    >
      <div class="flex items-center gap-2">
        <span style="color:#aaa">再按</span>
        <kbd
          class="inline-flex items-center justify-center min-w-[30px] h-6 px-1.5 rounded text-xs font-semibold shadow-sm"
          style="background:#333;border:1px solid #555;color:#fff"
        >&#8984;Q</kbd>
        <span style="color:#fff;font-weight:500">退出程序</span>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="h-7 px-3.5 rounded text-xs font-semibold border-0 cursor-pointer"
          style="background:#f43f5e;color:#fff"
          @click="confirmQuit"
        >退出</button>
        <button
          class="h-7 w-7 flex items-center justify-center rounded border-0 cursor-pointer hover:brightness-150"
          style="color:#888;background:transparent"
          @click="dismiss"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const visible = ref(false)

const confirmQuit = () => {
  visible.value = false
  window.electron?.confirmQuit()
}

const dismiss = () => {
  visible.value = false
}

onMounted(() => {
  if (!window.electron) return
  window.electron.onShowQuitHint(() => { visible.value = true })
  window.electron.onHideQuitHint(() => { visible.value = false })
})
</script>
