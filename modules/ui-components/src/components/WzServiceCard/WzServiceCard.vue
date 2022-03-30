<template>
  <div
    class="rounded h-48.5 p-4 cursor-pointer relative flex items-start"
    @click="$emit('click'), $emit('input', itemKey)"
    :class="color ? 'bg-' + color : ''"
  >
    <div class="flex-1">
      <slot> </slot>
    </div>
    <div
      class="h-8 w-8 rounded-full flex items-center justify-center border flex-none"
      :class="
        value === itemKey
          ? 'border-primary bg-primary'
          : 'border-lightGray bg-lightGray'
      "
    >
      <wz-icon name="check" :color="value === itemKey ? 'white' : 'darkGray'" />
    </div>
    <div class="absolute bottom-0 right-0">
      <slot name="image"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    color: { type: String, default: '' },
    itemKey: {
      type: [String, Number]
    },
    value: null
  }
}
</script>
