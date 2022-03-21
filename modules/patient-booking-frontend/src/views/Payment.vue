<template>
  <div class="max-w-screen-md mx-auto py-14 gap sm:gap-y-10">
    <div class="pl-4 pr-4 pt-0">
      <div class="w-2/5">
        <wz-progress width="6/8" />
      </div>
      <div class="pt-7">
        <h1 class="text-xl">Payment</h1>
        <p class="pt-3 text-base lg:text-lg font-normal text-gray-700 antialiased">
          Please provide the credit card information to pay for the chosen service
        </p>
      </div>
      <div class="pt-8 grid md:grid-cols-1 lg:grid-cols-1 sm:grid-cols-1 gap-x-5 gap-y-3">
        <wz-input
          icon="cardFront"
          label="Card Number"
          v-model="$store.state.outOfPocketInfo.cardNumber"
          type="number"
          :error="false"
          errorMessage=""
        />
      </div>
      <div class="pt-5 grid md:grid-cols-2 lg:grid-cols-2 sm:grid-cols-1 gap-x-5 gap-y-3">
        <wz-input
          icon="calendar"
          label="Expiration Date"
          v-model="$store.state.outOfPocketInfo.expirationDate"
          type="text"
          :error="false"
          errorMessage=""
        />
        <wz-input
          icon="cardBack"
          label="CVC"
          v-model="$store.state.outOfPocketInfo.cvc"
          type="number"
          :error="false"
          errorMessage=""
        />
      </div>
      <div class="pt-5 grid md:grid-cols-1 lg:grid-cols-1 sm:grid-cols-1 gap-x-5 gap-y-3">
        <wz-input
          icon="email"
          label="Email"
          v-model="$store.state.outOfPocketInfo.email"
          type="text"
          :error="false"
          errorMessage=""
        />
      </div>
      <div class="pt-8">
        <wz-button color="primary" block :disabled="!isValid" @click="nextPage">
          <p class="text-white">Proceed</p>
        </wz-button>
      </div>
      <div class="pt-4 items-center">
        <wz-button type="button" block text @click="$router.back()">
          <p class="text-darkGray">← Go back</p>
        </wz-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  computed: {
    isValid: function () {
      return this.$store.state.outOfPocketInfo.cardNumber &&
      this.$store.state.outOfPocketInfo.expirationDate &&
      this.$store.state.outOfPocketInfo.cvc &&
      this.$store.state.outOfPocketInfo.email
    }
  },
  methods: {
    nextPage () {
      if (this.isValid) {
        this.$router.push('/review-appointment')
      }
    }
  }
})
</script>
