<template>
  <div class="max-w-screen-md mx-auto py-14 gap sm:gap-y-10">
    <div class="pl-4 pr-4 pt-0">
      <div class="w-2/5">
        <wz-progress width="8/8" />
      </div>
      <div class="pt-7">
        <h1 class="text-xl">Review Order</h1>
        <p class="pt-3 text-base lg:text-lg font-normal text-gray-700 antialiased">
          Please review your order
        </p>
      </div>
      <div class="pt-10 pb-7 grid md:grid md:grid-cols-2 grid-cols-1 gap-y-7 gap-x-10 md:gap-x-10">
        <div class="grid grid-cols-1 gap-y-7">
          <div class="gap-y-7">
            <div class="grid grid-cols-2">
              <label for="firstname" class="font-extralight text-sm">First Name</label>
              <label for="lastname" class="font-extralight text-sm">Last Name</label>
            </div>
            <div class="grid grid-cols-2">
              <p>{{ $store.state.patient.firstName }}</p>
              <p>{{ $store.state.patient.lastName }}</p>
            </div>
            <hr class="w-80"/>
          </div>
          <div class="gap-y-7">
            <div>
              <label for="phonenumber" class="font-extralight text-sm">Phone</label>
            </div>
            <div>
              <p>{{ $store.state.patient.phoneNumber }}</p>
            </div>
           <hr class="w-80"/>
          </div>
          <div class="gap-y-7">
            <div class="grid grid-cols-2">
              <label for="gender" class="font-extralight text-sm">Gender</label>
              <label for="dob" class="font-extralight text-sm">Date of Birth</label>
            </div>
            <div class="grid grid-cols-2">
              <p v-if="!$store.state.patient.gender">
                {{ $store.state.patient.gender }}
              </p>
              <p>{{ $store.state.patient.dateofbirth }}</p>
            </div>
            <hr class="w-80"/>
          </div>
          <div class="gap-y-7">
            <div>
              <label for="address" class="font-extralight text-sm">Address</label>
            </div>
            <div>
              <p>{{ $store.state.location.address }}</p>
            </div>
          <hr class="w-80"/>
          </div>
          <div class="gap-y-7">
            <div>
              <label for="apartment" class="font-extralight text-sm">Apartment/Floor</label>
            </div>
            <div class="grid grid-cols-2">
              <p>{{ $store.state.location.apartment }}</p>
            </div>
            <hr class="w-80"/>
          </div>
        </div>
        <div>
          <div class=" rounded p-4 cursor-pointer border flex justify-center">
            <div class="h-8 w-8 rounded-full flex items-center justify-center border flex-none border-darkGray border-stroke">
              <wz-icon name="info" color="darkGray" />
            </div>
            <div class="py-5 flex-1 mx-4">
              <div class="mx-4 flex flex-col items-center justify-center">
                <img src="@/assets/pcr.png" class="mb-4 h-12" alt="image" />
                <div class="text-fontPrimary mb-2">COVID-19 Test</div>
                <p class="font-normal text-fontSecondary mb-2">Get result in 15 minutes</p>
                <p class="font-normal text-primary">$30.00</p>
              </div>
            </div>
          </div>
          <div class="pt-5 flex justify-between">
            <p class="text-gray-500">Total:</p>
            <p class="font-normal text-primary">$30.00</p>
          </div>
        </div>
      </div>
      <div class="pt-5">
        <wz-button color="primary" @click="nextPage" block>
          <div class="text-white">Place Order</div>
        </wz-button>
      </div>
      <div class="pt-4 items-center">
        <wz-button type="button" block text @click="$router.back()">
          <div class="text-darkGray">← Go Back</div>
        </wz-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  methods: {
    nextPage () {
      this.$router.push('/confirmation')
    }
  }
})
</script>
