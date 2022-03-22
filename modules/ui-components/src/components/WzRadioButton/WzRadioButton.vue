<template>
  <div class="">
    <div class="">
      <input
        class="focus:ring-transparent w-md h-md border border-darkGray rounded-full bg-white checked:bg-primary transition duration-200 mt-1 align-top mr-2 cursor-pointer"
        type="radio"
        :id="label"
        :value="label"
        v-model="radioVal"
        ref="refInput"
      />
      <label class="inline-block text-fontSecondary mr-2" :for="label">
        {{ label }}
      </label>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: null
    },
    value: null
  },
  computed: {
    radioVal: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>
