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
    <div class="py-8 md:w-full lg:w-4/5 mx-auto">
      <div class="mx-auto grid grid-cols-2 gap-4">
        <wz-select
          v-model="insuranceData.policyHolder"
          :items="['Myself']"
          label="Primary Policy Holder"
          :filter="false"
          required
          placeholder="Primary Policy Holder"
        />
        <wz-input
          label="Insurance Provider"
          v-model="insuranceData.policyProvider"
          type="text"
          :error="false"
          errorMessage=""
          placeholder="Insurance Provider"
        />
        <wz-input
          label="Insurance Number"
          v-model="insuranceData.policyNumber"
          type="text"
          :error="false"
          errorMessage=""
          placeholder="Your Member ID"
        />
        <wz-input
          label="Group Number"
          v-model="insuranceData.groupNumber"
          type="text"
          :error="false"
          errorMessage=""
          placeholder="Your Group Number (if applicable)"
        />
      </div>

      <div class="mt-16">
        <p class="font-semibold text-xl text-center">
          Upload your Insurance Card
        </p>
        <div class="my-4 mx-auto grid grid-cols-2 gap-4">
          <wz-upload label="Front" v-model="insuranceImg.front">
            <h4>Add image</h4>
            <p class="font-normal text-gray-700 antialiased">Front of card</p>
          </wz-upload>
          <wz-upload label="Back" v-model="insuranceImg.back">
            <h4>Add image</h4>
            <p class="font-normal text-gray-700 antialiased">Back of card</p>
          </wz-upload>
        </div>
      </div>
    </div>
  </wz-page>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  data() {
    return {
      insuranceData: {
        policyHolder: "Myself",
        policyProvider: "",
        policyNumber: "",
        groupNumber: "",
      },
      insuranceImg: {
        front: "",
        back: "",
      },
    };
  },
  methods: {
    selectPayment(id) {
      this.selectedPayment = id;
    },
    nextPage() {
      const insurance = {
        ...this.insuranceData,
        ...this.insuranceImg,
      };
      this.$store.commit("SET_INSURANCE", insurance);
      this.$router.push("/booking/review");
    },
    prevPage() {
      this.$router.back();
    },
  },
  computed: {
    isValid() {
      return (
        !!this.insuranceData.policyHolder &&
        !!this.insuranceData.policyProvider &&
        !!this.insuranceData.policyNumber &&
        !!this.insuranceImg.front &&
        !!this.insuranceImg.back
      );
    },
  },
});
</script>
