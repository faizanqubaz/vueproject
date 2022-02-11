<template>
  <div class="max-w-screen-md mx-auto py-16 gap sm:gap-y-10">
    <div class="pl-4 pr-4 pt-0">
      <div class="w-2/5">
        <wz-progress width="2/8" />
      </div>
      <div class="pt-3 sm:pb-10 pb-3">
        <p class="pt-4 float-left text-lg lg:text-3xl">
          Select the type of service
        </p>
        <p class="pt-5 float-left text-base lg:text-lg w-full font-normal text-gray-700 antialiased">
          Explore and select services you would like to recive
        </p>
      </div>
      <div class="grid grid-cols-2 gap-6 py-10 pr-4">
        <div :key="service.id" v-for="service in services">
        <wz-service-card
          @click="$router.push('/')"
          :color="service.color"
        >
        <template>
          <h2>{{ service.text }}</h2>
        </template>
        <template #image>
          <img :src="service.image" :alt="`${service.text}`" class="h-40" />
        </template>
        </wz-service-card>
        </div>
      </div>
      <div class="pt-0">
        <wz-button
          text
          block
          @click="$router.back()"
          >
          <div class="text-black text-gray-400"> ← Go back </div>
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
      services: [
        {
          id: 0,
          text: 'Covid-19 Testing',
          image: require('@/assets/covid-19-testing.png'),
          color: 'pink-50'
        },
        {
          id: 1,
          text: 'IV Drips',
          image: require('@/assets/iv-drips.png'),
          color: 'green-50'
        },
        {
          id: 2,
          text: 'STD Testing',
          image: require('@/assets/std-testing.png'),
          color: 'gray-50'
        },
        {
          id: 3,
          text: 'Urgent Care',
          image: require('@/assets/urgent-care.png'),
          color: 'yellow-50'
        }
      ]
    }
  }
})
</script>
