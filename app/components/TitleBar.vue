<script setup lang="ts">
defineProps<{ arrivedTop: boolean }>()

const router = useRouter()
const store = useOllamaStore()
const { model } = storeToRefs(store)
const visible = ref(false)

function toggle() {
  visible.value = !visible.value
}
</script>

<template>
  <div>
    <div class="flex flex-col absolute top-0 w-full duration-300 z-10 backdrop-blur bg-white/75" :class="{ 'shadow-md': !arrivedTop }">
      <div data-tauri-drag-region class="h-6" />

      <div class="px-2 py-2 w-full flex items-center justify-between">
        <div class="flex-1 flex items-center">
          <div class="cursor-pointer flex text-gray-500 items-center rounded-lg px-3 h-10 select-none hover:bg-gray-200 duration-300" @click="toggle">
            <UIcon name="i-heroicons-adjustments-horizontal" class="w-5 h-5" />
          </div>

          <div class="border-l-2 mx-2 h-6" />

          <div class="flex cursor-pointer items-center gap-3 rounded-lg py-1.5 px-3 text-lg uppercase font-semibold select-none text-gray-600 hover:bg-gray-200 duration-300">
            <MetaIcon class="w-6" />
            <span>{{ model }}</span>
          </div>
        </div>

        <div class="cursor-pointer flex gap-2 text-gray-500 items-center justify-center rounded-lg py-1.5 px-3 h-10 select-none hover:bg-gray-200 duration-300" @click="router.replace('/')">
          <span>New Chat</span>
          <UIcon name="i-heroicons-plus" />
        </div>
      </div>
    </div>

    <SideBar v-model="visible" />
  </div>
</template>
