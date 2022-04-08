<template>
  <div class="">
    <div class="" :class="inputForm ? '' : 'flex items-center'">
      <date-picker
        v-model="inputVal"
        :min-date="minDate"
        :max-date="maxDate"
        :masks="{ input: masks }"
      >
        <template v-slot="{ inputValue, togglePopover, showPopover }">
          <div class="flex flex-wrap" v-if="!inputForm">
            <button
              class="flex items-center"
              @click.stop="dateSelected($event, togglePopover)"
              ref="button"
            >
              <div class="mr-3.5">
                <slot>
                  <div class="text-sm text-darkGray">
                    {{ change ? change.toLocaleDateString() : 'Select' }}
                  </div>
                </slot>
              </div>
              <wz-icon name="chevron" color="darkGray" />
            </button>
          </div>
          <div class="" v-else>
            <label>{{ label }}</label>
            <div
              class="flex items-center w-full border px-md py-sm rounded cursor-text"
              :class="[
                focus && !errorMessage ? 'border-primary' : '',
                !focus && !errorMessage ? 'border-stroke' : '',
                errorMessage ? 'border-red' : ''
              ]"
              @click.stop="dateSelected($event, showPopover)"
            >
              <wz-icon name="calendar" color="darkGray" class="mr-2" />

              <input
                class="w-full bg-transparent p-0 m-0 border-none focus:ring-transparent"
                :value="inputValue"
                @change="changeEvent($event)"
                @focus="errorMessage = null"
                @blur="focus = false"
                :placeholder="placeholder"
                @keypress="formatChecker"
                ref="refInput"
                autocomplete="false"
              />
            </div>
            <div class="bodySmall text-red" v-show="errorMessage">
              {{ errorMessage }}
            </div>
          </div>
        </template>
      </date-picker>
    </div>
  </div>
</template>

<script>
import { DatePicker } from 'v-calendar'
export default {
  props: {
    value: Date,
    minDate: Date,
    maxDate: Date,
    inputClass: String,
    masks: String,
    placeholder: String,
    label: String,
    inputForm: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      change: null,
      focus: false,
      errorMessage: null,
      formater: null
    }
  },
  components: {
    DatePicker
  },
  computed: {
    inputVal: {
      get() {
        return this.value
      },
      set(val) {
        if (!val) {
          this.errorMessage = 'Invalid Date'
        }
        this.change = val
        this.$emit('input', val)
      }
    }
  },
  methods: {
    dateSelected(e, toggle) {
      if (this.inputForm) {
        this.$refs.refInput.focus()
        this.focus = true
        toggle()
      }
      toggle({ ref: e.target })
    },
    formatChecker($event) {
      let keyCode = $event.keyCode ? $event.keyCode : $event.which
      if (keyCode < 48 || keyCode > 57) {
        $event.preventDefault()
      } else {
        $event.target.value = $event.target.value
          .replace(/^(\d\d)(\d)$/g, '$1/$2')
          .replace(/^(\d\d\/\d\d)(\d+)$/g, '$1/$2')
          .replace(/[^\d\/]/g, '')
      }
    },
    changeEvent(event) {
      if (event.target.value.length < 10) {
        this.inputVal = null
        return
      }
      let nDate = new Date(event.target.value)
      if (nDate instanceof Date && !isNaN(nDate.valueOf())) {
        this.inputVal = nDate
      } else {
        this.inputVal = null
      }
    }
  }
}
</script>

<style>
.vc-highlight {
  background-color: #3856f6 !important;
}
</style>
