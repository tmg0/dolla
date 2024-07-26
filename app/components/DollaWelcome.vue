<template>
  <div v-motion-fade-visible-once class="flex flex-col justify-center items-center w-full h-full">
    <div class="text-5xl leading-tight">
      <div class="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-cyan-500">
        Hello, Dolla
      </div>

      <div class="text-gray-300">
        How can I help you today?
      </div>

      <UButton label="Get Start !" color="gray" variant="outline" size="xl">
        <template #trailing>
          <UIcon name="i-heroicons-arrow-right-20-solid" class="w-5 h-5" />
        </template>
      </UButton>
    </div>
  </div>
</template>
