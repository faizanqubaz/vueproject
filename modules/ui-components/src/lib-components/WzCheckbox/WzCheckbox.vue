<template>
  <div class="">
    <div class="">
      <input
        class="focus:ring-transparent w-md h-md border border-darkGray rounded-sm bg-white checked:bg-primary checked:border-primary transition duration-200 mt-1 align-top mr-2 cursor-pointer"
        type="checkbox"
        :id="label"
        :value="label"
        v-model="checkboxVal"
      />
      <label class="inline-block text-fontSecondary mr-2" :for="label">
        {{ label }}
      </label>
    </div>
    <div class="bodySmall text-red" v-show="checkboxVal === false && required">
      Required
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: null,
    },
    value: {
      type: [Boolean, Array],
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    checkboxVal: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
};
</script>
