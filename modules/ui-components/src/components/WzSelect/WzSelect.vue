<template>
  <div class="">
    <label>{{ label }}</label>
    <div
      class="flex items-center w-full border rounded cursor-text relative"
      :class="[
        focus && !errorMessage ? 'border-primary' : '',
        !focus && !errorMessage ? 'border-stroke' : '',
        errorMessage ? 'border-red' : ''
      ]"
      tabindex="0"
      ref="containerSelect"
      @mousedown="openDropdown()"
      @keydown="keyDown($event)"
    >
      <div
        class="flex-none pr-sm pl-md py-sm"
        @mousedown.stop="openDropdown('icon')"
        v-if="icon"
      >
        <component :is="'wz-icon'" :name="icon" color="darkGray" />
      </div>
      <div class="flex-1 py-sm cursor-default">
        <input
          type="text"
          class="w-full bg-transparent p-0 m-0 border-none focus:ring-transparent"
          v-model="inputVal"
          :placeholder="placeholder"
          ref="refInput"
          @blur="blur()"
          @keyup="rulesChecker"
        />
      </div>
      <div
        class="flex-none pr-md py-sm"
        @mousedown.stop="openDropdown('icon')"
        v-if="dropdown"
      >
        <component
          :is="'wz-icon'"
          name="chevron"
          class="transform transition duration-300 ease-in-out"
          :class="focus ? 'rotate-180' : 'rotate-0'"
          color="darkGray"
        />
      </div>

      <div class="" v-if="items">
        <!-- inputVal -->
        <div
          class="absolute -left-px -right-px top-14 rounded border border-stroke bg-white max-h-48 overflow-y-scroll filter drop-shadow-2xl"
          style="z-index: 100"
          v-show="open && items.length > 0 && !dataFilter"
        >
          <div
            v-for="opt in items"
            :key="opt.id"
            class="py-3 border-b border-stroke cursor-pointer hover:text-primary last:border-none"
            :class="[
              filter && inputVal === (itemText ? opt[itemText] : opt)
                ? 'bg-lightGray text-primary'
                : '',
              preSelect.item == (itemText ? opt[itemText] : opt)
                ? 'text-primary'
                : ''
            ]"
            @mousedown="mouseDown(opt)"
          >
            <div class="px-md text-sm">
              {{ itemText ? opt[itemText] : opt }}
            </div>
          </div>
        </div>
        <!-- inputVal filter -->
        <div
          class="absolute -left-px -right-px top-14 rounded border border-stroke bg-white max-h-48 overflow-y-scroll filter drop-shadow-2xl"
          style="z-index: 100"
          v-show="open && inputVal && dataFilter && dataFilter.length > 0"
        >
          <div
            v-for="opt in dataFilter"
            :key="opt.id"
            class="py-3 border-b border-stroke cursor-pointer hover:text-primary last:border-none"
            :class="
              preSelect.item == (itemText ? opt[itemText] : opt)
                ? 'text-primary'
                : ''
            "
            @mousedown="mouseDown(opt)"
          >
            <div class="px-md text-sm">
              {{ itemText ? opt[itemText] : opt }}
            </div>
          </div>
        </div>
        <!-- inputVal no data filter -->
        <div
          class="absolute -left-px -right-px top-14 rounded border border-stroke bg-white max-h-48 overflow-y-scroll filter drop-shadow-2xl"
          style="z-index: 100"
          v-show="open && dataFilter && dataFilter.length === 0"
        >
          <div
            class="py-3 border-b border-stroke cursor-pointer last:border-none px-md text-sm"
          >
            No data available
          </div>
        </div>
        <!-- inputVal no data inputVal -->
        <div
          class="absolute -left-px -right-px top-14 rounded border border-stroke bg-white max-h-48 overflow-y-scroll filter drop-shadow-2xl"
          style="z-index: 100"
          v-show="open && inputVal && inputVal.length > 3 && items.length === 0"
        >
          <div
            class="py-3 border-b border-stroke cursor-pointer last:border-none px-md text-sm"
          >
            No data available
          </div>
        </div>
      </div>
    </div>
    <div class="bodySmall text-red" v-show="errorMessage">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    rules: {
      type: Array,
      default: () => []
    },
    label: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    items: {
      type: Array,
      default: () => []
    },
    dropdown: { type: Boolean, default: true },
    itemText: {
      type: String,
      default: ''
    },
    filter: {
      type: Boolean,
      default: true
    },
    placeholder: String,
    value: {
      type: String | Object,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    }
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

  data() {
    return {
      focus: false,
      errorMessage: null,
      open: false,
      dataFilter: null,
      stopEvent: false,
      preSelect: {
        iteration: null,
        filterIteration: null,
        item: null
      },
      focusOut: false
    }
  },

  watch: {
    inputVal(e) {
      if (this.filter) {
        if (e && this.items && this.items.length > 0) {
          this.dataFilter = this.items.filter((res) => {
            return this.itemText
              ? res[this.itemText]
                  .toLowerCase()
                  .includes(
                    typeof e === 'object'
                      ? e[this.itemText].toLowerCase()
                      : e.toLowerCase()
                  )
              : res
                  .toLowerCase()
                  .includes(
                    typeof e === 'object'
                      ? e[this.itemText].toLowerCase()
                      : e.toLowerCase()
                  )
            // return res.includes(e);
          })
        } else {
          this.dataFilter = null
        }

        this.items.forEach((res) => {
          if (!this.itemText) {
            if (res === this.inputVal) {
              this.dataFilter = null
            }
          } else if (this.itemText) {
            if (res[this.itemText] === this.inputVal) {
              this.dataFilter = null
            }
          }
        })
      }
      if (this.required && e) this.errorMessage = null
      else if (this.required && !e) this.errorMessage = 'Required'
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
    },
    blur(preSelect) {
      if (this.stopEvent === 'icon') {
        this.stopEvent = false
        this.$refs.refInput.focus()
        return
      }

      if (!this.inputVal) {
        this.inputVal = preSelect
        return
      }

      let checker = this.items.filter((res) => {
        return (
          (this.itemText ? res[this.itemText] : res) ===
          (typeof this.inputVal === 'object'
            ? this.inputVal[this.itemText]
            : this.inputVal)
        )
      })
      if (checker.length > 0 && typeof checker[0] === 'object') {
        this.inputVal = checker[0][this.itemText]
      }

      if (checker.length === 0) {
        this.inputVal = ''
        this.$emit('input', '')
        this.rulesChecker()
        this.closeDropdown()
      } else {
        this.closeDropdown()
      }
    },
    mouseDown(opt) {
      this.$emit('input', opt)
      this.closeDropdown()
    },

    closeDropdown() {
      this.open = false
      this.focus = false
      this.preSelect.item = null
      this.preSelect.iteration = null
      this.preSelect.filterIteration = null
    },
    openDropdown(data) {
      if (data === 'icon') {
        return
      }
      this.stopEvent = false

      this.$refs.refInput.focus()
      this.focus = true

      this.open = true
    },
    keyDown(e) {
      if (this.items && this.items.length > 0) {
        if (!this.open) {
          this.$refs.refInput.focus()
          this.focus = true
          this.open = true
        }
        if (e.keyCode === 40) {
          if (this.open && !this.dataFilter) {
            if (this.preSelect.iteration === null) {
              this.preSelect.item = this.itemText
                ? this.items[0][this.itemText]
                : this.items[0]
              this.preSelect.iteration = 0
              return
            }
            this.preSelect.iteration =
              this.preSelect.iteration < this.items.length - 1
                ? this.preSelect.iteration + 1
                : 0
            this.preSelect.item = this.itemText
              ? this.items[this.preSelect.iteration][this.itemText]
              : this.items[this.preSelect.iteration]
          }
          if (this.open && this.dataFilter && this.dataFilter.length > 0) {
            if (this.preSelect.filterIteration === null) {
              this.preSelect.item = this.itemText
                ? this.dataFilter[0][this.itemText]
                : this.dataFilter[0]
              this.preSelect.filterIteration = 0
              return
            }
            this.preSelect.filterIteration =
              this.preSelect.filterIteration < this.dataFilter.length - 1
                ? this.preSelect.filterIteration + 1
                : 0
            this.preSelect.item = this.itemText
              ? this.dataFilter[this.preSelect.filterIteration][this.itemText]
              : this.dataFilter[this.preSelect.filterIteration]
          }
        }
        if (e.keyCode === 38) {
          if (this.open && !this.dataFilter) {
            if (this.preSelect.iteration === null) {
              this.preSelect.item = this.itemText
                ? this.items[this.items.length - 1][this.itemText]
                : this.items[this.items.length - 1]
              this.preSelect.iteration = this.items.length - 1
              return
            }
            this.preSelect.iteration =
              this.preSelect.iteration > 0
                ? this.preSelect.iteration - 1
                : this.items.length - 1
            this.preSelect.item = this.itemText
              ? this.items[this.preSelect.iteration][this.itemText]
              : this.items[this.preSelect.iteration]
          }
          if (this.open && this.dataFilter && this.dataFilter.length > 0) {
            if (this.preSelect.filterIteration === null) {
              this.preSelect.item = this.itemText
                ? this.dataFilter[this.dataFilter.length - 1][this.itemText]
                : this.dataFilter[this.dataFilter.length - 1]
              this.preSelect.filterIteration = this.dataFilter.length - 1
              return
            }
            this.preSelect.filterIteration =
              this.preSelect.filterIteration > 0
                ? this.preSelect.filterIteration - 1
                : this.dataFilter.length - 1
            this.preSelect.item = this.itemText
              ? this.dataFilter[this.preSelect.filterIteration][this.itemText]
              : this.dataFilter[this.preSelect.filterIteration]
          }
        }
        if (e.keyCode === 13) {
          let checker = this.items.filter((res) => {
            return (
              (this.itemText ? res[this.itemText] : res) === this.preSelect.item
            )
          })

          this.mouseDown(checker[0])
          setTimeout(() => {
            this.$refs.refInput.blur()
          }, 0)
        }
      }
    }
  }
}
</script>

<style></style>
