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
          v-for="service in services"
          :key="service.id"
          v-model="serviceId"
          :itemKey="service.id"
        >
          <template #content>
            <div class="content-center py-5" align="center">
              <img
                :src="images[service.id-1]"
                :alt="`${service.name}`"
                class=""
              />
              <h3 class="pt-4 font-normal">{{ service.name }}</h3>
              <p class="antialiased font-normal text-gray-500 pt-1">
                {{ service.description }}
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
import { Service } from '../api/BookingApiClient'
export default Vue.extend({
  data () {
    return {
      images: [
        require('@/assets/rapid.png'),
        require('@/assets/pcr.png'),
        require('@/assets/rapid-pcr.png')
      ],
      services: [] as Service[],
      serviceId: 0
    }
  },
  beforeMount () {
    this.services = get(find(this.$store.getters.serviceList, { id: this.$store.getters.groupId }), 'services')
    this.serviceId = this.$store.getters.serviceId
  },
  methods: {
    proceed () {
      if (this.serviceId !== this.$store.getters.serviceId) {
        const service = find(this.services, { id: this.serviceId })
        if (service) {
          const aService = {
            id: this.serviceId,
            name: service.name,
            description: service.description,
            price: service.price,
            image: this.images[this.serviceId - 1],
            notes: ''
          }
          this.$store.commit('setService', aService)
        }
      }
      if (this.isValid) {
        this.$router.push('/notes')
      }
    }
  },
  computed: {
    isValid (): boolean {
      return !!this.serviceId
    },
    isInsurance () {
      return this.$store.getters.insurance
    }
  }
})
</script>
