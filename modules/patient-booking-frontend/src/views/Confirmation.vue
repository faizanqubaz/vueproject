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
        <h1 class="text-xl">Thank You!</h1>
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
          v-model="$store.state.patient.firstname"
          type="text"
          :error="false"
          errorMessage="" />
        <wz-input
          icon="user"
          label="Last Name"
          v-model="$store.state.patient.lastname"
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
          v-model="check"
          class="mb-2 rounded-full"
        />
      </div>
      <div class="pt-4">
        <wz-button
          color="primary"
          :disabled="!valid"
          @click="valid ? submit() : ''"
          block
        >
          <div class="text-white">Create Account</div>
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
      check: false,
      valid: false
    }
  },
  computed: {
    isFilled () {
      return [
        this.$store.state.patient.firstname,
        this.$store.state.patient.lastname,
        this.$store.state.patient.email,
        this.$store.state.patient.password
      ].join()
    }
  },
  watch: {
    isFilled (e) {
      const fill = e.split(',')
      console.log(fill)
      for (let i = 0; i < fill.length; i++) {
        !fill[i] ? (this.valid = false) : (this.valid = true)
      }
    }
  }
})
</script>
