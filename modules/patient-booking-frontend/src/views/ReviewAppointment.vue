<template>
  <div class="max-w-screen-md mx-auto py-14 gap sm:gap-y-10">
    <div class="pl-4 pr-4 pt-0">
      <div class="w-2/5">
        <wz-progress width="8/8" />
      </div>
      <div class="pt-7">
        <h1 class="text-xl">Review Appointment</h1>
        <p class="pt-3 text-base lg:text-lg font-normal text-gray-700 antialiased">
          Please review your order
        </p>
      </div>
      <div class="pt-10 pb-7 grid md:grid md:grid-cols-2 grid-cols-1 gap-y-7 gap-x-10 md:gap-x-10">
        <div class="grid grid-cols-1 gap-y-7">
          <div class="gap-y-7">
            <div class="grid grid-cols-2">
              <label for="firstname" class="font-extralight text-sm">First Name</label>
              <label for="lastname" class="font-extralight text-sm">Last Name</label>
            </div>
            <div class="grid grid-cols-2">
              <p>{{ $store.getters.firstName }}</p>
              <p>{{ $store.getters.lastName }}</p>
            </div>
            <hr class="w-80"/>
          </div>
          <div class="gap-y-7">
            <div>
              <label for="phonenumber" class="font-extralight text-sm">Phone</label>
            </div>
            <div>
              <p>{{ $store.getters.phoneNumber }}</p>
            </div>
            <hr class="w-80"/>
          </div>
          <div class="gap-y-7">
            <div class="grid grid-cols-2">
              <label for="gender" class="font-extralight text-sm">Gender</label>
              <label for="dob" class="font-extralight text-sm">Date of Birth</label>
            </div>
            <div class="grid grid-cols-2">
              <p>
                {{ $store.getters.gender }}
              </p>
              <p>{{ printDate($store.getters.dob) }}</p>
            </div>
            <hr class="w-80"/>
          </div>
          <div class="gap-y-7">
            <div>
              <label for="address" class="font-extralight text-sm">Address</label>
            </div>
            <div>
              <p>{{ $store.getters.locationAddress }}</p>
            </div>
            <hr class="w-80"/>
          </div>
          <div class="gap-y-7">
            <div>
              <label for="apartment" class="font-extralight text-sm">Apartment #</label>
            </div>
            <div class="grid grid-cols-2">
              <p>{{ $store.getters.locationApartment }}</p>
            </div>
            <hr class="w-80"/>
          </div>
          <div class="gap-y-7">
            <div class="grid grid-cols-2">
              <label for="gender" class="font-extralight text-sm">Date</label>
              <label for="dob" class="font-extralight text-sm">Time</label>
            </div>
            <div class="grid grid-cols-2">
              <p>
                {{ printDate($store.getters.date) }}
              </p>
              <p>{{ formatTimeSlot($store.getters.startTime) }} - {{ formatTimeSlot($store.getters.endTime) }}</p>
            </div>
            <hr class="w-80"/>
          </div>
        </div>
        <div>
          <div class=" rounded p-4 cursor-pointer border flex justify-center">
            <div class="h-8 w-8 rounded-full flex items-center justify-center border flex-none border-darkGray border-stroke">
              <wz-icon name="info" color="darkGray" />
            </div>
            <div class="py-5 flex-1 mx-4">
              <div class="mx-4 flex flex-col items-center justify-center">
                <img :src="$store.getters.serviceTypeImage" class="mb-4 h-12" :alt="image" />
                <p class="text-fontPrimary mb-2">{{ $store.getters.serviceTypeName }}</p>
                <p class="font-normal text-fontSecondary mb-2">{{$store.getters.serviceTypeDescription }}</p>
                <p class="font-normal text-primary"> {{ isInsurance ? '' : '$ ' + $store.getters.serviceTypePrice }}</p>
              </div>
            </div>
          </div>
          <div class="pt-5 flex justify-between">
            <p class="text-gray-500"> {{ isInsurance ? '' : 'Total: ' }} </p>
            <p class="font-normal text-primary"> {{ isInsurance ? '' : '$ ' + $store.getters.serviceTypePrice }}</p>
          </div>
        </div>
      </div>
      <div class="pt-5">
        <wz-button color="primary" @click="createAppointment" block>
          <p class="text-white">Confirm Appointment</p>
        </wz-button>
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
export default Vue.extend({
  data () {
    return {
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
          date: this.$store.getters.date,
          scheduledStartTime: this.$store.getters.startTime,
          scheduledEndTime: this.$store.getters.endTime,
          serviceId: this.$store.getters.serviceId
        },
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
    },
    // TODO: use MomentJS
    formatTimeSlot (time: string) {
      let hour = parseInt(time.slice(0, 2))
      const suffix = hour < 12 ? ' AM' : ' PM'
      hour = hour > 12 ? hour - 12 : hour
      return ((hour < 10 ? '0' : '') + hour + suffix)
    },
    printDate (date: string): string {
      return moment(date).format('MMMM DD YYYY')
    }
  },
  computed: {
    isInsurance (): boolean {
      return this.$store.getters.insurance
    }
  }
})
</script>
