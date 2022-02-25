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
          ref="inputFilter"
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
            :class="
              filter && inputVal === (itemText ? opt[itemText] : opt)
                ? 'bg-lightGray text-blue'
                : ''
            "
            @mousedown="
              ;(inputVal = itemText ? opt[itemText] : opt),
                $emit('input', itemText ? opt[itemText] : opt),
                closeDropdown()
            "
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
            @mousedown="
              ;(inputVal = itemText ? opt[itemText] : opt),
                $emit('input', itemText ? opt[itemText] : opt),
                closeDropdown()
            "
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
    value: {
      type: String,
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
      stopEvent: false
    }
  },

  watch: {
    inputVal(e) {
      if (this.filter) {
        if (e) {
          this.dataFilter = this.items.filter((res) => {
            return this.itemText
              ? res[this.itemText].toLowerCase().includes(e)
              : res.toLowerCase().includes(e)
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
    blur() {
      if (this.stopEvent === 'icon') {
        this.stopEvent = false
        this.$refs.inputFilter.focus()
        return
      }

      let checker = this.items.filter((res) => {
        return this.inputVal === (this.itemText ? res[this.itemText] : res)
      })
      if (checker.length === 0) {
        this.inputVal = ''
        this.$emit('input', '')
        this.rulesChecker()
        this.closeDropdown()
      } else {
        this.closeDropdown()
      }
    },

    closeDropdown() {
      this.open = false
      this.focus = false
    },
    openDropdown(data) {
      this.stopEvent = false
      if (data === 'icon' && focus) {
        this.stopEvent = 'icon'
      }

      this.$refs.inputFilter.focus()
      this.focus = true
      this.open = true
    }
  }
}
</script>

<style></style>
