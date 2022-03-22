<template>
  <div
    class="px-4 rounded inline-block"
    :class="[classComponent, dense ? 'py-2' : 'py-4']"
  >
    <div class="flex items-center justify-between">
      <div class="rounded-full bg-white p-0.5 mr-4" v-if="iconName">
        <wz-icon :name="iconName" :color="iconColor" />
      </div>

      <slot> </slot>

      <div
        class="rounded-full bg-white p-0.5 ml-4 cursor-pointer"
        v-if="dismissable"
        @click="$emit('dismiss')"
      >
        <wz-icon name="x-circle" :color="iconColor" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: null,
      required: true
    },
    dismissable: {
      type: Boolean,
      default: false
    },
    dense: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: null
    },
    color: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      iconName: null,
      iconColor: null,
      classComponent: null
    }
  },
  watch: {
    $props: {
      handler() {
        this.switchType()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    switchType() {
      switch (this.type) {
        case 'success':
          this.icon ? (this.iconName = this.icon) : (this.iconName = 'check')
          this.color
            ? (this.iconColor = this.color)
            : (this.iconColor = 'green-500')
          this.classComponent = 'bg-green-500'
          break
        case 'info':
          this.icon ? (this.iconName = this.icon) : (this.iconName = 'info')
          this.color
            ? (this.iconColor = this.color)
            : (this.iconColor = 'blue-500')
          this.classComponent = 'bg-blue-500'
          break
        case 'warning':
          this.icon ? (this.iconName = this.icon) : (this.iconName = 'info')
          this.color
            ? (this.iconColor = this.color)
            : (this.iconColor = 'yellow-500')
          this.classComponent = 'bg-yellow-500'
          break
        case 'error':
          this.icon ? (this.iconName = this.icon) : (this.iconName = 'info')
          this.color ? (this.iconColor = this.color) : (this.iconColor = 'red')
          this.classComponent = 'bg-red'
          break
      }
    }
  }
}
</script>
