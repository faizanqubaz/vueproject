<template>
  <div class="max-w-screen-md mx-auto py-14 gap sm:gap-y-10">
    <div class="pl-4 pr-4 pt-0">
      <div class="w-2/5">
        <wz-progress width="2/8" />
      </div>
      <div class="pt-7">
        <h1 class="text-xl">
          Select the type of service
        </h1>
        <p class="pt-4 text-base lg:text-lg font-normal text-gray-700 antialiased">
          Explore and select the service you would like to receive
        </p>
      </div>
      <div class="grid grid-cols-2 gap-6 py-10 pr-4">
        <wz-service-card
          v-for="service in services"
          :key="service.id"
          :color="colors[service.id-1]"
          v-model="groupId"
          :itemKey="service.id"
        >
          <template>
            <h2>{{ service.name }}</h2>
          </template>
          <template #image>
          <img :src="service.image" :alt="`${service.name}`" class="lg:h-40 md:h-40 sm:h-20" />
          </template>
        </wz-service-card>
      </div>
      <div class="pt-0">
        <wz-button color="primary" block :disabled="!isValid" @click="proceed">
          <p class="text-white">Proceed</p>
        </wz-button>
      </div>
      <div class="pt-4 items-center">
        <wz-button type="button" block text  @click="$router.back()">
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
      groupId: 0,
      paths: [
        '/covid19-testing',
        '/at-home-care'
      ],
      colors: [
        'pink-50',
        'green-50'
      ],
      services: []
    }
  },
  beforeMount () {
    this.services = this.$store.getters.serviceList
    this.groupId = this.$store.getters.groupId
  },
  methods: {
    proceed () {
      if (this.groupId !== this.$store.getters.groupId) {
        this.$store.commit('setGroupId', this.groupId)
        this.$store.commit('clearService')
      }

      const url = this.paths[this.groupId - 1]
      if (this.isValid) {
        this.$router.push(url)
      }
    }
  },
  computed: {
    isValid (): boolean {
      return !!this.groupId
    }
  }
})
</script>
