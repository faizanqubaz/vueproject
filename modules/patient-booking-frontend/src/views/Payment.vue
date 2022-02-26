<template>
  <div class="max-w-screen-md mx-auto py-14 gap sm:gap-y-10">
    <div class="pl-4 pr-4 pt-0">
      <div class="w-2/5">
        <wz-progress width="6/8" />
      </div>
      <div class="pt-7">
          <h1 class="text-xl">Payment</h1>
          <p class="pt-3 text-base lg:text-lg font-normal text-gray-700 antialiased">
          Please provide credit card info to pay for choosen services
        </p>
      </div>
      <div class="pt-8 grid md:grid-cols-1 lg:grid-cols-1 sm:grid-cols-1 gap-x-5 gap-y-3">
          <wz-input
            icon="cardFront"
            label="Card number"
            v-model="$store.state.paymentInfo.cardNumber"
            type="number"
            :error="false"
            errorMessage=""
          />
      </div>
      <div class="pt-5 grid md:grid-cols-2 lg:grid-cols-2 sm:grid-cols-1 gap-x-5 gap-y-3">
        <wz-input
            icon="calendar"
            label="Expiration date"
            v-model="$store.state.paymentInfo.expirationDate"
            type="date"
            :error="false"
            errorMessage=""
          />
          <wz-input
            icon="cardBack"
            label="CVC"
            v-model="$store.state.paymentInfo.cvc"
            type="number"
            :error="false"
            errorMessage=""
          />
      </div>
      <div class="pt-5 grid md:grid-cols-1 lg:grid-cols-1 sm:grid-cols-1 gap-x-5 gap-y-3">
        <wz-input
            icon="email"
            label="Email"
            v-model="$store.state.paymentInfo.email"
            type="text"
            :error="false"
            errorMessage=""
          />
      </div>
      <div class="pt-8">
        <wz-button color="primary" block :disabled="!isClickValid" @click="nextPage">
        <div class="text-white">Proceed</div>
      </wz-button>
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
import { isEmpty } from 'lodash'
export default Vue.extend({
  computed: {
    isClickValid: function () {
      return !isEmpty(this.$store.state.paymentInfo.cardNumber && this.$store.state.paymentInfo.expirationDate && this.$store.state.paymentInfo.cvc && this.$store.state.paymentInfo.email)
    }
  },
  methods: {
    nextPage () {
      if (this.isClickValid) {
        this.$router.push('/review-order')
      }
    }
  }
})
</script>
