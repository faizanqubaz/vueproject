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
      <div id="map" hidden />
      <br />
      <div class="pt-0">
        <wz-select
          v-model="location.address"
          :items="searchResults"
          itemText="description"
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
            v-model="location.apartment"
            type="text"
            :error="false"
            errorMessage=""
          />
        </div>
        <div class="lg:flex gap-x-8 pt-6 md:flex">
          <div class="">
            <wz-checkbox
              label="I have health insurance"
              v-model="payment.insurance"
              class="mb-2"
            />
          </div>
          <div class="">
            <wz-checkbox
              label="I'll pay out of pocket"
              v-model="payment.card"
              class="mb-2"
            />
          </div>
        </div>
        <div class="pt-6">
          <wz-button color="primary"
            block
            :disabled="!isValid"
            @click="proceed"
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
<script lang="js">
import Vue from 'vue'
import BookingApiClient from '../api/BookingApiClient'
import { forEach } from 'lodash'
export default Vue.extend({
  data () {
    return {
      autocomplete: null,
      snackbar: {
        open: false,
        message: ''
      },
      location: {
        address: '',
        apartment: '',
        city: '',
        state: '',
        zipCode: '',
        longitude: '',
        latitude: '',
        cityId: 0,
        timeZone: ''
      },
      payment: {
        insurance: false,
        card: false
      },
      searchResults: [],
      addressRules: [(location) => !!location || 'Address is required'],
      fromBack: false
    }
  },
  metaInfo () {
    return {
      script: [
        {
          src: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDna1EPIoMPadg3lEqLIzfsam1o0kN3zvw&libraries=places',
          async: true,
          defer: true,
          callback: () => this.initMap()
        }
      ]
    }
  },
  beforeMount () {
    this.location.address = this.$store.getters.locationAddress
    this.fromBack = !!this.$store.getters.locationAddress
    this.location.apartment = this.$store.getters.locationApartment
    this.location.zipCode = this.$store.getters.locationZipCode
    this.payment = this.$store.getters.payment
  },
  methods: {
    initMap () {
      this.autocomplete = new window.google.maps.places.AutocompleteService({
        bounds: new window.google.maps.LatLngBounds(
          new window.google.maps.LatLng(37.09024, -95.712891)
        )
      })
    },
    displaySuggestions (predictions, status) {
      if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
        return (this.searchResults = [])
      }
      this.searchResults = predictions
    },
    async proceed () {
      try {
        if (this.location.zipCode === this.$store.getters.locationZipCode) {
          const location = { ...this.location, street: this.location.address.split(',')[0] }
          this.$store.commit('setLocation', location)
          this.$store.commit('setPayment', this.payment)
          if (this.isValid) {
            this.$router.push('/services')
          }
        } else {
          const bookingApiClient = new BookingApiClient()
          const response = await bookingApiClient.getService(this.location.zipCode)
          if (response.result.serviceGroups.length > 0) {
            this.$store.commit('setServiceList', response.result.serviceGroups)
            const location = {
              ...this.location,
              street: this.location.address.split(',')[0],
              cityId: response.result.id,
              timeZone: response.result.timeZone
            }
            this.$store.commit('setLocation', location)
            this.$store.commit('setPayment', this.payment)
            if (this.isValid) {
              this.$router.push('/services')
            }
          } else {
            this.snackbar.message = 'Sorry! We do not have services in your location at this moment'
            this.snackbar.open = true
            this.location = {
              address: '',
              apartment: '',
              city: '',
              state: '',
              zipCode: '',
              longitude: '',
              latitude: '',
              cityId: 0,
              timeZone: ''
            }
            this.payment.insurance = false
            this.payment.card = false
          }
        }
      } catch (error) {
        this.snackbar.message = 'Sorry, something went wrong. Please try again'
        this.snackbar.open = true
      }
    }
  },
  computed: {
    isValid () {
      return this.location.address && this.location.zipCode && (this.payment.insurance || this.payment.card)
    }
  },
  watch: {
    'payment.insurance' (newValue) {
      if (newValue) {
        this.payment.card = false
      }
    },
    'payment.card' (newValue) {
      if (newValue) {
        this.payment.insurance = false
      }
    },
    'location.address' (newValue) {
      if (this.fromBack) {
        this.fromBack = false
        return
      }

      if (newValue) {
        this.autocomplete.getPlacePredictions(
          { input: this.location.address, componentRestrictions: { country: 'us' } },
          this.displaySuggestions
        )
      }
      if ((typeof newValue) === 'object') {
        const request = {
          placeId: newValue.place_id,
          fields: ['address_components', 'formatted_address', 'geometry']
        }
        const service = new window.google.maps.places.PlacesService(document.getElementById('map'))
        service.getDetails(request, (place, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && place && place.geometry && place.geometry.location) {
            this.location.address = place.formatted_address === undefined ? '' : place.formatted_address
            if (this.location.address) {
              this.location.latitude = place.geometry.location.lat()
              this.location.longitude = place.geometry.location.lng()
            }
            forEach(place.address_components,
              /* eslint-disable camelcase */
              (component) => {
                if (component.types.includes('postal_code')) {
                  this.location.zipCode = component.long_name
                } else if (component.types.includes('neighborhood')) {
                  this.location.city = component.long_name
                } else if (component.types.includes('administrative_area_level_1')) {
                  this.location.state = component.long_name
                }
              }
            )
          }
        })
      }
    }
  }
})
</script>
