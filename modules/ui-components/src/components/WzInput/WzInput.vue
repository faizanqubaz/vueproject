<template>
  <div class="">
    <label>{{ label }}</label>
    <div
      class="flex items-center w-full border px-md py-sm rounded cursor-text"
      :class="[
        focus && !errorMessage ? 'border-primary' : '',
        !focus && !errorMessage ? 'border-stroke' : '',
        errorMessage ? 'border-red' : ''
      ]"
      @click="$refs.refInput.focus(), (focus = true)"
    >
      <component
        :is="'wz-icon'"
        :name="icon"
        class="mr-2"
        color="darkGray"
        v-if="icon"
      />
      <input
        :type="type"
        class="w-full bg-transparent p-0 m-0 border-none focus:ring-transparent"
        ref="refInput"
        @blur="focus = false"
        v-model="inputVal"
        @keyup="rulesChecker"
        @keypress="$emit('keypress', $event)"
      />
    </div>
    <div class="bodySmall text-red" v-show="errorMessage">
      {{ errorMessage }}
    </div>
  </div>
</template>
<script>
export default {
  props: {
    type: {
      type: String,
      default: 'text'
    },
    icon: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    rules: {
      type: Array,
      default: () => []
    },
    required: {
      type: Boolean,
      default: false
    },
    value: null
  },

  data() {
    return {
      focus: false,
      errorMessage: null
    }
  },
  methods: {
    rulesChecker() {
      if (this.rules && this.rules.length > 0) {
        for (let i = 0; i < this.rules.length; i++) {
          if (this.rules[i](this.inputVal) !== true) {
            this.errorMessage = this.rules[i](this.inputVal)
            return
          } else {
            this.errorMessage = null
          }
        }
      }
    }
  },

  computed: {
    inputVal: {
      get() {
        return this.value
      },
      set(val) {
        if (this.required && this.rules.length === 0) {
          val ? (this.errorMessage = false) : (this.errorMessage = 'Required')
        }
        this.$emit('input', val)
      }
    }
  }
}
</script>
