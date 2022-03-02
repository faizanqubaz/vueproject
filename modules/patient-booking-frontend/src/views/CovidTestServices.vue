<template>
  <div class="max-w-screen-md mx-auto py-14 gap sm:gap-y-10">
    <div class="pl-4 pr-4 pt-0">
      <div class="w-2/5">
        <wz-progress width="3/8" />
      </div>
      <div class="pt-7">
        <h1 class="text-xl">COVID-19 testing</h1>
        <p class="pt-3 text-base lg:text-lg font-normal text-gray-700 antialiased">
          Select a service for COVID-19 testing
        </p>
      </div>
      <div class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 py-8">
        <wz-checkbox-card
          :key="serviceType.id"
          v-for="serviceType in serviceTypes"
          v-model="$store.state.appointment.serviceId"
          :itemKey="serviceType.id"
        >
          <template #content>
            <div class="content-center py-5" align="center">
              <img
                :src="serviceType.image"
                :alt="`${serviceType.text}`"
                class=""
              />
              <h3 class="pt-4 font-normal">{{ serviceType.title }}</h3>
              <p class="antialiased font-normal text-gray-500 pt-1">
                {{ serviceType.text }}
              </p>
              <p class="font-normal text-primary pt-1">{{ serviceType.price }}</p>
            </div>
          </template>
        </wz-checkbox-card>
      </div>
      <div class="pt-0">
        <wz-button
          color="primary"
          block
          :disabled="!isValid"
          @click="nextPage"
        >
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
  data () {
    return {
      serviceTypes: [
        {
          id: 1,
          image: require('@/assets/rapid.png'),
          title: 'Rapid COVID-19 Test',
          text: 'Get result in 15-minutes',
          price: '$30.00'
        },
        {
          id: 2,
          image: require('@/assets/pcr.png'),
          title: 'PCR COVID-19 Test',
          text: 'Get result in 15-minutes',
          price: '$30.00'
        },
        {
          id: 3,
          image: require('@/assets/rapid-pcr.png'),
          title: 'Rapid + PCR COVID-19 Test',
          text: 'Get result in 15-minutes',
          price: '$30.00'
        }
      ]
    }
  },
  computed: {
    isValid () {
      return this.$store.state.appointment.serviceId
    }
  },
  methods: {
    nextPage () {
      if (this.isValid) {
        this.$router.push('/notes')
      }
    }
  }
})
</script>
