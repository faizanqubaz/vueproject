<template>
  <wz-page
    top-title="Book your appoinment"
    :title="
      symptoms && symptoms.length > 0
        ? 'Select your symptoms:'
        : 'Appointment Details:'
    "
    :next="true"
    :prev="true"
    :nextValid="serviceChecker"
    @to-next="nextPage"
    @to-prev="prevPage"
  >
    <div class="grid grid-cols-3 gap-16 py-8">
      <div class="col-span-3 md:col-span-2">
        <div
          class="flex gap-4 flex-wrap mb-4"
          v-if="symptoms && symptoms.length > 0"
        >
          <div
            class="flex items-center gap-2 bg-symptomsBG p-2 border rounded-md cursor-pointer"
            :class="symptom.active ? 'border-primary' : 'bg-symptomsBG'"
            v-for="symptom in symptoms"
            :key="symptom.id"
            @click="symptom.active = !symptom.active"
          >
            <span class="text-sm">{{ symptom.description }}</span>
            <wz-icon
              v-if="symptom.active"
              name="check-white"
              class="p-1 flex items-center justify-center rounded-full w-6 h-6 mx-auto bg-primary"
            />
            <wz-icon
              v-else
              name="plus"
              class="p-1 flex items-center justify-center rounded-full w-6 h-6 mx-auto"
            />
          </div>
        </div>
        <div class="grid col-span-1 md:grid-cols-2 gap-4">
          <div class="col-span-1">
            <div class="font-bold mb-4">Select your service:</div>
            <div class="grid grid-cols-1 gap-2" v-if="serviceVar">
              <div
                class="border cursor-pointer rounded-md"
                v-for="service in serviceVar.services"
                :key="service.id"
                @click="servicePackage = service"
                :class="
                  servicePackage && servicePackage.id === service.id
                    ? 'border-primary'
                    : ''
                "
              >
                <div class="flex gap-3 items-start p-4">
                  <wz-icon
                    v-if="servicePackage && servicePackage.id === service.id"
                    name="check-white"
                    class="p-1 flex-none flex items-center justify-center rounded-full w-6 h-6 mx-auto bg-primary"
                  />
                  <div
                    v-else
                    class="w-6 h-6 flex-none rounded-full border"
                  ></div>
                  <div class="flex-1">
                    <div class="font-bold">{{ service.name }}</div>
                    <p class="font-light text-gray-400">
                      {{ service.description }}
                    </p>
                  </div>
                </div>
                <div
                  class="border-t p-4 grid grid-cols-2 divide-x text-center text-sm font-light text-gray-400"
                >
                  <div class="flex items-center gap-2 justify-center">
                    <wz-icon name="check-black" class="w-4 h-4" />
                    <span> Insurance</span>
                  </div>
                  <div class="">
                    Self Pay
                    <span class="font-semibold">${{ service.price }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-span-1">
            <div class="font-bold mb-4">
              Tell us more about what you're experiencing.
            </div>
            <textarea
              v-model="additionalNotes"
              class="rounded-md border border-gray-200 resize-none p-2 w-full"
              rows="11"
              placeholder="Start typing more about your symptoms or anything we should know about..."
            ></textarea>
          </div>
        </div>
      </div>
      <div class="col-span-3 md:col-span-1 rounded-md bg-symptomsBG p-4">
        <div class="font-bold mb-4">Your Service</div>
        <service class="mb-4" :clickable="false" :serviceData="serviceVar" />

        <div class="text-xs flex flex-col gap-2 text-gray-400 font-light">
          <div class="grid gap-4 items-center grid-cols-3">
            <wz-icon name="check-green" class="ml-auto w-3 h-3 col-span-1" />
            <span class="col-span-2"> Personal & Discreet </span>
          </div>
          <div class="grid gap-4 items-center grid-cols-3">
            <wz-icon name="check-green" class="ml-auto w-3 h-3 col-span-1" />
            <span class="col-span-2"> Insurance Accepted </span>
          </div>
          <div class="grid gap-4 items-center grid-cols-3">
            <wz-icon name="check-green" class="ml-auto w-3 h-3 col-span-1" />
            <span class="col-span-2"> Book for Now or Later </span>
          </div>
        </div>
      </div>
    </div>
  </wz-page>
</template>

<script>
import Vue from "vue";
import Service from "./components/Service.vue";
import BookingApiClient from "@/api/BookingApiClient";

export default Vue.extend({
  components: { Service },
  watch: {
    serviceVar(val) {
      this.servicePackage = this.serviceVar.services[0];
      if (val.name === "At-home Care") {
        this.getSymptoms();
      }
    },
  },
  computed: {
    serviceChecker() {
      let valid = false;
      this.$store.state.Services.servicePackage &&
      this.$store.state.Services.servicePackage.id
        ? (valid = true)
        : (valid = false);
      return valid;
    },
    serviceVar() {
      return this.$store.state.Services.service;
    },
    servicePackage: {
      get() {
        return this.$store.state.Services.servicePackage;
      },
      set(val) {
        this.$store.commit("SET_SERVICE_PACKAGE", val);
      },
    },
    additionalNotes: {
      get() {
        return this.$store.state.Services.additionalNotes;
      },
      set(val) {
        this.$store.commit("SET_SERVICE_ADDITIONAL_NOTES", val);
      },
    },
    symptoms() {
      return this.$store.state.Services.symptoms;
    },
  },
  methods: {
    nextPage() {
      let symptoms = this.symptoms.filter((res) => {
        return res.active;
      });
      this.$store.commit("SET_SERVICE_NOTES", symptoms);

      this.$router.push("/booking/timeslot");
    },
    prevPage() {
      this.$router.back();
    },
    async getSymptoms() {
      try {
        this.$store.commit("SET_IS_LOADING", true);
        const bookingApiClient = new BookingApiClient();
        const response = await bookingApiClient.getSymptoms(
          this.serviceVar.services[0].id
        );
        if (response.result) {
          let symptoms = [];
          response.result.forEach((res) => {
            res.active = false;
            symptoms.push(res);
          });
          this.$store.commit("SET_SYMPTOMS", response.result);
        }
      } catch (error) {
        console.info(error);
      } finally {
        this.$store.commit("SET_IS_LOADING", false);
      }
    },
  },
});
</script>
