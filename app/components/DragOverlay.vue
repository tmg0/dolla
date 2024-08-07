<script setup lang="ts">
const domRef = ref()
const { focused } = useFocus(domRef)

onMounted(async () => {
  await nextTick()
  focused.value = true
})
</script>

<template>
  <div ref="domRef" class="fixed z-50 inset-0 transition-opacity bg-gray-200/75 dark:bg-gray-800/75">
    <div data-tauri-drag-region class="h-6" />
  </div>
</template>
