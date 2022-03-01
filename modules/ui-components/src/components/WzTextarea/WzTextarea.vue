<template>
  <div class="">
    <label>{{ label }}</label>
    <textarea
      class="w-full bg-transparent p-0 m-0 focus:ring-transparent border rounded md:h-36 resize-none h-32 p-4"
      :class="
        errorMessage
          ? 'border-red focus:border-red'
          : 'border-stroke focus:border-primary'
      "
      v-model="inputVal"
      @keyup="rulesChecker"
      ref="refInput"
    />
    <div class="bodySmall text-red" v-show="errorMessage">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    rules: {
      type: Array,
      default: () => []
    },
    value: {
      type: String,
      default: ''
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
  },

  data() {
    return {
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
  }
}
</script>
