<template>
  <wz-page
    top-title="Book your appoinment"
    title="Appoinment Location"
    desc="Enter the address where you want to be seen"
    :next="true"
    @to-next="nextPage"
    :nextValid="isValid"
  >
    <div class="mt-16 mb-32 md:w-3/5 mx-auto">
      <div id="map" hidden />
      <wz-select
        v-model="location.address"
        :items="searchResults"
        itemText="description"
        icon="map-arrow"
        label="Location"
        :filter="false"
        class="my-2"
        required
        :dropdown="false"
        :rules="addressRules"
        placeholder="Where to?"
      />
      <wz-input
        icon="building"
        v-model="location.apartment"
        type="text"
        :error="false"
        errorMessage=""
        placeholder="Apt #"
      />
      <div class="text-center">
        <p class="text-danger text-sm">{{ errorMsg }}</p>
      </div>
    </div>
  </wz-page>
</template>

<script>
import Vue from "vue";
import { forEach } from "lodash";
import BookingApiClient from "@/api/BookingApiClient";

export default Vue.extend({
  data() {
    return {
      location: {
        address: "",
        apartment: "",
        city: "",
        state: "",
        zipCode: "",
        longitude: "",
        latitude: "",
        cityId: 0,
        timeZone: "",
      },
      searchResults: [],
      addressRules: [(location) => !!location || "Address is required"],
      fromBack: false,
      errorMsg: "",
    };
  },
  metaInfo() {
    return {
      script: [
        {
          src: `https://maps.googleapis.com/maps/api/js?key=${process.env.VUE_APP_WELZ_BOOKING_GOOGLE_AUTH_KEY}&libraries=places`,
          async: true,
          defer: true,
          callback: () => this.initMap(),
        },
      ],
    };
  },
  computed: {
    isValid() {
      return this.location.address && this.location.zipCode ? true : false;
    },
  },
  methods: {
    initMap() {
      this.autocomplete = new window.google.maps.places.AutocompleteService({
        bounds: new window.google.maps.LatLngBounds(
          new window.google.maps.LatLng(37.09024, -95.712891)
        ),
      });
    },
    displaySuggestions(predictions, status) {
      if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
        return (this.searchResults = []);
      }
      this.searchResults = predictions;
    },
    async nextPage() {
      try {
        this.errorMsg = "";
        this.$store.commit("SET_IS_LOADING", true);
        const bookingApiClient = new BookingApiClient();
        const response = await bookingApiClient.getService(
          this.location.zipCode
        );
        if (response.result.serviceGroups.length > 0) {
          this.$store.commit("SET_SERVICE_LIST", response.result.serviceGroups);
          const location = {
            ...this.location,
            street: this.location.address.split(",")[0],
            cityId: response.result.id,
            timeZone: response.result.timeZone,
          };
          this.$store.commit("SET_LOCATION", location);
          this.$router.push("/booking/services");
        } else {
          this.errorMsg =
            "Sorry! We do not have services in your location at this moment";
          this.location = {
            address: "",
            apartment: "",
            city: "",
            state: "",
            zipCode: "",
            longitude: "",
            latitude: "",
            cityId: 0,
            timeZone: "",
          };
        }
      } catch (error) {
        this.errorMsg = "Sorry, something went wrong. Please try again";
      } finally {
        this.$store.commit("SET_IS_LOADING", false);
      }
    },
  },
  watch: {
    "location.address"(newValue) {
      if (this.fromBack) {
        this.fromBack = false;
        return;
      }
      if (newValue) {
        if (!this.autocomplete) {
          this.initMap();
          return;
        }
        this.autocomplete.getPlacePredictions(
          {
            input: this.location.address,
            componentRestrictions: { country: "us" },
          },
          this.displaySuggestions
        );
      }
      if (typeof newValue === "object") {
        const request = {
          placeId: newValue.place_id,
          fields: ["address_components", "formatted_address", "geometry"],
        };
        const service = new window.google.maps.places.PlacesService(
          document.getElementById("map")
        );
        service.getDetails(request, (place, status) => {
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            place &&
            place.geometry &&
            place.geometry.location
          ) {
            this.location.address =
              place.formatted_address === undefined
                ? ""
                : place.formatted_address;
            if (this.location.address) {
              this.location.latitude = place.geometry.location.lat();
              this.location.longitude = place.geometry.location.lng();
            }
            forEach(
              place.address_components,
              /* eslint-disable camelcase */
              (component) => {
                if (component.types.includes("postal_code")) {
                  this.location.zipCode = component.long_name;
                } else if (component.types.includes("sublocality_level_1")) {
                  this.location.city = component.long_name;
                } else if (
                  component.types.includes("administrative_area_level_1")
                ) {
                  this.location.state = component.long_name;
                }
              }
            );
          }
        });
      }
    },
  },
});
</script>
