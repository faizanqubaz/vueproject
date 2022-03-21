<template>
  <div class="w-full bg-lightGray h-2 rounded">
    <div
      class="bg-primary h-2 rounded transition-all duration-300 ease-in-out"
      :class="'w-' + width"
    ></div>
  </div>
</template>

<script>
import Vue from 'vue'
export default Vue.extend({
  props: {
    width: String
  }
})
</script>

<style></style>
