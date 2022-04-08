<template>
  <div class="max-w-screen-md mx-auto py-14 gap sm:gap-y-10">
    <div class="pl-4 pr-4 pt-0">
      <div class="w-2/5">
        <wz-progress width="6/8" />
      </div>
      <div class="pt-7">
        <h1 class="text-xl">Who's being seen today</h1>
      </div>
      <div class="">
        <wz-form
          ref="form"
          v-model="valid"
          class="py-7 grid md:grid-cols-2 lg:grid-cols-2 sm:grid-cols-1 gap-x-5 gap-y-3"
          autocomplete="on"
        >
        <wz-input
          icon="user"
          label="First Name"
          v-model="firstName"
          type="text"
          :error="false"
          required
          :rules="firstNameRules"
          errorMessage=""
        />
        <wz-input
          icon="user"
          label="Last Name"
          v-model="lastName"
          type="text"
          :error="false"
          required
          :rules="lastNameRules"
          errorMessage=""
        />
        <wz-input
          icon="phone"
          label="Phone Number"
          v-model="phoneNumber"
          type="tel"
          :rules="phoneRules"
          :error="false"
          errorMessage=""
        />
        <wz-select
          v-model="gender"
          :items="genders"
          icon="users"
          label="Gender"
          placeholder="Select"
          required
          :rules="genderRules"
        />

        <wz-date-picker
          v-model="dob"
          :inputForm="true"
          label="Date of Birth"
          placeholder="mm/dd/yyyy"
          required
        >
        </wz-date-picker>
        <!-- <wz-input
          icon="calendar"
          label="Date of Birth"
          v-model="dob"
          type="date"
          :error="false"
          required
          errorMessage=""
        /> -->
        <wz-input
          icon="email"
          label="Email"
          v-model="email"
          type="email"
          :error="false"
          :rules="emailRules"
          errorMessage=""
        />
        </wz-form>
      </div>
      <div class="pt-0">
        <wz-button
          block
          color="primary"
          :disabled="!valid"
          @click="proceed"
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
import phone from 'phone'
import email from 'email-validator'
export default Vue.extend({
  data () {
    return {
      genders: ['Male', 'Female', 'Other'],
      firstName: '',
      lastName: '',
      phoneNumber: '',
      gender: '',
      dob: null,
      email: '',
      firstNameRules: [(firstName: string) => !!firstName || 'First name is required'],
      lastNameRules: [(lastName: string) => !!lastName || 'Last name is required'],
      genderRules: [(gender:boolean) => !!gender || 'Gender is required'],
      valid: false,
      phoneRules: [
        (phoneNumber: string) => !!phoneNumber || 'Phone number is required',
        (phoneNumber: string) =>
          (phoneNumber && phone(phoneNumber, { country: 'USA' }).isValid) || 'Phone number is invalid'
      ],
      emailRules: [
        (emailAddress: string) => !!emailAddress || 'Email is required',
        (emailAddress: string) => (emailAddress && email.validate(emailAddress)) || 'Email address is invalid'
      ]
    }
  },
  beforeMount () {
    this.firstName = this.$store.getters.firstName
    this.lastName = this.$store.getters.lastName
    this.phoneNumber = this.$store.getters.phoneNumber
    this.gender = this.$store.getters.gender
    this.dob = this.$store.getters.dob
    this.email = this.$store.getters.email
    this.valid = !!this.firstName && !!this.lastName && !!this.phoneNumber && !!this.gender &&
      !!this.dob && !!this.email
  },
  methods: {
    proceed () {
      this.$store.commit('setFirstName', this.firstName)
      this.$store.commit('setLastName', this.lastName)
      this.$store.commit('setPhoneNumber', this.phoneNumber)
      this.$store.commit('setGender', this.gender)
      this.$store.commit('setDob', this.dob)
      this.$store.commit('setEmail', this.email)

      if (this.$store.getters.insurance && this.valid) {
        this.$router.push('/insurance')
      } else if (this.valid) {
        this.$router.push('/review-appointment')
      }
    }
  }
})
</script>
