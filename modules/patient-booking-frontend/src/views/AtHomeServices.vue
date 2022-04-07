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
    const serviceType = get(find(this.$store.getters.serviceList, { id: this.$store.getters.serviceId }), 'services')
    // there is only one service under this group. That's why passing the index
    const serviceTypeIndex = 0
    if (serviceType[serviceTypeIndex].id !== this.$store.getters.serviceTypeId) {
      const type = {
        id: serviceType[serviceTypeIndex].id,
        name: serviceType[serviceTypeIndex].name,
        description: serviceType[serviceTypeIndex].description,
        price: serviceType[serviceTypeIndex].price,
        image: require('@/assets/at-home-care.png'),
        notes: ''
      }
      this.$store.commit('setServiceType', type)
    }

    this.notes = this.$store.getters.serviceTypeNotes
  },
  methods: {
    proceed () {
      if (this.notes !== this.$store.getters.serviceTypeNotes) {
        this.$store.commit('setServiceTypeNotes', this.notes)
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
