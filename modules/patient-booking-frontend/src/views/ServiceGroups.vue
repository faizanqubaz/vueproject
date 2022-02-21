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
          Explore and select services you would like to recive
        </p>
      </div>
      <div class="grid grid-cols-2 gap-6 pt-10 pr-4">
        <wz-service-card
          :key="service.id"
          v-for="service in services"
          @click="$router.push(service.path)"
          :color="service.color"
        >
        <template>
          <h2>{{ service.text }}</h2>
        </template>
        <template #image>
          <img :src="service.image" :alt="`${service.text}`" class="lg:h-40 md:h-40 sm:h-20" />
        </template>
        </wz-service-card>
      </div>
      <div class="pt-6 items-center">
       <wz-button type="button" block text  @click="$router.back()">
         <div class="text-darkGray">← Go back</div>
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
          path: '/covidtesting',
          text: 'Covid-19 Testing',
          image: require('@/assets/covid-19-testing.png'),
          color: 'pink-50'
        },
        {
          id: 1,
          path: '/ivdrips',
          text: 'IV Drips',
          image: require('@/assets/iv-drips.png'),
          color: 'green-50'
        },
        {
          id: 2,
          text: 'STD Testing',
          path: '',
          image: require('@/assets/std-testing.png'),
          color: 'gray-50'
        },
        {
          id: 3,
          path: '/athomecare',
          text: 'Urgent Care',
          image: require('@/assets/urgent-care.png'),
          color: 'yellow-50'
        }
      ]
    }
  }
})
</script>
