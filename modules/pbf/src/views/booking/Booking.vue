<template>
  <div class="min-h-screen bg-[#F5F8FB]">
    <nav class="w-full bg-white">
      <div class="h-8 bg-primary" />
      <div
        class="container mx-auto flex justify-between text-center w-full bg-white"
      >
        <div class="py-4">
          <a href="https://www.welz.com">
            <img src="@/assets/welz_logo.png" alt="logo" class="h-7" />
          </a>
        </div>
        <div class="hidden md:flex justify-center flex-1">
          <div
            v-for="(nav, i) in bookingStepList"
            :key="nav.id"
            class="py-4 mx-4 px-4 font-medium"
            :class="
              currentStep === nav.step
                ? 'text-black border-b-2 border-primary'
                : 'text-gray-400'
            "
          >
            <div class="flex justify-center items-center">
              <span
                v-if="currentStep > nav.step"
                class="w-8 h-8 rounded-full bg-success flex justify-center items-center"
              >
                <wz-icon name="check-white" class="w-4 h-4" />
              </span>
              <span
                v-else-if="currentStep === nav.step"
                class="w-8 h-8 rounded-full text-white bg-primary flex justify-center items-center"
              >
                {{ i + 1 }}
              </span>
              <span
                v-else
                class="w-8 h-8 rounded-full text-gray-400 border-2 border-gray-300 flex justify-center items-center"
              >
                {{ i + 1 }}
              </span>
              <p
                class="ml-2"
                :class="currentStep > nav.step ? 'text-success' : ''"
              >
                {{ nav.label }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <main class="py-8">
      <location v-show="$route.params.id === 'location'" />
      <services v-show="$route.params.id === 'services'" />
      <symptoms v-show="$route.params.id === 'symptoms'" />
      <timeslot
        :isLoaded="$route.params.id === 'timeslot'"
        v-show="$route.params.id === 'timeslot'"
      />
      <payment v-show="$route.params.id === 'payment'" />
      <insurance v-show="$route.params.id === 'insurance'" />
      <card v-show="$route.params.id === 'card'" />
      <review v-show="$route.params.id === 'review'" />
      <patient v-show="$route.params.id === 'patient'" />
    </main>

    <section
      v-show="$route.params.id === 'location'"
      class="grid md:grid-cols-1 lg:grid-cols-4 container mx-auto rounded-lg drop-shadow my-12"
    >
      <div class="mx-md text-center" v-for="feat in featList" :key="feat.icon">
        <div class="mb-4 text-center">
          <wz-icon :name="feat.icon" class="fill-primary w-6 h-6 mx-auto" />
        </div>
        <div class="">
          <p class="font-semibold text-xl my-2">{{ feat.title }}</p>
          <p class="font-light text-sm my-2">{{ feat.desc }}</p>
        </div>
      </div>
    </section>

    <wz-snackbars
      v-model="snackbarOpen"
      :type="$store.state.snackbar.type"
      :timeout="$store.state.snackbar.timeout"
      multiline
    >
      <template>
        <div class="w-80 pl-4 text-white">
          {{ $store.state.snackbar.message }}
        </div>
      </template>
      <template #action>
        <button @click="snackbarOpen = false" class="text-white mr-4">
          Close
        </button>
      </template>
    </wz-snackbars>
  </div>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  components: {
    Location: () => import("./location/Location.vue"),
    Services: () => import("./details/Services.vue"),
    Symptoms: () => import("./details/Symptoms.vue"),
    Patient: () => import("./details/Patient.vue"),
    Timeslot: () => import("./time/Timeslot.vue"),
    Payment: () => import("./payment/Payment.vue"),
    Insurance: () => import("./payment/Insurance.vue"),
    Card: () => import("./payment/Card.vue"),
    Review: () => import("./review/Review.vue"),
  },
  computed: {
    snackbarOpen: {
      get() {
        return this.$store.state.snackbar.open;
      },
      set(val) {
        this.$store.commit("SET_SNACKBAR_OPEN", val);
      },
    },
  },
  mounted() {
    if (!window.location.hostname.includes("localhost")) {
      window.onbeforeunload = () => {
        return "Are you sure you want to leave this page?";
      };
    }
  },
  watch: {
    "$route.params"({ id }) {
      const objNav = this.bookingStepList.find((nav) => nav.urls.includes(id));
      this.currentStep = objNav.step;
    },
  },
  data() {
    return {
      currentStep: 1,
      featList: [
        {
          icon: "check-square",
          title: "Designed for life",
          desc: "Instant app- and web-based booking with live connection to your Welzer.",
        },
        {
          icon: "shield",
          title: "HIPAA-compliant.",
          desc: "Private, secure, and optimized for effortless submission to your insurance carrier.",
        },
        {
          icon: "message",
          title: "As intuitive as SMS.",
          desc: "A simple, humanistic booking design that feels accessible to users of all ages.",
        },
        {
          icon: "heart",
          title: "All for your good.",
          desc: "A simple, humanistic booking design that feels accessible to users of all ages.",
        },
      ],
      bookingStepList: [
        { step: 1, label: "Location", urls: ["location"] },
        {
          step: 2,
          label: "Details",
          urls: ["services", "symptoms", "patient"],
        },
        { step: 3, label: "Time", urls: ["timeslot"] },
        { step: 4, label: "Payment", urls: ["payment", "insurance", "card"] },
        { step: 5, label: "Confirm", urls: ["review"] },
      ],
    };
  },
});
</script>
