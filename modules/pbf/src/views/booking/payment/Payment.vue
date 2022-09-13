<template>
  <wz-page
    top-title="Book your appoinment"
    title="Health Insurance"
    desc=""
    :next="true"
    @to-next="nextPage"
    :nextValid="isValid"
    :prev="true"
    @to-prev="prevPage"
  >
    <div class="py-8 md:w-full mx-auto text-center">
      <div class="mb-24">
        <p>Do you have health insurance?</p>
        <div class="flex justify-center my-4">
          <div
            class="rounded-lg py-4 px-16 mx-4 cursor-pointer"
            :class="
              opt.value === selectedPayment
                ? 'text-primary border-2 border-primary'
                : 'border border-[#4A4D54]'
            "
            v-for="opt in optPayments"
            :key="opt.value"
            @click="selectPayment(opt.value)"
          >
            <p class="font-medium text-lg">{{ opt.label }}</p>
          </div>
        </div>
      </div>

      <div v-show="selectedPayment">
        <p>How it works:</p>
        <p>{{ desc[selectedPayment] }}</p>
      </div>
    </div>
  </wz-page>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  data() {
    return {
      selectedPayment: "",
      optPayments: [
        {
          label: "Yes",
          value: "insurance",
        },
        {
          label: "No",
          value: "card",
        },
      ],
      desc: {
        insurance:
          "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea.",
        card: "Pay $99 for your appointment.",
      },
    };
  },
  methods: {
    selectPayment(id) {
      this.selectedPayment = id;
    },
    nextPage() {
      const payment = {
        insurance: this.selectedPayment === "insurance" ? true : false,
        card: this.selectedPayment === "card" ? true : false,
      };
      this.$store.commit("SET_PAYMENT", payment);

      if (this.selectedPayment === "insurance") {
        this.$router.push("/booking/insurance");
      } else {
        this.$router.push("/booking/card");
      }
    },
    prevPage() {
      this.$router.back();
    },
  },
  computed: {
    isValid() {
      return !!this.selectedPayment;
    },
  },
});
</script>
