<template>
  <div>
    <v-autocomplete
      v-model="inputVal"
      :items="locationList"
      :label="label"
      :search-input.sync="locationSearch"
      :loading="isLoading"
      item-text="description"
      item-value="place_id"
      clearable
    />
    <div id="map" hidden />
  </div>
</template>

<script>
import { forEach } from "lodash";

export default {
  name: "google-autocomplete",
  props: {
    label: null,
    tempVal: null,
  },
  data() {
    return {
      autocomplete: null,
      locationList: this.tempVal ? [{ description: this.tempVal }] : [],
      locationSearch: null,
      isLoading: false,
      value: this.tempVal || null,
    };
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
      this.isLoading = false;
      if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
        return (this.locationList = []);
      }
      this.locationList = predictions;
    },
  },
  computed: {
    inputVal: {
      get() {
        return this.value;
      },
      set(val) {
        let mapData = {
          street: "",
          latitude: 0,
          longitude: 0,
          city: "",
          state: "",
          zipCode: "",
        };
        const request = {
          placeId: val,
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
            mapData = {
              ...mapData,
              street:
                place.formatted_address === undefined
                  ? ""
                  : place.formatted_address.split(",")[0],
            };
            if (mapData.street) {
              mapData.latitude = place.geometry.location.lat();
              mapData.longitude = place.geometry.location.lng();
            }
            forEach(place.address_components, (component) => {
              if (component.types.includes("postal_code")) {
                mapData.zipCode = component.long_name;
              } else if (component.types.includes("neighborhood")) {
                mapData.city = component.long_name;
              } else if (
                component.types.includes("administrative_area_level_1")
              ) {
                mapData.state = component.long_name;
              }
            });
          }
          this.$emit("input", mapData);
        });
      },
    },
  },
  watch: {
    locationSearch(newValue) {
      if (!this.autocomplete) {
        this.initMap();
      } else {
        if (newValue) {
          if (this.isLoading) return;

          this.isLoading = true;

          this.autocomplete.getPlacePredictions(
            {
              input: newValue,
              componentRestrictions: { country: "us" },
            },
            this.displaySuggestions
          );
        }
      }
    },
  },
};
</script>
