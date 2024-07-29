<script setup lang="ts">
const defaults = {
  host: '',
  temperature: 0.8,
  template: '',
  proxy: ''
}

const options = inject<Ref<Record<string, any>>>('ollama-options', ref(defaults))

const visible = ref(false)

const items = [
  {
    slot: 'ollama',
    label: 'Ollama',
  },
  {
    slot: 'chroma',
    label: 'Chroma',
  },
  {
    slot: 'tools',
    label: 'Tools',
  },
  {
    slot: 'profile',
    label: 'Prfile',
  },
]
</script>

<template>
  <div>
    <div @click="visible = true">
      <slot />
    </div>

    <UModal v-model="visible">
      <div class="p-4 flex flex-col w-full">
        <div class="text-lg text-gray-800">Settings</div>

        <UDivider class="mt-2 mb-4" />

        <UTabs :items="items" orientation="vertical" size="sm" :ui="{ wrapper: 'grid grid-cols-4 gap-4', container: 'col-span-3' }">
          <template #ollama>
            <div class="flex flex-col w-full gap-3">
              <div class="flex flex-col w-full gap-1">
                <div class="text-sm text-gray-500">
                  Host
                </div>
                <UInput v-model="options.host" variant="outline" size="xs" />
              </div>

              <div class="flex flex-col w-full gap-1">
                <div class="text-sm text-gray-500">
                  Temperature
                </div>
                <URange v-model="options.temperature" size="xs" :min="0" :max="1" :step="0.1" />
              </div>

              <div class="flex flex-col w-full gap-1">
                <div class="text-sm text-gray-500">
                   Template
                </div>
                <UTextarea v-model="options.template" variant="outline" size="xs" :rows="2" :maxrows="2" />
              </div>
            </div>
          </template>
        </UTabs>
      </div>
    </UModal>
  </div>
</template>
