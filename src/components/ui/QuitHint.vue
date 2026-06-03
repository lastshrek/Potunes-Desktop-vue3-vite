<template>
  <div
    class="quit-hint-wrapper overflow-hidden transition-all duration-300 ease-in-out"
    :class="visible ? 'max-h-14 opacity-100' : 'max-h-0 opacity-0'"
  >
    <div
      class="flex items-center justify-between px-5 py-3 text-sm select-none shadow-lg"
      style="
        background: hsl(0, 0%, 11%);
        border-left: 3px solid hsl(var(--primary));
        border-bottom: 1px solid hsl(var(--border));
      "
    >
      <div class="flex items-center gap-2">
        <span class="text-neutral-400">再按</span>
        <kbd
          class="kbd inline-flex items-center justify-center min-w-[30px] h-6 px-1.5 rounded text-xs font-semibold shadow-sm"
          style="
            background: hsl(0, 0%, 18%);
            border: 1px solid hsl(0, 0%, 28%);
            color: hsl(0, 0%, 95%);
          "
        >&#8984;Q</kbd>
        <span class="text-neutral-100 font-medium">退出程序</span>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="h-7 px-3.5 rounded text-xs font-semibold transition-all"
          style="background: hsl(var(--primary)); color: hsl(var(--primary-foreground))"
          @click="confirmQuit"
        >退出</button>
        <button
          class="h-7 w-7 flex items-center justify-center rounded text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800 transition-all"
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

  window.electron.onShowQuitHint(() => {
    visible.value = true
  })

  window.electron.onHideQuitHint(() => {
    visible.value = false
  })
})
</script>
