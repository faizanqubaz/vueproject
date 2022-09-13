<template>
  <wz-page
    top-title=""
    title="Review your appointment details."
    desc=""
    :next="true"
    @to-next="submitAppointment"
    :nextValid="true"
    :confirmation="true"
  >
    <div class="py-8 sm:w-full md:w-3/5 mx-auto">
      <div class="mb-24">
        <div class="grid sm:grid-cols-1 md:grid-cols-2 gap-8">
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
            <p class="font-medium">What</p>
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
                  <p class="text-[#878DA5]">{{ appointment.patient.gender }}</p>
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
          <div>
            <p class="font-medium">Payment</p>
            <div class="p-4 border border-[#D0D7E3] rounded-lg">
              <div class="flex justify-between">
                <div class="flex">
                  <span
                    class="bg-[#F1F4F9] rounded-full w-8 h-8 flex items-center justify-center font-bold"
                  >
                    $
                  </span>
                  <p class="ml-4 mt-1 font-semibold">{{ printPayment() }}</p>
                </div>
                <div v-if="service && service.servicePackage">
                  <p class="text-success mt-1">
                    $ {{ service.servicePackage.price }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </wz-page>
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
    async submitAppointment() {
      let serviceNotes = this.service.serviceNotes
        .map((notes) => notes.description)
        .join(", ");
      let notes = serviceNotes
        ? (this.service.additionalNotes += ", " + serviceNotes)
        : this.service.additionalNotes;
      const payload = {
        patient: {
          firstName: this.appointment.patient.firstName,
          middleName: "",
          lastName: this.appointment.patient.lastName,
          dob: this.toISO(this.appointment.patient.dob),
          gender: this.appointment.patient.gender,
          phone: "+1" + this.appointment.patient.phone,
          email: this.appointment.patient.email,
          address: {
            street: this.appointment.location.street,
            // address: this.appointment.location.address,
            apartment: this.appointment.location.apartment,
            city: this.appointment.location.city,
            state: this.appointment.location.state,
            latitude: this.appointment.location.latitude,
            longitude: this.appointment.location.longitude,
            primary: true,
            zipCode: this.appointment.location.zipCode,
          },
        },
        visit: {
          date: this.toISO(this.appointment.dateTime.date),
          scheduledStartTime: this.appointment.dateTime.startTime,
          scheduledEndTime: this.appointment.dateTime.endTime,
          serviceId: this.service.servicePackage.id,
        },
        payment: this.appointment.payment.card ? this.appointment.card : null,
        insurance: this.appointment.payment.insurance
          ? this.appointment.insurance
          : null,
        note: notes || "",
      };
      try {
        this.$store.commit("SET_IS_LOADING", true);
        const bookingApiClient = new BookingApiClient();
        const response = await bookingApiClient.createAppointment(payload);
        if (response) {
          this.$store.commit("SET_SNACKBAR_TYPE", "success");
          this.$store.commit("SET_SNACKBAR_MESSAGE", "Appointment Booked");
          this.$store.commit("SET_SNACKBAR_OPEN", true);
          this.$store.commit("SET_CREATED_APPOINTMENT", response.result);
          this.$router.push("/confirmation");
        }
      } catch (error) {
        this.$store.commit("SET_SNACKBAR_TYPE", "error");
        this.$store.commit(
          "SET_SNACKBAR_MESSAGE",
          "Failed Book an Appointment"
        );
        this.$store.commit("SET_SNACKBAR_OPEN", true);
      } finally {
        this.$store.commit("SET_IS_LOADING", false);
      }
    },
    toISO(date) {
      const timezoneOffset = moment(date).utcOffset();
      return moment(date)
        .utc()
        .add(timezoneOffset, "minutes")
        .startOf("day")
        .toISOString();
    },
  },
});
</script>
