<script setup lang="ts">
const model = defineModel()
</script>

<template>
  <div data-tauri-drag-region class="flex pt-6 absolute top-0 w-full duration-300 z-10 backdrop-blur bg-white/75">
    <div class="px-2 py-2 w-40 cursor-pointer">
      <div class="flex items-center gap-1 rounded-lg py-1.5 px-3 text-lg uppercase font-semibold text-gray-600 hover:bg-gray-100 duration-100">
        <MetaIcon class="w-6" />
        <span>{{ model }}</span>
      </div>
    </div>
  </div>
</template>
