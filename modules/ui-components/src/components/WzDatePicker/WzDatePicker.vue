<template>
  <div class="">
    <div class="flex items-center">
      <date-picker v-model="inputVal" :min-date="minDate" :max-date="maxDate">
        <template #default="{ togglePopover }">
          <div class="flex flex-wrap">
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
    maxDate: Date
  },
  components: {
    DatePicker
  },
  data() {
    return {
      change: null
    }
  },
  computed: {
    inputVal: {
      get() {
        return this.value
      },
      set(val) {
        this.change = val
        this.$emit('input', val)
      }
    }
  },
  methods: {
    dateSelected(e, toggle) {
      // this.selected = date
      toggle({ ref: e.target })
    }
  }
}
</script>

<style>
.vc-highlight {
  background-color: #3856f6 !important;
}
</style>
