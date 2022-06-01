<template>
  <div class="max-w-screen-md mx-auto py-14 gap sm:gap-y-10">
    <div class="pl-4 pr-4 pt-0">
      <div class="w-2/5">
        <wz-progress width="8/8" />
      </div>
      <div class="pt-7">
        <h1 class="text-xl">Review Appointment</h1>
        <p
          class="pt-3 text-base lg:text-lg font-normal text-gray-700 antialiased"
        >
          Please review your information
        </p>
      </div>
      <div class="my-6 px-4 pb-6 pt-3 rounded-xl border border-darkGray">
        <div
          class="h-8 w-8 rounded-full flex items-center col-span-2 mb-3 -pl-1 justify-center border flex-none border-darkGray"
        >
          <wz-icon name="info" color="darkGray" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="font-semibold">Patient Information</div>
          <div class="grid grid-cols-12">
            <div class="">:</div>
            <div class="col-span-11">
              <div class="">
                {{ $store.getters.firstName }} {{ $store.getters.lastName }}
              </div>

              <div class="">{{ printDate($store.getters.dob) }}</div>
              <div class="">{{ $store.getters.gender }}</div>
              <div class="">{{ $store.getters.phoneNumber }}</div>
              <div class="">{{ $store.getters.email }}</div>
            </div>
          </div>
          <div class="font-semibold">Address</div>
          <div class="grid grid-cols-12">
            <div class="">:</div>
            <div class="col-span-11">
              <div class="">
                {{ $store.getters.locationAddress
                }}{{
                  $store.getters.locationApartment
                    ? ', ' + $store.getters.locationApartment
                    : ''
                }}
              </div>
            </div>
          </div>
          <div class="font-semibold">Appointment Date</div>
          <div class="grid grid-cols-12">
            <div class="">:</div>
            <div class="col-span-11">
              <div class="">
                {{ formatDate($store.getters.date) }}
              </div>
              <div class="">
                {{ formatTimeSlot($store.getters.startTime) }} -
                {{ formatTimeSlot($store.getters.endTime) }}
              </div>
            </div>
          </div>
          <div class="font-semibold">Reason for Appointment</div>
          <div class="grid grid-cols-12">
            <div class="">:</div>
            <div class="col-span-11">
              <div class="">{{ $store.getters.serviceName }}</div>
              <div class="" v-if="$store.getters.notes">
                {{ $store.getters.notes }}
              </div>
            </div>
          </div>
          <div class="font-semibold" v-if="isInsurance">Total</div>
          <div class="grid grid-cols-12" v-if="isInsurance">
            <div class="">:</div>
            <div class="col-span-11">
              <div class="">${{ $store.getters.servicePrice }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="pt-5">
        <wz-button color="primary" @click="createAppointment" block>
          <p class="text-white">Confirm Appointment</p>
        </wz-button>
      </div>
      <div class="pt-5">
        <p class="text-gray-400 text-center text-sm">
          Additionally, you agree to our
          <a
            href="https://www.welz.com/privacy"
            class="text-primary"
            target="_blank"
            >Privacy Policy</a
          >
          and
          <a
            href="https://www.welz.com/terms"
            class="text-primary"
            target="_blank"
            >Terms of Service</a
          >.
        </p>
      </div>
      <div class="pt-4 items-center">
        <wz-button type="button" block text @click="$router.back()">
          <p class="text-darkGray">← Go Back</p>
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
          @click="snackbar.open = false"
          color="red"
          class="text-red mr-4"
          >Close</wz-button
        >
      </template>
    </wz-snackbars>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import BookingApiClient from '../api/BookingApiClient'
import moment from 'moment'
export default Vue.extend({
  data () {
    return {
      image: null,
      snackbar: {
        open: false,
        message: ''
      }
    }
  },
  methods: {
    async createAppointment () {
      const appointment = {
        patient: {
          firstName: this.$store.getters.firstName,
          middleName: '',
          lastName: this.$store.getters.lastName,
          dob: this.$store.getters.dob,
          gender: this.$store.getters.gender.toLowerCase(),
          phone: '+1' + this.$store.getters.phoneNumber,
          email: this.$store.getters.email,
          address: {
            street: this.$store.getters.locationStreet,
            apartment: this.$store.getters.locationApartment,
            city: this.$store.getters.locationCity,
            state: this.$store.getters.locationState,
            zipCode: this.$store.getters.locationZipCode,
            longitude: this.$store.getters.locationLongitude,
            latitude: this.$store.getters.locationLatitude,
            primary: true
          }
        },
        visit: {
          date: moment(this.$store.getters.date).startOf('day').toISOString(),
          scheduledStartTime: this.$store.getters.startTime,
          scheduledEndTime: this.$store.getters.endTime,
          serviceId: this.$store.getters.serviceId
        },
        insurance: this.$store.getters.payment.insurance
          ? this.$store.getters.insuranceInfo
          : undefined,
        payment: this.$store.getters.payment.card
          ? this.$store.getters.cardInfo
          : undefined,
        note: this.$store.getters.notes
      }
      try {
        const bookingApiClient = new BookingApiClient()
        await bookingApiClient.createAppointment(appointment)
        this.$router.push('/confirmation')
      } catch (error) {
        this.snackbar.message = 'Sorry, something went wrong, please try again.'
        this.snackbar.open = true
      }
      console.log(appointment)
    },
    formatDate (isoDate: string) {
      return moment(isoDate).format('dddd, MMMM Do YYYY')
    },
    formatTimeSlot (time: string) {
      let hour = parseInt(time.slice(0, 2))
      const suffix = hour < 12 ? ' AM' : ' PM'
      hour = hour > 12 ? hour - 12 : hour
      return (hour < 10 ? '0' : '') + hour + suffix
    },
    printDate (date: string): string {
      return moment(date).format('MM/DD/YYYY')
    }
  },
  computed: {
    isInsurance (): boolean {
      return this.$store.getters.insurance
    }
  }
})
</script>
