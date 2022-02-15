<template>
  <div
    class="absolute left-0 right-0 bottom-5 flex items-center justify-center"
    v-show="inputVal"
    :class="
      inputVal
        ? 'transform duration-200 ease-in-out opacity-100'
        : ' transform opacity-0 duration-200 ease-in-out'
    "
  >
    <div
      class="rounded inline-block"
      :class="[
        color ? 'bg-' + color : 'bg-fontSecondary',
        multiline ? 'py-4' : 'py-2',
      ]"
    >
      <div class="flex items-center justify-between">
        <div :class="'w-' + width">
          <slot> </slot>
        </div>
        <slot name="action" @click="$emit('click')"> </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: "",
    },
    multiline: {
      type: Boolean,
      default: false,
    },
    timeout: {
      type: Number,
      default: 2000,
    },
  },
  watch: {
    inputVal(val) {
      if (val) {
        this.showComponent();
      }
    },
  },
  computed: {
    inputVal: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
  methods: {
    showComponent() {
      this.$emit("input", true);
      setTimeout(() => {
        this.$emit("input", false);
      }, this.timeout);
    },
  },
};
</script>
