<template>
  <div
    class="rounded h-48.5 p-4 cursor-pointer relative"
    @click="$emit('click')"
    :class="color ? 'bg-' + color : ''"
  >
    <slot> </slot>
    <div class="absolute bottom-0 right-0">
      <slot name="image"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    color: { type: String, default: '' }
  }
}
</script>
