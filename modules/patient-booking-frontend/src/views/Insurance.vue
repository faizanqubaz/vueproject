<template>
  <div class="max-w-screen-md mx-auto py-14 gap sm:gap-y-10">
    <div class="pl-4 pr-4 pt-0">
      <div class="w-2/5">
        <wz-progress width="7/8" />
      </div>
      <div class="pt-7">
        <h1 class="text-xl">Scan insurance card</h1>
        <p class="pt-5 text-base lg:text-lg font-normal text-gray-700 antialiased">
          Please scan your insurance card or enter information manually
        </p>
      </div>
      <div class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 pt-8">
        <wz-upload v-model="insuranceFront">
          <h4>Add image</h4>
          <p class="font-normal text-gray-700 antialiased">Front of card</p>
        </wz-upload>
        <wz-upload v-model="insuranceBack">
          <h4>Add image</h4>
          <p class="font-normal text-gray-700 antialiased">Back of card</p>
        </wz-upload>
      </div>
      <div class="pt-8">
        <wz-button color="primary" block
        :disabled="!insuranceFront.file || !insuranceBack.file"
        @click="proceed">
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

interface InsuranceFile {
  file: File[];
  string: string;
}

export default Vue.extend({
  data () {
    return {
      insuranceFront: {} as InsuranceFile,
      insuranceBack: {} as InsuranceFile
    }
  },
  methods: {
    proceed () {
      const insurance = {
        front: this.insuranceFront.string,
        back: this.insuranceBack.string
      }
      this.$store.commit('setInsuranceInfo', insurance)
      this.$router.push('/review-appointment')
    }
  }
})
</script>
