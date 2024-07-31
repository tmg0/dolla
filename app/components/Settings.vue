<script setup lang="ts">
const ctx = useOllamaContext()

const visible = ref(false)
</script>

<template>
  <div>
    <div @click="visible = true">
      <slot />
    </div>

    <UModal v-model="visible">
      <div class="p-4 flex flex-col w-full">
        <div class="text-lg text-gray-800">
          Settings
        </div>

        <UDivider class="mt-2 mb-4" />

        <div class="flex flex-col w-full gap-3">
          <div class="flex flex-col w-full gap-1">
            <div class="text-sm text-gray-500">
              Host
            </div>
            <UInput v-model="ctx.host" variant="outline" size="xs" />
          </div>

          <div class="flex flex-col w-full gap-1">
            <div class="text-sm text-gray-500">
              Temperature
            </div>
            <URange v-model="ctx.temperature" size="xs" :min="0" :max="1" :step="0.1" />
          </div>

          <div class="flex flex-col w-full gap-1">
            <div class="text-sm text-gray-500">
              Template
            </div>
            <UTextarea v-model="ctx.template" variant="outline" size="xs" :rows="2" :maxrows="2" />
          </div>
        </div>
      </div>
    </UModal>
  </div>
</template>
