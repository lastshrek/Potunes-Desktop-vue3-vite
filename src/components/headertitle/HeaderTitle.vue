<!--
 * @Author       : lastshrek
 * @Date         : 2023-09-02 19:21:07
 * @LastEditors  : lastshrek
 * @LastEditTime : 2023-09-02 19:21:08
 * @FilePath     : /src/components/headertitle/HeaderTitle.vue
 * @Description  : HeaderTitle
 * Copyright 2023 lastshrek, All Rights Reserved.
 * 2023-09-02 19:21:07
-->
<template>
  <div class="mt-2 flex items-center justify-between px-4">
    <p class="text-gray-50 text-base font-bold underline ">{{ title }}</p>
    <p class="text-gray-400 text-xs hover:text-gray-50 cursor-pointer" v-show="showmore">查看更多</p>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: String,
  showmore: {
    type: Boolean,
    default: true
  }
})
</script>

<style scoped></style>