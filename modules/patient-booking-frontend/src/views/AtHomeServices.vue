<template>
  <div class="max-w-screen-md mx-auto py-14 gap sm:gap-y-10">
    <div class="pl-4 pr-4 pt-0">
        <div class="w-2/5">
        <wz-progress width="3/8" />
      </div>
      <div class="pt-7">
          <h1 class="text-xl">Urgent Care</h1>
          <p class="pt-3 text-base lg:text-lg font-normal text-gray-700 antialiased">
          Select services for Urgent care
        </p>
      </div>
      <div class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 py-10">
        <wz-checkbox-card
          v-for="serviceType in serviceTypes"
          :key="serviceType"
          v-model="$store.state.appointment.serviceTypeId"
          :itemKey="serviceType.id"
          align="center"
          >
          <template #icon>
            <wz-icon :name="serviceType.icon" />
          </template>
          <template #content>
            <h3 class="font-normal">{{ serviceType.title }}</h3>
          </template>
        </wz-checkbox-card>
      </div>
      <div class="pt-0">
        <wz-button
          color="primary"
          block
          :disabled="!isClickValid"
          @click="nextPage"
        >
          <div class="text-white">Proceed</div>
        </wz-button>
      </div>
      <div class="pt-4 items-center">
        <wz-button type="button" block text @click="$router.back()">
          <div class="text-darkGray">← Go back</div>
        </wz-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { isEmpty } from 'lodash'
export default Vue.extend({
  data () {
    return {
      serviceTypes: [
        {
          id: '0',
          icon: 'flu',
          title: 'Flu and fever'
        },
        {
          id: '1',
          icon: 'MuscularIssue',
          title: 'Muscular and joint pain'
        },
        {
          id: '2',
          icon: 'Cough',
          title: 'Cough, cold, sinus'
        },
        {
          id: '3',
          icon: 'MinorInjury',
          title: 'Minor injury'
        },
        {
          id: '4',
          icon: 'HeadInjury',
          title: 'Head or ear issue'
        },
        {
          id: '5',
          icon: 'GenitalIssue',
          title: 'Genital or urinary issue'
        },
        {
          id: '6',
          icon: 'EyeIssue',
          title: 'Eye issue'
        },
        {
          id: '7',
          icon: 'StomachIssue',
          title: 'Stomach issue'
        },
        {
          id: '8',
          icon: 'StomachIssue',
          title: 'Skin condition'
        },
        {
          id: '9',
          icon: 'ExistingCondition',
          title: 'Existing condition'
        }
      ]
    }
  },
  computed: {
    isClickValid: function () {
      return !isEmpty(this.$store.state.appointment.serviceTypeId)
    }
  },
  methods: {
    nextPage () {
      if (this.isClickValid) {
        this.$router.push('/timeslots')
      }
    }
  }
})
</script>
