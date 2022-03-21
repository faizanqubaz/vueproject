<template>
  <div class="max-w-screen-md mx-auto py-14 gap sm:gap-y-10">
    <div class="pl-4 pr-4 pt-0">
      <div class="w-2/5">
        <wz-progress width="6/8" />
      </div>
      <div class="pt-7">
        <h1 class="text-xl">Who's being seen today</h1>
      </div>
      <div class="py-7 grid md:grid-cols-2 lg:grid-cols-2 sm:grid-cols-1 gap-x-5 gap-y-3">
        <wz-input
          icon="user"
          label="First Name"
          v-model="$store.state.patient.firstName"
          type="text"
          :error="false"
          errorMessage=""
        />
        <wz-input
          icon="user"
          label="Last Name"
          v-model="$store.state.patient.lastName"
          type="text"
          :error="false"
          errorMessage=""
        />
        <wz-input
          icon="phone"
          label="Phone Number"
          v-model="$store.state.patient.phoneNumber"
          type="tel"
          :error="false"
          errorMessage=""
        />
        <wz-select
          v-model="$store.state.patient.gender"
          :items="genders"
          icon="users"
          label="Gender"
          placeholder="Select"
          required
          :rules="genderRules"
        />
        <wz-input
          icon="calendar"
          label="Date of Birth"
          v-model="$store.state.patient.dob"
          type="date"
          :error="false"
          errorMessage=""
        />
        <wz-input
          icon="email"
          label="Email"
          v-model="$store.state.patient.email"
          type="email"
          :error="false"
          errorMessage=""
        />
      </div>
      <div class="pt-0">
        <wz-button
          block
          color="primary"
          :disabled="!isValid"
          @click="nextPage"
        >
          <p class="text-white">Proceed</p>
        </wz-button>
      </div>
      <div class="pt-5">
        <p class="text-gray-400 text-center text-sm">
          By continuing, you agree to receive text messages, such as appointment
          reminders to your phone number via SMS. Message and data rates may apply.
        </p>
      </div>
      <div class="pt-4 items-center">
        <wz-button type="button" block text @click="$router.back()">
          <div class="text-darkGray">← Go back</div>
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
      genderResults: [],
      genderRules: [(gender:boolean) => !!gender || 'Gender is required'],
      genders: ['Male', 'Female', 'Other'],
      valid: false
    }
  },
  methods: {
    gender () {
      this.genderResults = this.$store.state.patient.gender
    },
    nextPage () {
      if (this.isValid && this.$store.state.payment.insurance) {
        this.$router.push('/insurance')
      } else if (this.isValid) {
        this.$router.push('/review-appointment')
      }
    }
  },
  computed: {
    isValid () {
      return this.$store.state.patient.firstName &&
        this.$store.state.patient.lastName &&
        this.$store.state.patient.phoneNumber &&
        this.$store.state.patient.gender &&
        this.$store.state.patient.dob &&
        this.$store.state.patient.email
    }
  }
})
</script>
