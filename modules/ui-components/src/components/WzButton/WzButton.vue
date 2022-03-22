<template>
  <button
    class="px-md py-2 rounded transition duration-100 ease-in-out"
    :class="[
      block ? 'w-full' : '',
      disabled
        ? 'opacity-50 cursor-not-allowed'
        : text
        ? ''
        : 'filter hover:brightness-110 active:brightness-125',
      color && !text ? 'bg-' + color : text ? '' : 'bg-lightGray',
      text
        ? 'filter hover:bg-opacity-10 active:bg-opacity-30 hover:bg-' + color
        : ''
    ]"
    @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: {
    block: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    text: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: null
    },
    color: {
      type: String,
      default: null
    }
  }
}
</script>
