<script setup lang="ts">
const emit = defineEmits(['delete'])

const items = [[
  {
    label: 'Rename',
    icon: 'i-heroicons-pencil',
  },

  {
    label: 'Delete',
    slot: 'delete',
    icon: 'i-heroicons-trash',
    click() {
      emit('delete')
    },
  },
]]
</script>

<template>
  <UDropdown mode="hover" :items="items" :ui="{ width: 'w-24' }" :popper="{ placement: 'bottom-start' }">
    <UIcon name="i-heroicons-ellipsis-vertical" class="flex-shrink-0 h-4 w-4 flex" />

    <template #delete="{ item }">
      <div class="flex items-center gap-2 text-red-500">
        <UIcon :name="item.icon" class="flex-shrink-0 h-4 w-4" />
        <span class="truncate text-xs">{{ item.label }}</span>
      </div>
    </template>

    <template #item="{ item }">
      <div class="flex items-center gap-2">
        <UIcon :name="item.icon" class="flex-shrink-0 h-4 w-4" />
        <span class="truncate text-xs">{{ item.label }}</span>
      </div>
    </template>
  </UDropdown>
</template>
