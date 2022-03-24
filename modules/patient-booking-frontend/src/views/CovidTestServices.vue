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
          v-model="$store.state.service.id"
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
              <p class="font-normal text-primary pt-1">{{ $store.state.payment.outOfPocket ? '$ ' + service.price : '' }}</p>
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
export default Vue.extend({
  data () {
    return {
      images: [
        require('@/assets/rapid.png'),
        require('@/assets/pcr.png'),
        require('@/assets/rapid-pcr.png')
      ],
      services: get(find(this.$store.state.services, { id: 1 }), 'services')
    }
  },
  methods: {
    nextPage () {
      if (this.isValid) {
        const service = find(this.services, { id: this.$store.state.service.id })
        this.$store.state.service.name = service.name
        this.$store.state.service.description = service.description
        this.$store.state.service.price = service.price
        this.$store.state.service.image = require('@/assets/rapid.png')
        this.$router.push('/notes')
      }
    }
  },
  computed: {
    isValid () {
      return this.$store.state.service.id
    }
  }
})
</script>
