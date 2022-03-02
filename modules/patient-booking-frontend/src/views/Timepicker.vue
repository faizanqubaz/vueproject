<template>
  <div class="max-w-screen-md mx-auto py-14 gap sm:gap-y-10">
    <div class="pl-3 pr-3">
      <div class="w-2/5">
        <wz-progress width="5/8" />
      </div>
      <div class="pt-7 flex justify-between">
        <div class="md:w-2/3">
          <h1 class="text-xl">Pick a time that works for you</h1>
        </div>
        <div class="pt-3 md:w-1/3">
          <wz-date-picker v-model="$store.state.appointment.date">
            <p class="text-darkGray ml-24 flex">Today</p>
          </wz-date-picker>
        </div>
      </div>
      <div class="grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-2 gap-4 py-7">
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
      <div class="pt-0">
        <wz-button color="primary" block :disabled="!isValid" @click="nextPage">
          <p class="text-white">Proceed</p>
        </wz-button>
      </div>
      <div class="pt-4 items-center">
        <wz-button type="button" block text @click="$router.back()">
          <p class="text-darkGray">← Go back</p>
        </wz-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
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
    isValid () {
      return this.$store.state.appointment.timeslot
    }
  },
  methods: {
    nextPage () {
      if (this.isValid) {
        this.$router.push('/details')
      }
    }
  }
})
</script>
