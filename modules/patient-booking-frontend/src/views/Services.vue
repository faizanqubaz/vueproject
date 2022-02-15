<template>
<div class="max-w-screen-md mx-auto py-14 gap sm:gap-y-10">
  <div class="pl-4 pr-4 pt-0">
      <div class="w-2/5">
        <wz-progress width="3/8" />
      </div>
      <div class="pt-7">
          <h1 class="text-xl">COVID-19 Testing</h1>
          <p class="pt-3 text-base lg:text-lg font-normal text-gray-700 antialiased">
          Select services for COVID-19 testing
        </p>
      </div>
      <div class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 pt-8">
        <wz-checkbox-card
          :key="serviceType.id"
          v-for="serviceType in serviceTypes"
          v-model="$store.state.appointment.serviceTypeId"
          :label="serviceType.id"
        >
        <template #content>
          <div class="content-center py-5" align="center">
            <img :src="serviceType.image" :alt="`${serviceType.text}`" class="" />
            <h3 class="pt-4 font-normal">{{ serviceType.title }}</h3>
            <p class="antialiased font-normal text-gray-500 pt-1">{{ serviceType.text }}</p>
            <p class="text-blue-500 pt-1">{{ serviceType.price }}</p>
          </div>
        </template>
        </wz-checkbox-card>
      </div>
      <div class="pt-5">
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
  data () {
    return {
      serviceTypes: [
        {
          id: '0',
          image: require('@/assets/rapid.png'),
          title: 'Rapid COVID-19 Test',
          text: 'Get result in 15-minutes',
          price: '$30.00'
        },
        {
          id: '1',
          image: require('@/assets/pcr.png'),
          title: 'PCR COVID-19 Test',
          text: 'Get result in 15-minutes',
          price: '$30.00'
        },
        {
          id: '2',
          image: require('@/assets/rapid-pcr.png'),
          title: 'Rapid + PCR COVID-19 Test',
          text: 'Get result in 15-minutes',
          price: '$30.00'
        }
      ]
    }
  },
  computed: {
    isClickValid: function () {
      console.log(!isEmpty(this.$store.state.appointment.serviceTypeId))
      return !isEmpty(this.$store.state.appointment.serviceTypeId)
    }
  },
  methods: {
    nextPage () {
      if (this.isClickValid) {
        this.$router.push('/timeslots')
      }
    }
  }
})
</script>
