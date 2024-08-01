<script setup lang="ts">
const content = ref('')
const offsetTop = ref(0)
const { shift, enter } = useMagicKeys()
const router = useRouter()
const messageStore = useMessageStore()
const conversationStore = useConversationStore()
const { isNew, isFetching } = storeToRefs(messageStore)

watchEffect(() => {
  if (shift?.value && enter?.value)
    content.value += '\n'
})

function keydown(e: KeyboardEvent) {
  if (e.keyCode === 13) {
    e.preventDefault()
    send()
  }
}

function clickSuffix() {
  (isFetching.value ? messageStore.abort : send)()
}

function send() {
  if (isNew.value && content.value) {
    conversationStore.create(content, {
      afterCreate({ id }) {
        router.replace(`/${id}`)
      },
    })

    return
  }

  messageStore.chat(content)
}
</script>

<template>
  <div class="h-screen overflow-hidden elative text-sm rounded-xl">
    <TitleBar :arrived-top="isNew || offsetTop <= 16" />

    <NuxtPage v-model:offset-top="offsetTop" />

    <div class="flex items-center px-8 py-6 gap-2 backdrop-blur bg-white/75 w-screen absolute bottom-0 z-10">
      <div class="flex items-center w-full rounded-xl bg-white border">
        <UTextarea v-model="content" :disabled="isFetching" autofocus size="xl" color="gray" variant="none" :rows="1" :placeholder="isFetching ? 'Loading...' : 'Enter a prompt here...'" class="flex-1" @keydown="keydown" />
        <UButton :icon="isFetching ? 'i-heroicons-stop' : 'i-heroicons-paper-airplane'" variant="ghost" color="gray" class="flex-shrink-0 mx-3" @click="clickSuffix" />
      </div>
    </div>
  </div>
</template>

<style>
::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>
