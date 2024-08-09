<script setup lang="ts">
const content = ref('')
const offsetTop = ref(0)
const router = useRouter()
const messageStore = useMessageStore()
const conversationStore = useConversationStore()
const { isNew, isFetching } = storeToRefs(messageStore)
const { isDragOver, files: images } = useFileDrop({ accept: 'image/*' })

useShiftEnter(() => content.value += '\n')

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
    conversationStore.create({ content, images }, {
      afterCreate({ id }) {
        router.replace(`/${id}`)
      },
    })

    return
  }

  messageStore.chat({ content, images })
}
</script>

<template>
  <div class="h-screen overflow-hidden elative text-sm rounded-xl">
    <TitleBar :arrived-top="isNew || offsetTop <= 16" />

    <NuxtPage v-model:offset-top="offsetTop" />

    <div class="flex flex-col px-8 py-6 gap-2 backdrop-blur bg-white/75 w-screen absolute bottom-0 z-10">
      <div class="flex flex-col w-full rounded-xl bg-white border">
        <div v-if="images.length" class="flex gap-2 items-center px-3.5 mt-2.5">
          <div v-for="(image, index) in images" :key="index" class="w-14 h-14 bg-gray-500 rounded-lg overflow-hidden">
            <img :src="`data:image/png;base64,${image}`" class="block w-full h-full">
          </div>
        </div>

        <div class="flex items-center w-full">
          <UTextarea v-model="content" :disabled="isFetching" autofocus autoresize size="xl" color="gray" variant="none" :rows="1" :maxrows="3" :placeholder="isFetching ? 'Loading...' : 'Enter a prompt here...'" class="flex-1" @keydown="keydown" />
          <UButton :icon="isFetching ? 'i-heroicons-stop' : 'i-heroicons-paper-airplane'" variant="ghost" color="gray" class="flex-shrink-0 mx-3" @click="clickSuffix" />
        </div>
      </div>
    </div>

    <DragOverlay v-if="isDragOver" />
  </div>
</template>
