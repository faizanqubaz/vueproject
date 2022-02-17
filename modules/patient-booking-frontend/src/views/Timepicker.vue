<template>
  <div class="max-w-screen-md mx-auto py-14 gap sm:gap-y-10">
    <div class="pl-3 pr-3">
      <div class="w-2/5">
        <wz-progress width="4/8" />
      </div>
      <div class="pt-7 flex justify-between">
        <div class="md:w-2/3">
          <h1 class="text-xl">Pick a time that works for you</h1>
        </div>
        <div class="md:w-1/3">
          <wz-button type="button" block text>
            <div class="text-darkGray ml-24 flex pt-5">Today ⌵</div>
          </wz-button>
        </div>
      </div>
      <div class="grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-2 gap-4 pt-3">
        <wz-checkbox-card
          v-for="time in timeslot"
          :key="time"
          :itemKey="time"
          v-model="$store.state.appointment.timeslot"
          align="center"
          class=""
        >
          <template #icon>
            <wz-icon name="clock" />
          </template>
          <template #content>
            {{ time }}
          </template>
        </wz-checkbox-card>
      </div>
      <div class="pt-5">
        <wz-button color="primary" block :disabled="!isClickValid" @click="nextPage">
          <div class="text-white">Proceed</div>
        </wz-button>
      </div>
      <div class="pt-4 items-center">
        <wz-button type="button" block text @click="$router.back()">
          <div class="text-darkGray">← Go back</div>
        </wz-button>
      </div>
    </div>
  </div>
</template>
<script>
import { isEmpty } from 'lodash'
export default {
  data () {
    return {
      timeslot: [
        '08 AM - 10 AM',
        '10 AM - 12 AM',
        '12 PM - 02 PM',
        '02 PM - 04PM',
        '04 PM - 06 PM',
        '06 PM- 08 PM'
      ]
    }
  },
  computed: {
    isClickValid: function () {
      return !isEmpty(this.$store.state.appointment.timeslot)
    }
  },
  methods: {
    nextPage () {
      if (this.isClickValid) {
        this.$router.push('/details')
      }
    }
  }
}
</script>
