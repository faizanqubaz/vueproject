<template>
  <div class="max-w-screen-md mx-auto py-14 gap sm:gap-y-10">
    <div class="pl-4 pr-4 pt-0">
      <div class="w-2/5">
        <wz-progress width="3/8" />
      </div>
      <div class="pt-7">
        <h1 class="text-xl">At home care</h1>
        <p class="pt-3 text-base lg:text-lg font-normal text-gray-700 antialiased">
          Please select a symptom for at home care
        </p>
      </div>
      <div class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 py-10">
        <wz-checkbox-card
          v-for="symptom in symptoms"
          :key="symptom.id"
          v-model="notes"
          :itemKey="symptom.description"
          align="center"
        >
          <template #icon>
            <img :src="symptom.icon" alt="">
          </template>
          <template #content>
            <h3 class="font-normal">{{ symptom.description }}</h3>
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
import BookingApiClient, { Symptom } from '../api/BookingApiClient'
import { get, find } from 'lodash'
export default Vue.extend({
  data () {
    return {
      notes: '',
      serviceId: 0,
      symptoms: [] as Symptom[]
    }
  },
  beforeMount () {
    const service = get(find(this.$store.getters.serviceList, { id: this.$store.getters.groupId }), 'services')
    this.serviceId = this.$store.getters.serviceId
    const serviceIndex = 0
    if (service[serviceIndex].id !== this.$store.getters.serviceId) {
      const aService = {
        id: service[serviceIndex].id,
        name: service[serviceIndex].name,
        description: service[serviceIndex].description,
        price: service[serviceIndex].price,
        image: require('@/assets/at-home-care.png'),
        notes: ''
      }
      this.serviceId = service[serviceIndex].id
      this.$store.commit('setService', aService)
    }

    this.notes = this.$store.getters.serviceNotes
    this.getSymptoms()
  },
  methods: {
    proceed () {
      if (this.notes !== this.$store.getters.serviceNotes) {
        this.$store.commit('setServiceNotes', this.notes)
      }
      if (this.isValid) {
        this.$router.push('/notes')
      }
    },
    async getSymptoms () {
      try {
        this.$store.commit('setLoading', true)
        const bookingApiClient = new BookingApiClient()
        const response = await bookingApiClient.getSymptoms(this.serviceId)
        if (response.result) {
          this.symptoms = response.result
        }
      } catch (error) {
        console.info(error)
      } finally {
        this.$store.commit('setLoading', false)
      }
    }
  },
  computed: {
    isValid (): boolean {
      return !!this.notes
    }
  }
})
</script>
