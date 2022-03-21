<template>
  <nav
    class="border-b border-stroke bg-white"
    :class="fixed ? 'fixed top-0 left-0 right-0' : ''"
  >
    <div
      class="max-w-screen-lg mx-auto py-4 flex items-center justify-between px-4 lg:px-0"
    >
      <slot name="logo"></slot>
      <slot name="icon"></slot>
    </div>
  </nav>
</template>

<script>
import Vue from 'vue'
export default Vue.extend({
  props: {
    fixed: {
      type: Boolean,
      default: false
    }
  }
})
</script>
