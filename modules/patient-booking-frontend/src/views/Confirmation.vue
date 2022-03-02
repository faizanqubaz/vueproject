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
          v-model="$store.state.patient.firstName"
          type="text"
          :error="false"
          errorMessage="" />
        <wz-input
          icon="user"
          label="Last Name"
          v-model="$store.state.patient.lastName"
          type="text"
          :error="false"
          errorMessage="" />
        <wz-input
          icon="email"
          label="Email"
          v-model="$store.state.patient.email"
          type="text"
          :error="false"
          errorMessage="" />
        <wz-input icon=""
          label="Password"
          v-model="$store.state.patient.password"
          type="password"
          :error="false"
          errorMessage=""
        />
      </div>
      <div class="pt-4">
        <wz-checkbox
          label="By creating account I accept Terms of Use"
          v-model="$store.state.patient.consent"
          class="mb-2 rounded-full"
        />
      </div>
      <div class="pt-4">
        <wz-button
          color="primary"
          block
          :disabled="!isValid"
          @click="isValid ? submit() : ''"
        >
          <p class="text-white">Create Account</p>
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
      checked: true,
      valid: false
    }
  },
  computed: {
    isValid () {
      return this.$store.state.patient.firstName &&
        this.$store.state.patient.lastName &&
        this.$store.state.patient.email &&
        this.$store.state.patient.password &&
        this.$store.state.patient.consent
    }
  },
  methods: {
    submit () {
      console.log('Need to be implemented')
    }
  }
})
</script>
