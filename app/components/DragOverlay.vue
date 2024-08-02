<script setup lang="ts">
const domRef = ref()
const { focused } = useFocus(domRef)

onMounted(async () => {
  await nextTick()
  focused.value = true
})
</script>

<template>
  <div ref="domRef" class="fixed top-0 left-0 right-0 bottom-0 bg-black/50 z-50 text-white">
    <div data-tauri-drag-region class="h-6" />
  </div>
</template>
