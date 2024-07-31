<script setup lang="ts">
const visible = ref(false)
const domRef = ref()
const isHovered = useElementHover(domRef)
const router = useRouter()
const store = useConversationStore()
const { conversations } = storeToRefs(store)
const conversationId = useRouteParams('id', '', { transform: val => val ? Number(val) : undefined })

function toggle() {
  visible.value = !visible.value
}

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
  <div>
    <div v-show="!visible" ref="domRef" class="absolute -left-5 rounded-xl cursor-pointer transition-all duration-300" @click="toggle">
      <div class="absolute rounded-full w-2 h-6 transition-all duration-300" :class="[isHovered ? 'bg-gray-500' : 'bg-gray-300']" :style="{ transform: `translateY(0.45rem) rotate(${isHovered ? -15 : 0}deg) translateZ(0px)` }" />
      <div class="absolute rounded-full w-2 h-6 transition-all duration-300 max-w" :class="[isHovered ? 'bg-gray-500' : 'bg-gray-300']" :style="{ transform: `translateY(-0.45rem) rotate(${isHovered ? 15 : 0}deg) translateZ(0px)` }" />
    </div>

    <USlideover v-model="visible" :ui="{ width: 'max-w-72', background: 'bg-transparent' }">
      <div class="p-4 w-full h-full">
        <div class="p-3 flex flex-col justify-between h-full w-full rounded-xl bg-white">
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
      </div>
    </USlideover>
  </div>
</template>
