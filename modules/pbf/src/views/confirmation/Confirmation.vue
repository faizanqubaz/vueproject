<template>
  <div class="container px-4 md:px-0 mx-auto">
    <div class="grid lg:grid-cols-3 md:grid-cols-1 my-8 gap-16">
      <div class="lg:col-span-2">
        <div class="flex items-center py-12">
          <div
            class="bg-primary w-12 h-12 flex justify-center items-center rounded-full mr-4"
          >
            <wz-icon name="check-white" class="w-6 h-6" />
          </div>
          <div>
            <p class="font-semibold text-2xl">Your appointment is confirmed.</p>
            <p>
              We'll send a confirmation email to:
              {{ appointment.patient.email }}
            </p>
          </div>
        </div>
        <div>
          <div class="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="font-medium">When</p>
              <div
                v-if="appointment.dateTime.date"
                class="p-4 border border-[#D0D7E3] rounded-lg"
              >
                <p class="font-semibold text-sm">{{ printDate() }}</p>
                <p class="font-medium text-lg">
                  {{
                    formatTimeSlot(
                      appointment.dateTime.startTime,
                      appointment.dateTime.endTime
                    )
                  }}
                </p>
              </div>
            </div>
            <div>
              <p class="font-medium">What</p>
              <div
                class="p-4 border border-[#D0D7E3] rounded-lg"
                v-if="service && service.service && service.servicePackage"
              >
                <div class="flex items-center gap-2">
                  <div
                    class="flex-none w-12 h-12 flex items-center justify-center"
                  >
                    <img :src="service.service.icon" alt="" />
                  </div>
                  <div class="">
                    <p class="font-semibold">{{ service.service.name }}</p>
                    <p class="text-[#878DA5]">
                      {{ service.servicePackage.name }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <p class="font-medium">Who</p>
              <div
                class="p-4 border border-[#D0D7E3] rounded-lg pb-16"
                v-if="appointment.patient"
              >
                <p class="font-semibold text-lg">
                  {{ appointment.patient.firstName }}
                  {{ appointment.patient.lastName }}
                </p>
                <div>
                  <div class="flex items-center">
                    <p class="text-[#878DA5]">
                      {{ appointment.patient.gender }}
                    </p>
                    <span class="bg-[#878DA5] w-1 h-1 mx-2 rounded-full" />
                    <p class="text-[#878DA5]">{{ dobDate() }}</p>
                  </div>
                  <p class="text-[#878DA5]">{{ appointment.patient.email }}</p>
                  <p class="text-[#878DA5]">{{ appointment.patient.phone }}</p>
                </div>
              </div>
            </div>
            <div
              v-if="
                appointment.location.latitude && appointment.location.longitude
              "
            >
              <p class="font-medium">Where</p>
              <div>
                <gmap-map
                  :center="{
                    lat: appointment.location.latitude,
                    lng: appointment.location.longitude,
                  }"
                  :zoom="12"
                  style="width: 100%; height: 180px"
                  ref="visitMap"
                >
                  <gmap-marker
                    :icon="{
                      url: '/dot.png',
                      scaledSize: {
                        width: 30,
                        height: 30,
                      },
                    }"
                    :position="{
                      lat: appointment.location.latitude,
                      lng: appointment.location.longitude,
                    }"
                  />
                </gmap-map>
                <p class="text-sm mt-1">
                  {{ appointment.location.address }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="">
        <div class="px-8 md:px-16 py-12 shadow-lg rounded-lg">
          <div class="text-center mb-8">
            <p class="text-[#233071] font-semibold text-2xl">
              Create your account
            </p>
            <p class="">Keep track of your appointments</p>
          </div>

          <div class="my-6">
            <wz-auth-input
              label="Email"
              v-model="email"
              type="email"
              :error="false"
              errorMessage=""
              placeholder="Email"
            />
          </div>
          <div class="my-6">
            <wz-auth-input
              label="Password"
              v-model="password"
              type="password"
              :error="false"
              errorMessage=""
              placeholder="Password"
            />
            <p class="text-right text-[#878DA5] text-sm">Forgot Password?</p>
          </div>
          <button
            class="bg-primary text-white w-full py-4 rounded-full font-medium mt-6"
            @click="createAccount"
          >
            Sign Up
          </button>

          <p class="text-center my-4 text-[#233071]">
            Already have an account? <span class="text-primary">Sign In</span>
          </p>
        </div>
      </div>
    </div>
    <div
      class="bg-[#387DF638] mt-16 p-8 rounded-lg grid md:grid-cols-6 lg:grid-cols-4 gap-4"
    >
      <div class="md:col-span-4 lg:col-span-3 md:flex items-center">
        <div
          class="bg-primary flex items-center justify-center w-16 h-16 rounded-xl mr-4"
        >
          <img src="/img/welz-icon.png" class="w-10 h-8" />
        </div>
        <div class="my-2 md:my-0">
          <p class="font-medium text-xl">
            Get the Welz appointment and scheduling app.
          </p>
          <p>
            Book a service, keep track of your appointments, cancel or
            reschedule and more...
          </p>
        </div>
      </div>
      <div class="mx-auto text-center md:flex justify-between items-center">
        <img src="/img/app-store.png" class="w-28 md:w-full h-10 md:mr-8" />
        <p class="text-primary">Download</p>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import moment from "moment";
import BookingApiClient from "@/api/BookingApiClient";

export default Vue.extend({
  computed: {
    appointment() {
      return this.$store.state.Appointment;
    },
    service() {
      return this.$store.state.Services;
    },
  },
  mounted() {
    this.email = this.appointment.patient.email;
  },
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    printDate() {
      return moment(this.appointment.dateTime.date).format(
        "dddd, MMMM DD YYYY"
      );
    },
    dobDate() {
      return moment(this.appointment.patient.dob).format("MM/DD/YYYY");
    },
    printPayment() {
      return this.appointment.payment.insurance ? "Insurance" : "Self-pay";
    },
    formatTimeSlot(startTime, endTime) {
      return `${moment(startTime, "HH:mm:ss").format("ha")} - ${moment(
        endTime,
        "HH:mm:ss"
      ).format("ha")}`;
    },
    async createAccount() {
      this.$store.commit("SET_IS_LOADING", true);
      const account = {
        visitId: this.$store.state.createdAppointment.id,
        firstName: this.appointment.patient.firstName,
        lastName: this.appointment.patient.lastName,
        dob: this.appointment.patient.dob,
        email: this.email,
        password: this.password,
      };
      try {
        const bookingApiClient = new BookingApiClient();
        await bookingApiClient.createAccount(account);
        this.$store.commit("SET_SNACKBAR_TYPE", "success");
        this.$store.commit("SET_SNACKBAR_MESSAGE", "Account created");
        this.$store.commit("SET_SNACKBAR_OPEN", true);
      } catch (error) {
        console.log("error", error.response);
        this.$store.commit("SET_SNACKBAR_TYPE", "error");
        this.$store.commit(
          "SET_SNACKBAR_MESSAGE",
          error.response && error.response.data && error.response.data.error
            ? error.response.data.message &&
              error.response.data.message.length > 0
              ? error.response.data.message[0]
              : error.response.data.error
            : "Sorry, something went wrong, please try again."
        );
        this.$store.commit("SET_SNACKBAR_OPEN", true);
      } finally {
        this.$store.commit("SET_IS_LOADING", false);
      }
    },
  },
});
</script>
