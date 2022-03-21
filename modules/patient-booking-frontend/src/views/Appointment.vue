<template>
  <div class="max-w-screen-md mx-auto py-14 gap sm:gap-y-10">
    <div class="pl-4 pr-4 pt-0">
      <div class="w-2/5">
        <wz-progress width="1/8" />
      </div>
      <div class="pt-7">
        <h1 class="text-xl">
          Care, wherever you are
        </h1>
        <p class="pt-5 text-base lg:text-lg font-normal text-gray-700 antialiased">
          We bring the urgent care directly to you. It’s as easy as using Amazon
        </p>
      </div>
      <br />
      <div class="pt-0">
        <wz-select
          v-model="$store.state.location.address"
          ref="input"
          icon="map-pin"
          label="Your Address"
          :filter="false"
          class="my-2"
          required
          :dropdown="false"
          :rules="addressRules"
        />
        <div class="pt-4">
          <wz-input
            icon="home"
            label="Apartment #"
            v-model="$store.state.location.apartment"
            type="text"
            :error="false"
            errorMessage=""
          />
        </div>
        <div class="lg:flex gap-x-8 pt-6 md:flex">
          <div class="">
            <wz-checkbox
              label="I have health insurance"
              v-model="$store.state.payment.insurance"
              class="mb-2"
            />
          </div>
          <div class="">
            <wz-checkbox
              label="Uninsured or will pay out of pocket"
              v-model="$store.state.payment.outOfPocket"
              class="mb-2"
            />
          </div>
        </div>
        <div class="pt-6">
          <wz-button color="primary"
            block
            :disabled="!isValid"
            @click="isServiceAvailable"
            >
            <p class="text-white">Proceed</p>
          </wz-button>
        </div>
      </div>
    </div>
   <wz-snackbars v-model="snackbar.open" color="fontPrimary" :timeout="6000">
        <template>
          <div class="w-80 pl-4 text-white">{{ snackbar.message }}</div>
        </template>
        <template #action>
          <wz-button
            text
            @click="snackbar.open= false"
            color="red"
            class="text-red mr-4"
            >Close</wz-button>
        </template>
    </wz-snackbars>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import BookingApiClient from '../api/BookingApiClient'
import { Loader } from '@googlemaps/js-api-loader'
import { forEach } from 'lodash'
const loader = new Loader({
  apiKey: 'AIzaSyDna1EPIoMPadg3lEqLIzfsam1o0kN3zvw',
  version: 'weekly',
  libraries: ['places'],
  region: 'us'
})
export default Vue.extend({
  data () {
    return {
      addressRules: [(location:boolean) => !!location || 'Address is required'],
      autocomplete: null,
      valid: false,
      errorNotification: false,
      snackbar: {
        open: false,
        message: ''
      }
    }
  },
  async mounted (): Promise<void> {
    loader
      .load()
      .then((google) => {
        const autocomplete = new google.maps.places.Autocomplete(
          this.$el.querySelector('input') as HTMLInputElement,
          {
            types: ['geocode'],
            componentRestrictions: { country: 'us' },
            strictBounds: true,
            fields: ['address_components', 'formatted_address', 'geometry']
          }
        )
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace()
          this.$store.state.location.address =
            place.formatted_address === undefined
              ? ''
              : place.formatted_address
          if (this.$store.state.location.address) {
            this.$store.state.location.latitude = place.geometry.location.lat()
            this.$store.state.location.longitude = place.geometry.location.lng()
          }
          forEach(
            place.address_components,
            /* eslint-disable camelcase */
            (component: { types: string[]; long_name: string }) => {
              if (component.types.includes('postal_code')) {
                this.$store.state.location.zipCode = component.long_name
              } else if (component.types.includes('neighborhood')) {
                this.$store.state.location.city = component.long_name
              } else if (component.types.includes('administrative_area_level_1')) {
                this.$store.state.location.state = component.long_name
              }
            }
          )
        })
      })
      .catch((e) => {
        console.log(e)
      })
  },
  methods: {
    async isServiceAvailable () {
      this.isLoading = true
      this.error = null
      try {
        const bookingApiClient = new BookingApiClient()
        const response = await bookingApiClient.getService(this.$store.state.location.zipCode)
        if (response.result.length > 0) {
          this.$store.state.services = response.result
          this.$router.push('/services')
        } else {
          this.snackbar.message = 'Sorry! We do not have services in your location at this moment'
          this.snackbar.open = true
          this.$store.state.location.address = ''
          this.$store.state.location.zipCode = ''
          this.$store.state.payment.insurance = false
          this.$store.state.payment.outOfPocket = false
        }
      } catch (error) {
        this.isLoading = false
        this.error = 'Technical Issue. Please try again'
        return false
      }
    }
  },
  computed: {
    isValid () {
      return this.$store.state.location.address &&
      this.$store.state.location.zipCode &&
      (this.$store.state.payment.insurance || this.$store.state.payment.outOfPocket)
    }
  },
  watch: {
    // TODO: we need to develop a radio buton and remove this code
    '$store.state.payment.insurance' (newValue) {
      if (newValue) {
        this.$store.state.payment.outOfPocket = false
      }
    },
    '$store.state.payment.outOfPocket' (newValue) {
      if (newValue) {
        this.$store.state.payment.insurance = false
      }
    }
  }
})
</script>
