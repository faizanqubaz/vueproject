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
          v-for="serviceType in serviceTypes"
          :key="serviceType.id"
          v-model="serviceTypeId"
          :itemKey="serviceType.id"
        >
          <template #content>
            <div class="content-center py-5" align="center">
              <img
                :src="images[serviceType.id-1]"
                :alt="`${serviceType.name}`"
                class=""
              />
              <h3 class="pt-4 font-normal">{{ serviceType.name }}</h3>
              <p class="antialiased font-normal text-gray-500 pt-1">
                {{ serviceType.description }}
              </p>
            </div>
          </template>
        </wz-checkbox-card>
      </div>
      <div class="pt-0">
        <wz-button
          color="primary"
          block
          :disabled="!isValid"
          @click="proceed"
        >
          <p class="text-white">Proceed</p>
        </wz-button>
      </div>
      <div class="pt-4 pb-4 items-center">
        <wz-button type="button" block text @click="$router.back()">
          <p class="text-darkGray">← Go back</p>
        </wz-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { get, find } from 'lodash'
import { ServiceType } from '../api/BookingApiClient'
export default Vue.extend({
  data () {
    return {
      images: [
        require('@/assets/rapid.png'),
        require('@/assets/pcr.png'),
        require('@/assets/rapid-pcr.png')
      ],
      serviceTypes: [] as ServiceType[],
      serviceTypeId: 0
    }
  },
  beforeMount () {
    this.serviceTypes = get(find(this.$store.getters.serviceList, { id: this.$store.getters.serviceId }), 'services')
    this.serviceTypeId = this.$store.getters.serviceTypeId
  },
  methods: {
    proceed () {
      if (this.serviceTypeId !== this.$store.getters.serviceTypeId) {
        const serviceType = find(this.serviceTypes, { id: this.serviceTypeId })
        if (serviceType) {
          const type = {
            id: this.serviceTypeId,
            name: serviceType.name,
            description: serviceType.description,
            price: serviceType.price,
            image: this.images[this.serviceTypeId - 1],
            notes: ''
          }
          this.$store.commit('setServiceType', type)
        }
      }
      this.$router.push('/notes')
    }
  },
  computed: {
    isValid (): boolean {
      return !!this.serviceTypeId
    },
    isInsurance () {
      return this.$store.getters.insurance
    }
  }
})
</script>
