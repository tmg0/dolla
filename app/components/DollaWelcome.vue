<script setup lang="ts">
const TIME_RANGE = [
  [500 - 500, 1200 - 500],
  [1200 - 500, 1800 - 500],
  [1800 - 500, 2200 - 500],
  [2200 - 500, 2400],
]

const now = useDateFormat(useNow(), 'HHmm')
const formatted = computed(() => Number(now.value) - 500)

const banner = computed(() => {
  const TXT = ['Good morning', 'Good afternoon', 'Good evening', 'Good night']
  const index = TIME_RANGE.findIndex(([s, e]) => formatted.value > s && formatted.value < e)
  return TXT[index]
})
</script>

<template>
  <div v-motion-fade-visible-once class="flex flex-col justify-center items-center w-full h-full select-none">
    <div class="text-5xl leading-tight">
      <div class="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-cyan-500">
        {{ banner }}
      </div>

      <div class="text-gray-300">
        How can I help you today?
      </div>

      <UButton label="Get Start" color="gray" variant="outline" size="xl">
        <template #trailing>
          <UIcon name="i-heroicons-arrow-right-20-solid" class="w-5 h-5" />
        </template>
      </UButton>
    </div>
  </div>
</template>
