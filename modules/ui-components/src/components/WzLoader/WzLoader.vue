<template>
  <div>
    <div
      style="border-top-color: transparent"
      class="rounded-full animate-spin"
      :class="
        'border-' +
        borderStyle +
        ' w-' +
        size +
        ' h-' +
        size +
        ' border-' +
        color +
        ' border-' +
        weight
      "
    ></div>
  </div>
</template>

<script>
export default {
  props: {
    borderStyle: {
      type: String,
      default: 'dotted'
    },
    size: {
      type: [String, Number],
      default: '6'
    },
    weight: {
      type: [String, Number],
      default: '4'
    },
    color: {
      type: String,
      default: 'primary'
    }
  }
}
</script>

<style></style>
