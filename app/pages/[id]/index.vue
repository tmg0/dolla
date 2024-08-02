<script setup lang="ts">
interface Props {
  offsetTop: number
}

defineProps<Props>()

const emit = defineEmits(['update:offsetTop'])
const domRef = ref()
const { md } = useMdit()
const store = useMessageStore()
const { y } = useScroll(domRef, { behavior: 'smooth' })
const { messages } = storeToRefs(store)

watchDeep(messages, async () => {
  await nextTick()
  scrollToBottom()
}, { immediate: true })

watchEffect(() => {
  emit('update:offsetTop', y.value)
})

function scrollToBottom() {
  y.value = 9007199254740991
}
</script>

<template>
  <div ref="domRef" class="w-full h-full relative z-0 overflow-y-auto py-24 flex flex-col gap-4 px-8">
    <div v-for="(item, index) in messages" :key="index" v-motion-slide-visible-once-bottom class="flex" :class="{ 'justify-end': item.role === 'user' }">
      <div class="rounded-xl min-w-1 px-3 py-1.5" :class="[item.role === 'user' ? 'bg-[#2c7aff] text-white' : 'bg-[#e9e9eb] text-gray-600']">
        <div v-if="item.images" class="w-14 h-14 bg-gray-500 rounded-lg overflow-hidden mt-1.5">
          <img :src="`data:image/png;base64,${item.images}`" class="block w-full h-full">
        </div>
        <div class="mdit leading-7" v-html="md.render(item.content)" />
      </div>
    </div>
  </div>
</template>

<style>
.mdit pre {
  padding: 12px 16px;
  border-radius: 12px;
  margin: 8px 0;
  width: 100%;
  line-height: 1.5;
  overflow-x: auto;
}
</style>
