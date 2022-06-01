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
          :itemKey="symptom.name"
          align="center"
        >
          <template #icon>
            <wz-icon :name="symptom.icon" />
          </template>
          <template #content>
            <h3 class="font-normal">{{ symptom.name }}</h3>
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
import { get, find } from 'lodash'
export default Vue.extend({
  data () {
    return {
      notes: '',
      symptoms: [
        {
          id: 1,
          icon: 'flu',
          name: 'Flu and fever'
        },
        {
          id: 2,
          icon: 'MuscularIssue',
          name: 'Muscular and joint pain'
        },
        {
          id: 3,
          icon: 'Cough',
          name: 'Cough, cold, sinus'
        },
        {
          id: 4,
          icon: 'MinorInjury',
          name: 'Minor injury'
        },
        {
          id: 5,
          icon: 'HeadInjury',
          name: 'Head or ear issue'
        },
        {
          id: 6,
          icon: 'GenitalIssue',
          name: 'Genital or urinary issue'
        },
        {
          id: 7,
          icon: 'EyeIssue',
          name: 'Eye issue'
        },
        {
          id: 8,
          icon: 'StomachIssue',
          name: 'Stomach issue'
        },
        {
          id: 9,
          icon: 'StomachIssue',
          name: 'Skin condition'
        },
        {
          id: 10,
          icon: 'ExistingCondition',
          name: 'Existing condition'
        }
      ]
    }
  },
  beforeMount () {
    const service = get(find(this.$store.getters.serviceList, { id: this.$store.getters.groupId }), 'services')
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
      this.$store.commit('setService', aService)
    }

    this.notes = this.$store.getters.serviceNotes
  },
  methods: {
    proceed () {
      if (this.notes !== this.$store.getters.serviceNotes) {
        this.$store.commit('setServiceNotes', this.notes)
      }
      if (this.isValid) {
        this.$router.push('/notes')
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
