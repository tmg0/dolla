<script setup lang="ts">
import markdownit from 'markdown-it'
import Shiki from '@shikijs/markdown-it'

const md = markdownit()
const domRef = ref()
const { content, messages, isFetching, submit } = useOllama('llama3.1')
const { shift, enter } = useMagicKeys()
const { y } = useScroll(domRef, { behavior: 'smooth' })

md.use(await Shiki({
  themes: {
    light: 'vitesse-light',
    dark: 'vitesse-dark',
  },
}))

function scrollToBottom() {
  y.value = 9007199254740991
}

onKeyStroke('Enter', (e) => {
  e.preventDefault()

  scrollToBottom()
  submit({
    onResponse() {
      scrollToBottom()
    },
  })
})

watchEffect(() => {
  if (shift.value && enter.value)
    content.value += '\n'
})
</script>

<template>
  <div class="h-screen overflow-hidden elative text-sm">
    <div ref="domRef" class="w-full h-full relative z-0 overflow-y-auto pb-[116px] flex flex-col gap-4 px-8 py-6">
      <div v-for="(item, index) in messages" :key="index" class="flex" :class="{ 'justify-end': item.role === 'user' }">
        <div class="rounded-xl min-w-1 px-4 py-2 bg-gray-50">
          <span class="mdit leading-7 text-black/75" v-html="md.render(item.content)" />
        </div>
      </div>
    </div>

    <div class="flex items-center px-8 py-6 gap-2 backdrop-blur-lg w-screen absolute bottom-0 z-10">
      <UTextarea v-model="content" :disabled="isFetching" autofocus size="xl" color="gray" variant="none" autoresize :rows="1" :maxrows="3" :placeholder="isFetching ? 'Fething...' : 'Enter a prompt here...'" class="flex-1 rounded-xl bg-gray-100" />
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
