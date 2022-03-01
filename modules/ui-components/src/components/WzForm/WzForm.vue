<template>
  <form @submit.prevent="$emit('submit')" tabindex="0">
    <slot></slot>
  </form>
</template>

<script>
export default {
  props: {
    value: null
  },
  mounted() {
    this.$children.forEach((el, index) => {
      if (el.$refs.refInput) {
        if (el.$options.name === 'WzCheckbox') {
          el.$refs.refInput.addEventListener(
            'change',
            () => {
              this.updateValue(index)
            },
            false
          )
        } else {
          el.$refs.refInput.addEventListener(
            'input',
            () => {
              this.updateValue(index)
            },
            false
          )
          el.$refs.refInput.addEventListener(
            'blur',
            () => {
              this.updateValue(index)
            },
            false
          )
        }
      }
    })
  },
  methods: {
    validate() {
      for (let i = 0; i < this.$children.length; i++) {
        // case: component has rules and user send rules props
        if (
          typeof this.$children[i]._props.rules !== 'undefined' &&
          this.$children[i]._props.rules.length !== 0
        ) {
          this.$children[i].rulesChecker()
        }
        // component required and value null
        if (this.$children[i].required && !this.$children[i].value) {
          // case: component required, value null, user didnt send rules variable and component has errorMessage var
          if (typeof this.$children[i].errorMessage !== 'undefined') {
            this.$children[i].errorMessage = 'Required'
          }
          // case: component required, value null, component didnt have errorMessage var
          else {
            this.$children[i].checkboxVal = false
          }
        }
      }
      // check if errorMessage component value not null
      for (let i = 0; i < this.$children.length; i++) {
        if (
          this.$children[i].errorMessage ||
          this.$children[i].checkboxVal === false ||
          this.$children[i].checkboxVal === null
        ) {
          this.$emit('input', false)
          return false
        }
      }
      this.$emit('input', true)
      // pass validation
      return true
    },
    updateValue(i) {
      if (
        this.$children[i].errorMessage ||
        this.$children[i].checkboxVal === false ||
        this.$children[i].checkboxVal === null
      ) {
        this.$emit('input', false)
        return false
      }

      // check if all component is filled
      let refCheck = this.$children.filter((el, index) => {
        return (
          el.$refs.refInput &&
          (el.required ||
            (typeof el.rules !== 'undefined' && el.rules.length > 0) ||
            el.$options.name === 'WzCheckbox')
        )
      })

      let valCheck = this.$children.filter((el, index) => {
        if (el.$refs.refInput && el.$options.name !== 'WzCheckbox') {
          return (
            el.$refs.refInput.value &&
            (el.required ||
              (typeof el.rules !== 'undefined' && el.rules.length > 0) ||
              el.$options.name === 'WzCheckbox')
          )
        } else {
          if (typeof el.value !== 'undefined' && el.value.length > 0) {
            return el.value
          }
        }
      })

      // pass validation
      if (refCheck.length === valCheck.length) {
        this.$emit('input', true)
      } else {
        this.$emit('input', false)
      }
    }
  }
}
</script>

<style></style>
