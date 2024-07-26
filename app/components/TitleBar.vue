<script setup lang="ts">
const model = defineModel()
const props = defineProps<{ host: string }>()
const emit = defineEmits(['new', 'update:host'])
const host = useVModel(props, 'host', emit)
const _host = ref('')

const visible = ref(false)

watch(visible, (value) => {
  if (value)
    _host.value = host.value
  else
    host.value = _host.value
})
</script>

<template>
  <div>
    <div data-tauri-drag-region class="flex pt-6 absolute top-0 w-full duration-300 z-10 backdrop-blur bg-white/75">
      <div class="px-2 py-2 w-full flex items-center justify-between">
        <div class="flex cursor-pointer items-center gap-1 rounded-lg py-1.5 px-3 text-lg uppercase font-semibold text-gray-600 hover:bg-gray-100 duration-300" @click="visible = true">
          <MetaIcon class="w-6" />
          <span>{{ model }}</span>
        </div>

        <div class="cursor-pointer flex gap-2 text-gray-500 items-center justify-center rounded-lg py-1.5 px-3 h-10 hover:bg-gray-100 duration-300" @click="emit('new')">
          <span>New Chat</span>
          <UIcon name="i-heroicons-plus" />
        </div>
      </div>
    </div>

    <UModal v-model="visible">
      <div class="p-4 flex flex-col gap-2">
        <div>Settings</div>
        <UInput v-model="_host" color="gray" variant="outline" placeholder="Host" />
      </div>
    </UModal>
  </div>
</template>
