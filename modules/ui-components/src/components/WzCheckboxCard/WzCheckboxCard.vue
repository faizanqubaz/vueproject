<template>
  <label :for="itemKey">
    <div
      class="rounded p-4  border flex justify-center"
      :class="[
        inputVal === itemKey ? 'border-primary' : 'border-stroke',
        disabled ? 'opacity-60 cursor-not-allowed': 'cursor-pointer',
        alignItems()
      ]"
    >
      <input
        type="radio"
        class="hidden"
        :value="itemKey"
        :id="itemKey"
        v-model="inputVal"
        :disabled="disabled"
      />
      <slot name="icon">
        <div
          class="h-8 w-8 rounded-full flex items-center justify-center border flex-none border-darkGray"
        >
          <wz-icon name="info" color="darkGray" />
        </div>
      </slot>

      <div class="flex-1 mx-4">
        <slot name="content"></slot>
      </div>
      <div
        class="h-8 w-8 rounded-full flex items-center justify-center border flex-none"
        :class="
          inputVal === itemKey
            ? 'border-primary bg-primary'
            : 'border-lightGray bg-lightGray'
        "
      >
        <wz-icon
          name="check"
          :color="inputVal === itemKey ? 'white' : 'darkGray'"
        />
      </div>
    </div>
  </label>
</template>

<script>
export default {
  props: {
    align: { type: String, default: '' },
    itemKey: {
      required: true,
      type: [String, Number]
    },
    disabled:{
      type:Boolean,
      default:false
    },
    value: null
  },
  computed: {
    inputVal: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    alignItems() {
      let align = ''
      switch (this.align) {
        case 'center':
          align = 'items-center'
          break
        case 'start':
          align = 'items-start'
          break
        case 'end':
          align = 'items-end'
          break
        case 'baseline':
          align = 'items-baseline'
          break
        case 'stretch':
          align = 'items-stretch'
          break
        default:
          align
      }
      return align
    }
  }
}
</script>
