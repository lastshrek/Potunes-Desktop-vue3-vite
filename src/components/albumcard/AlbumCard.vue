<!--
 * @Author       : lastshrek
 * @Date         : 2023-09-02 18:27:16
 * @LastEditors  : lastshrek
 * @LastEditTime : 2023-09-02 19:28:35
 * @FilePath     : /src/components/albumcard/AlbumCard.vue
 * @Description  : album card
 * Copyright 2023 lastshrek, All Rights Reserved.
 * 2023-09-02 18:27:16
-->
<template>
  <div
    class="text-start w-full mr-2 mb-2 bg-albumcard rounded-lg px-4 pt-4 pb-2 shadow-lg hover:bg-albumcardhover text-gray-50 cursor-pointer"
    :class="max_width == 'md:w-full' ? 'md:w-full' : max_width">
    <img v-lazy="cover_url" class="mx-auto mb-4 w-full rounded-lg" />
    <h5 class="text-xs font-medium overflow-hidden whitespace-nowrap overflow-ellipsis">{{
      name }}
    </h5>
    <p class="mt-1 text-gray-400 text-xs font-medium overflow-hidden whitespace-nowrap overflow-ellipsis">{{
      artist }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps({
  cover_url: String,
  name: String,
  artist: String,
  max_width: {
    type: String,
    default: "md:max-w-xs"
  }
})
</script>

<style scoped></style>