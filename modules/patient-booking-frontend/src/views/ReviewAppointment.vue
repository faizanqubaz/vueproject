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
              <p>{{ $store.state.patient.firstName }}</p>
              <p>{{ $store.state.patient.lastName }}</p>
            </div>
            <hr class="w-80"/>
          </div>
          <div class="gap-y-7">
            <div>
              <label for="phonenumber" class="font-extralight text-sm">Phone</label>
            </div>
            <div>
              <p>{{ $store.state.patient.phoneNumber }}</p>
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
                {{ $store.state.patient.gender }}
              </p>
              <p>{{ new Date($store.state.patient.dob.split("-")).toLocaleDateString() }}</p>
            </div>
            <hr class="w-80"/>
          </div>
          <div class="gap-y-7">
            <div>
              <label for="address" class="font-extralight text-sm">Address</label>
            </div>
            <div>
              <p>{{ $store.state.location.address }}</p>
            </div>
            <hr class="w-80"/>
          </div>
          <div class="gap-y-7">
            <div>
              <label for="apartment" class="font-extralight text-sm">Apartment #</label>
            </div>
            <div class="grid grid-cols-2">
              <p>{{ $store.state.location.apartment }}</p>
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
                {{  new Date($store.state.appointment.date.split("-")).toDateString() }}
              </p>
              <p>{{ formatTimeSlot($store.state.appointment.startTime) }} - {{ formatTimeSlot($store.state.appointment.endTime) }}</p>
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
                <img :src="$store.state.service.image" class="mb-4 h-12" :alt="image" />
                <p class="text-fontPrimary mb-2">{{ $store.state.service.name }}</p>
                <p class="font-normal text-fontSecondary mb-2">{{$store.state.service.description }}</p>
                <p class="font-normal text-primary"> {{ $store.state.payment.outOfPocket ? '$ ' + $store.state.service.price : '' }}</p>
              </div>
            </div>
          </div>
          <div class="pt-5 flex justify-between">
            <p class="text-gray-500"> {{ $store.state.payment.outOfPocket ? 'Total:' : '' }} </p>
            <p class="font-normal text-primary"> {{ $store.state.payment.outOfPocket ? '$ ' + $store.state.service.price : '' }}</p>
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
      this.isLoading = true
      this.error = null
      const appointment = {
        patient: {
          firstName: this.$store.state.patient.firstName,
          middleName: '',
          lastName: this.$store.state.patient.lastName,
          dob: this.$store.state.patient.dob,
          gender: this.$store.state.patient.gender.toLowerCase(),
          phone: '+1' + this.$store.state.patient.phoneNumber,
          email: this.$store.state.patient.email,
          address: {
            street: this.$store.state.location.address,
            apartment: this.$store.state.location.apartment,
            city: this.$store.state.location.city,
            state: this.$store.state.location.state,
            zipCode: this.$store.state.location.zipCode,
            longitude: this.$store.state.location.longitude,
            latitude: this.$store.state.location.latitude,
            primary: true
          }
        },
        visit: {
          date: new Date(this.$store.state.appointment.date).toISOString(),
          startTime: this.$store.state.appointment.startTime,
          endTime: this.$store.state.appointment.endTime,
          serviceId: this.$store.state.service.id
        },
        note: this.$store.state.appointment.notes
      }

      try {
        const bookingApiClient = new BookingApiClient()
        const response = await bookingApiClient.createAppointment(appointment)
        this.$router.push('/confirmation')
      } catch (error) {
        this.isLoading = false
        this.error = 'Technical Issue. Please try again'
        return false
      }
    },
    // TODO: use MomentJS
    formatTimeSlot (time) {
      let hour = parseInt(time.slice(0, 2))
      const suffix = hour < 12 ? ' AM' : ' PM'
      hour = hour > 12 ? hour - 12 : hour
      return ((hour < 10 ? '0' : '') + hour + suffix)
    }
  }
})
</script>
