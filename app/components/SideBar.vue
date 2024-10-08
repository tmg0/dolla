<script setup lang="ts">
const visible = defineModel<boolean>()
const router = useRouter()
const store = useConversationStore()
const { conversations } = storeToRefs(store)
const conversationId = useRouteParams('id', '', { transform: val => val ? Number(val) : undefined })

function isSelected(id: number) {
  return conversationId.value === id
}

function select(id: number) {
  visible.value = false
  router.replace(`/${id}`)
}

async function removeItem(id: number) {
  await store.removeItem(id as number)
  visible.value = false
  router.replace('/')
}
</script>

<template>
  <USlideover v-model="visible" side="left" :ui="{ width: 'max-w-64' }">
    <div data-tauri-drag-region class="h-6" />

    <div class="p-3 flex flex-col justify-between h-full w-full">
      <div class="flex flex-col w-full gap-1 h-0 flex-1 overflow-y-auto">
        <div class="text-gray-400 text-xs font-semibold mb-1 select-none">
          Recents
        </div>

        <div v-for="item in conversations" :key="item.id" class="text-sm flex items-center justify-between gap-2 select-none px-2 py-1 rounded-md cursor-pointer transition-all duration-300 hover:bg-gray-100 hover:text-gray-900" :class="[isSelected(item.id) ? 'bg-gray-100 text-gray-900' : ' text-gray-600']" @click="select(item.id)">
          <UIcon name="i-heroicons-chat-bubble-left-right" class="flex-shrink-0 h-4 w-4 flex" />
          <div class="truncate flex-1">
            {{ item.title || 'New Chat' }}
          </div>
          <ConversationActionGroup v-if="isSelected(item.id)" @delete="removeItem(item.id)" />
        </div>

        <Placeholder v-if="!conversations.length" class="h-16" />
      </div>

      <div>
        <UDivider :ui="{ border: { base: 'flex border-gray-100' } }" class="mb-2" />

        <div class="flex flex-col w-full gap-px text-gray-600">
          <Settings>
            <div class="group/item flex items-center gap-2 px-2 py-1 text-sm rounded-md cursor-pointer transition-all duration-300 hover:bg-gray-100 hover:text-gray-900">
              <UIcon name="i-heroicons-cog-8-tooth" class="flex-shrink-0 h-4 w-4 transition-all duration-300 group-hover/item:rotate-45" />
              <span>Settings</span>
            </div>
          </Settings>
        </div>
      </div>
    </div>
  </USlideover>
</template>
