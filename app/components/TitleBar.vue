<script setup lang="ts">
const emit = defineEmits(['new'])
const model = defineModel()
</script>

<template>
  <div>
    <div data-tauri-drag-region class="flex pt-6 absolute top-0 w-full duration-300 z-10 backdrop-blur bg-white/75">
      <div class="px-2 py-2 w-full flex items-center justify-between">
        <div class="flex cursor-pointer items-center gap-3 rounded-lg py-1.5 px-3 text-lg uppercase font-semibold select-none text-gray-600 hover:bg-gray-100 duration-300">
          <MetaIcon class="w-6" />
          <span>{{ model }}</span>
        </div>

        <div class="cursor-pointer flex gap-2 text-gray-500 items-center justify-center rounded-lg py-1.5 px-3 h-10 select-none hover:bg-gray-100 duration-300" @click="emit('new')">
          <span>New Chat</span>
          <UIcon name="i-heroicons-plus" />
        </div>
      </div>
    </div>
  </div>
</template>
