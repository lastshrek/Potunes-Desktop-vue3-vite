<template>
  <div
    class="quit-hint-wrapper overflow-hidden transition-all duration-300 ease-in-out"
    :class="visible ? 'max-h-14 opacity-100' : 'max-h-0 opacity-0'"
  >
    <div
      class="flex items-center justify-between px-5 py-2.5 border-t-2 text-sm select-none"
      style="border-top-color: hsl(var(--primary)); background: hsl(var(--card))"
    >
      <div class="flex items-center gap-2">
        <span class="text-muted-foreground">再按</span>
        <kbd
          class="inline-flex items-center justify-center min-w-[28px] h-6 px-1.5 rounded text-xs font-medium shadow-sm border"
          style="background: hsl(var(--muted)); border-color: hsl(var(--border)); color: hsl(var(--foreground))"
        >&#8984;Q</kbd>
        <span class="text-muted-foreground">退出程序</span>
      </div>
      <div class="flex items-center gap-1.5">
        <button
          class="h-7 px-3 rounded text-xs font-medium transition-colors hover:brightness-110"
          style="background: hsl(var(--primary)); color: hsl(var(--primary-foreground))"
          @click="confirmQuit"
        >退出</button>
        <button
          class="h-7 w-7 flex items-center justify-center rounded text-muted-foreground hover:text-foreground transition-colors"
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
import { ref, onMounted, onBeforeUnmount } from 'vue'

const visible = ref(false)

let showCleanup: (() => void) | null = null
let hideCleanup: (() => void) | null = null

const confirmQuit = () => {
  visible.value = false
  window.electron?.confirmQuit()
}

const dismiss = () => {
  visible.value = false
}

onMounted(() => {
  if (!window.electron) return

  window.electron.onShowQuitHint(() => {
    visible.value = true
  })

  window.electron.onHideQuitHint(() => {
    visible.value = false
  })
})
</script>
