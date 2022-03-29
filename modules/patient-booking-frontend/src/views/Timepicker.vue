<template>
  <div class="max-w-screen-md mx-auto py-14 gap sm:gap-y-10">
    <div class="pl-3 pr-3">
      <div class="w-2/5">
        <wz-progress width="5/8" />
      </div>
      <div class="pt-7 sm:flex justify-between">
        <div class="md:w-2/3">
          <h1 class="text-xl">Pick a time that works for you</h1>
        </div>
        <div class="pt-3 sm:ml-0 md:w-1/3">
          <wz-date-picker v-model="date">
            <p class="text-darkGray ml-0 md:ml-5 flex">{{ this.date.toDateString() }}</p>
          </wz-date-picker>
        </div>
      </div>
      <div class="grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-2 gap-4 py-7">
        <wz-checkbox-card
          v-for="(time, index) in timeSlots"
          :key="index"
          :itemKey="index"
          v-model="selectedSlot"
          align="center"
          class=""
          :disabled= "!time.isActive"
        >
          <template #icon>
            <wz-icon name="clock" />
          </template>
          <template #content>
            {{ formatTimeSlot(time.startTime) }} - {{ formatTimeSlot(time.endTime) }}
          </template>
        </wz-checkbox-card>
      </div>
      <div class="pt-0">
        <wz-button color="primary"
          block
          :disabled="!isValid"
          @click="nextPage"
        >
          <p class="text-white">Proceed</p>
        </wz-button>
      </div>
      <div class="pt-4 pb-4 items-center">
        <wz-button type="button" block text @click="$router.back()">
          <p class="text-darkGray">← Go back</p>
        </wz-button>
      </div>
    </div>
     <wz-snackbars v-model="snackbar.open" color="fontPrimary" :timeout="6000">
        <template>
          <div class="w-80 pl-4 text-white">{{ snackbar.message }}</div>
        </template>
        <template #action>
          <wz-button
            text
            @click="snackbar.open= false"
            color="red"
            class="text-red mr-4"
            >Close</wz-button>
        </template>
    </wz-snackbars>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import BookingApiClient from '../api/BookingApiClient'
import { parseInt } from 'lodash'
import moment from 'moment'
import 'moment-timezone'

interface SlotType {
  startTime: string
  endTime: string
  isActive: boolean
}

export default Vue.extend({
  data () {
    return {
      snackbar: {
        open: false,
        message: ''
      },
      date: new Date(),
      timeSlots: [] as SlotType[],
      selectedSlot: -1,
      validation: true
    }
  },
  async beforeMount (): Promise<void> {
    this.fetchAppointment()
  },
  methods: {
    async fetchAppointment () {
      try {
        this.$store.state.appointment.date = this.date.toISOString().split('T')[0]
        const bookingApiClient = new BookingApiClient()
        const response = await bookingApiClient.getServiceTimeSlots(this.$store.state.appointment.date, this.$store.state.location.cityId, this.$store.state.service.id)
        if (response.result.length > 0) {
          this.timeSlots = []
          this.selectedSlot = -1
          response.result.forEach((slot) => {
            this.timeSlots.push({
              startTime: slot.startTime,
              endTime: slot.endTime,
              isActive: slot.enabled && this.isAvailable(slot.startTime)
            })
          })
        } else {
          this.snackbar.message = 'Sorry! We do not have any available time slots.'
          this.snackbar.open = true
        }
      } catch (error) {
        this.snackbar.message = 'Sorry, something went wrong, please try again.'
        this.snackbar.open = true
      }
    },
    // TODO: use MomentJS
    formatTimeSlot (time: string) {
      let hour = parseInt(time.slice(0, 2))
      const suffix = hour < 12 ? ' AM' : ' PM'
      hour = hour > 12 ? hour - 12 : hour
      return ((hour < 10 ? '0' : '') + hour + suffix)
    },
    nextPage () {
      if (this.isValid) {
        this.$store.state.appointment.date = this.date.toISOString().split('T')[0]
        this.$store.state.appointment.startTime = this.timeSlots[this.selectedSlot].startTime
        this.$store.state.appointment.endTime = this.timeSlots[this.selectedSlot].endTime
        this.$router.push('/details')
      }
    },
    isAvailable (start: string) {
      const DATE_FORMAT = 'YYYY-MM-DD'
      const fetchDate = this.date.toISOString().split('T')[0]
      const startTimeMoment = moment(`${fetchDate} ${start}`, `${DATE_FORMAT} ha`).tz(this.$store.state.location.timeZone)
      return moment().isBefore(startTimeMoment)
    }
  },
  computed: {
    isValid (): boolean {
      return this.date && this.selectedSlot > -1
    }
  },
  watch: {
    date (newValue, oldValue) {
      const today = new Date().toISOString().slice(0, 10)
      const newDate = newValue.toISOString().slice(0, 10)
      if (newValue && newDate >= today) {
        this.date = newValue
        this.fetchAppointment()
      } else {
        this.date = oldValue
      }
    }
  }
})
</script>
