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
            :disabled="!isInputValid"
            @click="nextPage"
            >
            <p class="text-white">Proceed</p>
          </wz-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="js">
// lang is js to disable some type errors with google autocomplete service
import Vue from 'vue'
export default Vue.extend({
  data () {
    return {
      addressRules: [(location) => !!location || 'Address is required'],
      autocomplete: null,
      searchResults: []
    }
  },
  metaInfo () {
    return {
      script: [
        {
          src: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDna1EPIoMPadg3lEqLIzfsam1o0kN3zvw&libraries=places',
          async: true,
          defer: true,
          callback: () => this.MapsInit()
        }
      ]
    }
  },
  methods: {
    MapsInit () {
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
    nextPage () {
      if (this.isInputValid) {
        this.$router.push('/servicetypes')
      }
    }
  },
  computed: {
    isInputValid: function () {
      return this.$store.state.location.address && (this.$store.state.payment.insurance || this.$store.state.payment.outOfPocket)
    }
  },
  watch: {
    '$store.state.payment.insurance' (newValue) {
      if (newValue) {
        this.$store.state.payment.outOfPocket = false
      }
    },
    '$store.state.payment.outOfPocket' (newValue) {
      if (newValue) {
        this.$store.state.payment.insurance = false
      }
    },
    '$store.state.location.address' (newValue) {
      if (newValue) {
        this.autocomplete.getPlacePredictions(
          {
            input: this.$store.state.location.address,
            componentRestrictions: { country: 'us' }
          },
          this.displaySuggestions
        )
      }
    }
  }
})
</script>
