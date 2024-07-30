<script setup lang="ts">
interface Props {
  conversations: any[]
  selectedIndex: number
}

const props = defineProps<Props>()

const emit = defineEmits(['select', 'remove'])
const visible = ref(false)
const domRef = ref()
const isHovered = useElementHover(domRef)

function toggle() {
  visible.value = !visible.value
}

function select(index: number) {
  visible.value = false
  emit('select', index)
}

function remove(index: number) {
  visible.value = false
  emit('remove', index)
}

function isSelected(index: number) {
  return props.selectedIndex === index
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
          <div class="flex flex-col w-full gap-1 pt-2">
            <div class="text-gray-400 text-xs font-semibold mb-1 select-none">Previous 7 Days</div>
            <div v-for="(item, index) in conversations" :key="item.createTime" class="text-sm flex items-center gap-2 justify-between select-none px-2 py-1 rounded-md cursor-pointer transition-all duration-300 hover:bg-gray-100 hover:text-gray-800" :class="[isSelected(index) ? 'bg-gray-100 text-gray-800' : ' text-gray-600']" @click="select(index)">
              <div class="truncate">{{ item.title }}</div>
              <UIcon v-if="isSelected(index)" name="i-heroicons-trash" class="flex-shrink-0 h-4 w-4 flex" @click="remove(index)" />
            </div>
          </div>

          <div>
            <UDivider :ui="{ border: { base: 'flex border-gray-100' } }" class="my-2" />

            <div class="flex flex-col w-full gap-px text-gray-600">
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
