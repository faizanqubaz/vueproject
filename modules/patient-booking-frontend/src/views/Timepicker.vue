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
        <div class="pt-3 flex justify-end">
          <wz-date-picker
            v-model="dateAndTime.date"
            :minDate="new Date()"
          >
            <p class="text-darkGray ml-0 md:ml-5">{{ printDate }}</p>
          </wz-date-picker>
        </div>
      </div>
      <div class="grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-2 gap-4 py-7">
        <wz-checkbox-card
          v-for="slot in timeSlots"
          :key="slot.id"
          :itemKey="slot.id"
          v-model="dateAndTime.id"
          align="center"
          class=""
          :disabled= "!slot.active"
        >
          <template #icon>
            <wz-icon name="clock" />
          </template>
          <template #content>
            {{ formatTimeSlot(slot.startTime, slot.endTime) }}
          </template>
        </wz-checkbox-card>
      </div>
      <div class="pt-0">
        <wz-button color="primary"
          block
          :disabled="!isValid"
          @click="proceed"
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
import moment from 'moment'
import 'moment-timezone'
import { find, cloneDeep } from 'lodash'

interface SlotType {
  startTime: string;
  endTime: string;
  active: boolean;
  id: number;
}

export default Vue.extend({
  data () {
    return {
      snackbar: {
        open: false,
        message: ''
      },
      dateAndTime: {
        startTime: '',
        endTime: '',
        date: new Date(),
        id: 0
      },
      timeSlots: [] as SlotType[],
      fromBack: false
    }
  },
  beforeMount () {
    this.dateAndTime = cloneDeep(this.$store.getters.dateAndTime)
    if (!this.dateAndTime.date) {
      this.dateAndTime.date = new Date()
    } else {
      this.fromBack = true
      this.timeSlots = this.$store.getters.timeSlots
    }
  },
  methods: {
    async fetchAppointment () {
      try {
        const bookingApiClient = new BookingApiClient()
        const fetchDate = moment(this.dateAndTime.date).format('YYYY-MM-DD')
        const response = await bookingApiClient.getServiceTimeSlots(fetchDate,
          this.$store.getters.locationCityId, this.$store.getters.serviceId)
        if (response.result.length > 0) {
          this.timeSlots = []
          this.dateAndTime.id = 0
          this.dateAndTime.startTime = ''
          this.dateAndTime.endTime = ''
          response.result.forEach((slot) => {
            this.timeSlots.push({
              id: slot.id,
              startTime: slot.startTime,
              endTime: slot.endTime,
              active: slot.enabled && this.isAvailable(fetchDate, slot.startTime)
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
    formatTimeSlot (startTime: string, endTime: string) {
      return `${moment(startTime, 'HH:mm:ss').format('h A')} - ${moment(endTime, 'HH:mm:ss').format('h A')}`
    },
    proceed () {
      this.$store.commit('setDateAndTime', this.dateAndTime)
      this.$store.commit('setTimeSlots', this.timeSlots)
      if (this.isValid) {
        this.$router.push('/details')
      }
    },
    isAvailable (fetchDate: string, startTime: string) {
      const startMoment = moment(`${fetchDate} ${startTime}`, 'YYYY-MM-DD ha').tz(this.timezone)
      return moment().isBefore(startMoment)
    }
  },
  computed: {
    isValid (): boolean {
      return !!this.dateAndTime.date && !!this.dateAndTime.id && !!this.dateAndTime.startTime && !!this.dateAndTime.endTime
    },
    printDate (): string {
      return moment(this.dateAndTime.date).format('MMMM DD YYYY')
    },
    timezone (): string {
      return this.$store.getters.locationTimeZone
    }
  },
  watch: {
    'dateAndTime.date' (newDate) {
      this.dateAndTime.date = newDate
      if (!this.fromBack) {
        this.fetchAppointment()
      } else {
        this.fromBack = false
      }
    },
    'dateAndTime.id' (newValue) {
      if (newValue) {
        const slot = find(this.timeSlots, { id: newValue })
        if (slot) {
          this.dateAndTime.startTime = slot.startTime
          this.dateAndTime.endTime = slot.endTime
        }
      }
    }
  }
})
</script>
