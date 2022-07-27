<template>
  <div class="max-w-screen-md mx-auto py-10 gap sm:gap-y-10">
    <div class="pl-4 pr-4 pt-0">
      <div class="pt-7 x flex gap-x-4">
        <wz-checkbox
          label="Appointment Booked"
          v-model="checked"
          class="mb-2 rounded-full"
        />
      </div>
      <div class="pt-2">
        <h1 class="text-xl">Thank you!</h1>
      </div>
      <div class="pb-4">
        <p class="pt-3 font-normal text-gray-700 antialiased">
          We will call you to confirm your appointment. If you don't hear from us within 24 hours, please call us at 646-556-8500.
        </p>
        <p class="pt-3 font-normal text-gray-700 antialiased">Create an account for future reference.</p>
      </div>
      <div class="grid grid-cols-1 gap-3 pt-5 md:grid md:grid-cols-2 lg:grid lg:grid-cols-2">
        <wz-input
          icon="user"
          label="First Name"
          v-model="firstName"
          type="text"
          :error="false"
          errorMessage="" />
        <wz-input
          icon="user"
          label="Last Name"
          v-model="lastName"
          type="text"
          :error="false"
          errorMessage="" />
        <wz-input
          icon="email"
          label="Email"
          v-model="email"
          type="text"
          :error="false"
          errorMessage="" />
        <wz-input icon=""
          label="Password"
          v-model="password"
          type="password"
          :error="false"
          errorMessage=""
        />
      </div>
      <div class="pt-4">
        <wz-checkbox
          label="By creating account I accept Terms of Use"
          v-model="consent"
          class="mb-2 rounded-full"
        />
      </div>
      <div class="pt-4">
        <wz-button
          color="primary"
          block
          :disabled="!isValid"
          @click="createAccount"
        >
          <p class="text-white">Create Account</p>
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
          > Close
        </wz-button>
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
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      checked: true,
      valid: false,
      consent: false,
      snackbar: {
        open: false,
        message: ''
      }
    }
  },
  beforeMount () {
    this.firstName = this.$store.getters.firstName
    this.lastName = this.$store.getters.lastName
    this.email = this.$store.getters.email
    this.valid = !!this.firstName && !!this.lastName && !!this.email && !!this.password && !!this.consent
  },
  methods: {
    async createAccount () {
      this.$store.commit('setLoading', true)
      this.$store.commit('setFirstName', this.firstName)
      this.$store.commit('setLastName', this.lastName)
      this.$store.commit('setEmail', this.email)
      this.$store.commit('setPassword', this.password)
      const account = {
        visitId: this.$store.getters.visitId,
        firstName: this.firstName,
        lastName: this.lastName,
        dob: this.$store.getters.dob,
        email: this.email,
        password: this.password
      }
      try {
        const bookingApiClient = new BookingApiClient()
        await bookingApiClient.createAccount(account)
        this.$router.push('/login')
      } catch (error) {
        console.log('error', error.response)
        this.snackbar.message = error.response && error.response.data && error.response.data.error
          ? (error.response.data.message && error.response.data.message.length > 0 ? error.response.data.message[0] : error.response.data.error) : 'Sorry, something went wrong, please try again.'
        this.snackbar.open = true
      } finally {
        this.$store.commit('setLoading', false)
      }
    }
  },
  computed: {
    isValid (): boolean {
      return !!this.firstName && !!this.lastName && !!this.email && !!this.password && !!this.consent
    }
  }
})
</script>
