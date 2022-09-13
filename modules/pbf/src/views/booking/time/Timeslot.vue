<template>
  <wz-page
    top-title="Book your appoinment"
    title="Schedule a time that works for you."
    desc=""
    :next="true"
    @to-next="nextPage"
    :nextValid="isValid"
    :prev="true"
    @to-prev="prevPage"
  >
    <div class="py-8 max-w-screen-md mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="col-span-1">
          <vc-date-picker
            class="border-none"
            v-model="dateTime.date"
            is-expanded
            title-position="left"
            :min-date="new Date()"
          />
        </div>
        <div class="col-span-1 flex flex-col justify-between">
          <div>
            <p class="font-medium text-lg">Available timeslots</p>
            <p>Every appointment is scheduled within a 2 hour time period.</p>
            <div class="grid grid-cols-2 md:flex md:flex-wrap">
              <div
                v-for="slot in timeSlots"
                :key="slot.id"
                class="border border-[#E1E6EB] text-center mx-2 my-2 py-2 px-4 rounded cursor-pointer"
                :class="[
                  dateTime.id === slot.id ? 'bg-primary' : 'bg-[#F5F8FB]',
                  !slot.active
                    ? 'opacity-60 cursor-not-allowed'
                    : 'cursor-pointer',
                ]"
                @click="slot.active ? selectTimeSlot(slot.id) : null"
              >
                <p :class="[dateTime.id === slot.id ? 'text-white' : '']">
                  {{ formatTimeSlot(slot.startTime, slot.endTime) }}
                </p>
              </div>
            </div>
          </div>
          <div v-show="dateTimeSelected">
            <p>Your appointment:</p>
            <p class="font-semibold">{{ dateTimeSelected }}</p>
          </div>
        </div>
      </div>
    </div>
  </wz-page>
</template>

<script>
import Vue from "vue";
import BookingApiClient from "@/api/BookingApiClient";
import moment from "moment";
import "moment-timezone";
import { find } from "lodash";

export default Vue.extend({
  props: {
    isLoaded: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dateTime: {
        startTime: "",
        endTime: "",
        date: new Date(),
        id: 0,
      },
      timeSlots: [],
      dateTimeSelected: "",
      errorMsg: "",
    };
  },
  methods: {
    async fetchAppointment() {
      try {
        this.$store.commit("SET_IS_LOADING", true);
        const bookingApiClient = new BookingApiClient();
        const fetchDate = moment(this.dateTime.date).toISOString();
        const response = await bookingApiClient.getServiceTimeSlots(
          fetchDate,
          this.$store.state.Appointment.location.cityId,
          this.$store.state.Services.service.id
        );
        if (response.result.length > 0) {
          this.timeSlots = [];
          this.dateTime.id = 0;
          this.dateTime.startTime = "";
          this.dateTime.endTime = "";
          response.result.forEach((slot) => {
            this.timeSlots.push({
              id: slot.id,
              startTime: slot.startTime,
              endTime: slot.endTime,
              active:
                slot.enabled && this.isAvailable(fetchDate, slot.startTime),
            });
          });
        } else {
          this.errorMsg = "Sorry! We do not have any available time slots.";
        }
      } catch (error) {
        this.errorMsg = "Sorry, something went wrong, please try again.";
      } finally {
        this.$store.commit("SET_IS_LOADING", false);
      }
    },
    formatTimeSlot(startTime, endTime) {
      return `${moment(startTime, "HH:mm:ss").format("ha")} - ${moment(
        endTime,
        "HH:mm:ss"
      ).format("ha")}`;
    },
    isAvailable(fetchDate, startTime) {
      const startMoment = moment(
        `${fetchDate} ${startTime}`,
        "YYYY-MM-DD ha"
      ).tz(this.timezone);
      return moment().isBefore(startMoment);
    },
    selectTimeSlot(id) {
      const slot = find(this.timeSlots, (s) => s.id === id);
      this.dateTime.id = id;
      this.dateTime.startTime = slot.startTime;
      this.dateTime.endTime = slot.endTime;
    },
    nextPage() {
      this.$store.commit("SET_DATETIME", this.dateTime);
      this.$router.push("/booking/patient");
    },
    prevPage() {
      this.$router.back();
    },
  },
  computed: {
    isValid() {
      return (
        !!this.dateTime.date &&
        !!this.dateTime.id &&
        !!this.dateTime.startTime &&
        !!this.dateTime.endTime
      );
    },
    printDate() {
      return moment(this.dateTime.date).format("dddd, MMMM DD YYYY");
    },
    timezone() {
      return this.$store.state.Appointment.location.timeZone;
    },
  },
  watch: {
    isLoaded(val) {
      if (val) {
        this.dateTime.date = new Date();
        this.fetchAppointment();
      }
    },
    "dateTime.date"(newDate) {
      this.dateTime.date = newDate;
      this.fetchAppointment();
      this.dateTimeSelected = "";
    },
    "dateTime.id"(newValue) {
      if (newValue) {
        const slot = find(this.timeSlots, { id: newValue });
        if (slot) {
          this.dateTime.startTime = slot.startTime;
          this.dateTime.endTime = slot.endTime;
        }

        this.dateTimeSelected = `${this.printDate}, ${this.formatTimeSlot(
          this.dateTime.startTime,
          this.dateTime.endTime
        )}`;
      }
    },
  },
});
</script>

<style>
.vc-highlight {
  background-color: #3856f6 !important;
}
.vc-weekday {
  border-bottom: 1px solid var(--gray-200) !important;
}
.vc-day {
  min-height: 40px !important;
}
</style>
