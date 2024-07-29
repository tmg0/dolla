<script setup lang="ts">
const visible = ref(false)
const domRef = ref()
const isHovered = useElementHover(domRef)

function toggle() {
  visible.value = !visible.value
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
          <div />

          <div>
            <UDivider :ui="{ border: { base: 'flex border-gray-100' } }" class="my-2" />

            <div class="flex flex-col w-full gap-px text-gray-500">
              <Settings>
                <div class="group/item flex items-center gap-2 px-2 py-1 text-sm rounded-md cursor-pointer transition-all duration-300 hover:bg-gray-100 hover:text-gray-800">
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
