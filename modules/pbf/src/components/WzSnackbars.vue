<template>
  <div
    class="fixed left-0 right-0 bottom-5 flex items-center justify-center duration-500 ease-in-out"
    v-show="inputVal"
  >
    <div
      class="rounded inline-block"
      :class="[
        type === 'success' ? 'bg-success' : type === 'error' ? 'bg-danger' : '',
        multiline ? 'py-4' : 'py-2',
      ]"
    >
      <div class="flex items-center justify-between w-auto">
        <div>
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
    type: {
      type: String,
      default: "success",
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
