<script setup lang="ts">
import markdownit from 'markdown-it'
import Shiki from '@shikijs/markdown-it'

const md = markdownit()
const domRef = ref()
const { options, model, content, messages, isFetching, submit } = useOllama()
const { shift, enter } = useMagicKeys()
const { y } = useScroll(domRef, { behavior: 'smooth' })

useProvideOllamaContext(options)

md.use(await Shiki({
  themes: {
    light: 'vitesse-dark',
    dark: 'vitesse-dark',
  },
}))

function scrollToBottom() {
  y.value = 9007199254740991
}


watchEffect(() => {
  if (shift?.value && enter?.value)
    content.value += '\n'
})

function handleKeyDown (e: KeyboardEvent) {
  if (e.keyCode === 13) {
    e.preventDefault()
    handleSubmit()
  }
}

function handleSubmit() {
  submit({
    onResponse() {
      scrollToBottom()
    },
  })

  scrollToBottom()
}
</script>

<template>
  <div class="h-screen overflow-hidden elative text-sm rounded-xl">
    <TitleBar v-model="model" :arrived-top="y <= 4" @new="messages = []" />

    <DollaWelcome v-if="!messages.length" class="pt-20 pb-[116px]"/>

    <div ref="domRef" class="w-full h-full relative z-0 overflow-y-auto pt-20 pb-[116px] flex flex-col gap-4 px-8 py-6">
      <div v-for="(item, index) in messages" :key="index" v-motion-slide-visible-once-bottom class="flex" :class="{ 'justify-end': item.role === 'user' }">
        <div class="rounded-xl min-w-1 px-4 py-2 bg-gray-50">
          <span class="mdit leading-7 text-black/75" v-html="md.render(item.content)" />
        </div>
      </div>
    </div>

    <div class="flex items-center px-8 py-6 gap-2 backdrop-blur bg-white/75 w-screen absolute bottom-0 z-10">
      <div  class="flex items-center w-full rounded-xl bg-gray-100">
        <UTextarea v-model="content" :disabled="isFetching" autofocus size="xl" color="gray" variant="none" autoresize :rows="1" :maxrows="3" :placeholder="isFetching ? 'Loading...' : 'Enter a prompt here...'" class="flex-1" @keydown="handleKeyDown" />
        <UButton icon="i-heroicons-paper-airplane" size="xs" :loading="isFetching" color="gray" class="flex-shrink-0 mx-3" @click="handleSubmit" />
      </div>
    </div>

    <SideBar class="absolute top-1/2 -translate-y-1/2 right-0" />
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
