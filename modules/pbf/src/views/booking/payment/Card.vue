<template>
  <wz-page
    top-title="Book your appoinment"
    title="Payment Details"
    desc="Enter your Credit Card info to pay for your services."
    :next="true"
    @to-next="nextPage"
    :nextValid="isValid"
    :prev="true"
    @to-prev="prevPage"
  >
    <div class="py-8 md:w-full lg:w-4/5 mx-auto">
      <div class="mb-24">
        <div
          class="pt-8 grid md:grid-cols-1 lg:grid-cols-1 sm:grid-cols-1 gap-x-5 gap-y-3"
        >
          <div>
            <label class="font-medium">Card Number</label>
            <div
              class="mt-2 flex items-center w-full border px-3 py-sm rounded-lg cursor-text"
              :class="[onFocus === 'card' ? 'border-primary' : 'border-stroke']"
              @click="$refs.cardIfield.focusIfield(), (onFocus = 'card')"
            >
              <wz-icon name="card-front" class="w-6 h-6 mr-2 mt-1" />
              <ifields
                :account="ifieldAccount"
                :type="CARD_TYPE"
                :options="renderIfieldOptions('card')"
                ref="cardIfield"
                @token="(data) => handleTokenSuccess({ data, type: 'card' })"
                @error="handleTokenError"
                @focus="handleInputFocus({ type: 'card' })"
              />
            </div>
          </div>
        </div>
        <div
          class="pt-5 grid md:grid-cols-2 lg:grid-cols-2 sm:grid-cols-1 gap-x-5 gap-y-3"
        >
          <div>
            <label class="font-medium">Expiration Date</label>
            <div
              class="mt-2 flex items-center w-full border px-3 py-sm rounded-lg cursor-text"
              :class="[onFocus === 'exp' ? 'border-primary' : 'border-stroke']"
              @click="$refs.expDate.focus(), (onFocus = 'exp')"
            >
              <input
                maxlength="7"
                ref="expDate"
                v-model="cardInfo.expiration"
                :style="renderInputStyle('basic')"
                placeholder="MM / YYYY"
              />
            </div>
          </div>
          <div>
            <label class="font-medium">CVV</label>
            <div
              class="mt-2 flex items-center w-full border px-2 py-sm rounded-lg cursor-text"
              :class="[onFocus === 'cvv' ? 'border-primary' : 'border-stroke']"
              @click="$refs.cvvIfield.focusIfield(), (onFocus = 'cvv')"
            >
              <wz-icon name="cardBack" color="darkGray" class="mr-2" />
              <ifields
                :account="ifieldAccount"
                :type="CVV_TYPE"
                :options="renderIfieldOptions('cvv')"
                ref="cvvIfield"
                @token="(data) => handleTokenSuccess({ data, type: 'cvv' })"
                @error="handleTokenError"
                @focus="handleInputFocus({ type: 'cvv' })"
              />
            </div>
          </div>
        </div>
        <div
          class="pt-8 grid md:grid-cols-1 lg:grid-cols-1 sm:grid-cols-1 gap-x-5 gap-y-3"
        >
          <div>
            <label class="font-medium">Name on Card</label>
            <div
              class="mt-2 flex items-center w-full border px-3 py-sm rounded-lg cursor-text"
              :class="[onFocus === 'name' ? 'border-primary' : 'border-stroke']"
              @click="$refs.name.focus(), (onFocus = 'name')"
            >
              <input
                ref="name"
                v-model="cardInfo.name"
                :style="renderInputStyle('basic')"
                placeholder="Name"
              />
            </div>
          </div>
        </div>
        <div
          class="pt-5 grid md:grid-cols-2 lg:grid-cols-2 sm:grid-cols-1 gap-x-5 gap-y-3"
        >
          <div>
            <label class="font-medium">Zip Code</label>
            <div
              class="mt-2 flex items-center w-full border px-3 py-sm rounded-lg cursor-text"
              :class="[
                onFocus === 'zipCode' ? 'border-primary' : 'border-stroke',
              ]"
              @click="$refs.zipCode.focus(), (onFocus = 'zipCode')"
            >
              <input
                maxlength="5"
                ref="zipCode"
                v-model="cardInfo.zipCode"
                :style="renderInputStyle('basic')"
                placeholder="Zip Code"
              />
            </div>
          </div>
          <div>
            <label class="font-medium">Email</label>
            <div
              class="mt-2 flex items-center w-full border px-3 py-sm rounded-lg cursor-text"
              :class="[
                onFocus === 'email' ? 'border-primary' : 'border-stroke',
              ]"
              @click="$refs.email.focus(), (onFocus = 'email')"
            >
              <input
                ref="email"
                v-model="cardInfo.email"
                :style="renderInputStyle('basic')"
                placeholder="Email"
              />
            </div>
          </div>
        </div>

        <div class="my-8 text-center">
          <p class="text-danger text-sm">{{ errorMsg }}</p>
        </div>
      </div>
    </div>
  </wz-page>
</template>

<script>
import Vue from "vue";
import ifields, { CARD_TYPE, CVV_TYPE } from "@cardknox/vue-cardknox-ifields";

export default Vue.extend({
  components: {
    ifields,
  },
  data() {
    return {
      cardInfo: {
        name: "",
        email: "",
        expiration: "",
        zipCode: "",
        lastFour: "",
      },
      ifieldAccount: {
        xKey: process.env.VUE_APP_CARDKNOX_KEY,
        xSoftwareName: "welz-patient-booking-app",
        xSoftwareVersion: "1.0.0",
      },
      cardData: {},
      onFocus: "",
      errorMsg: "",
    };
  },
  created() {
    this.CARD_TYPE = CARD_TYPE;
    this.CVV_TYPE = CVV_TYPE;
  },
  methods: {
    renderIfieldOptions(type) {
      return {
        enableLogging: false,
        autoFormat: true,
        autoFormatSeparator: " ",
        placeholder: type === "card" ? "0000 0000 0000 0000" : "CVV",
        iFieldstyle: this.renderInputStyle(type),
      };
    },
    renderInputStyle(type) {
      return {
        width: "90%",
        "max-width": "90%",
        border: "none",
        color: "#363636",
        padding: "0",
        "font-size": "1rem",
        outline: "0",
        margin: type === "basic" ? "0" : "3px 0 0",
      };
    },
    async submitToken(type) {
      try {
        const ref = this.getRefFromType(type);
        await ref.getToken();
      } catch (error) {
        console.error(error);
      }
    },
    getRefFromType(type) {
      switch (type) {
        case CARD_TYPE:
          return this.$refs.cardIfield;
        case CVV_TYPE:
          return this.$refs.cvvIfield;
        default:
          throw Error("unknown type");
      }
    },
    handleTokenSuccess({ data, type }) {
      if (type === "card") {
        this.getLastFour(data.data.xToken);
      }
      this.cardData = { ...this.cardData, [type]: data.data.xToken };
    },
    handleTokenError({ data }) {
      const errMsg = data.errorMessage;
      this.$store.commit("SET_IS_LOADING", false);
      this.errorMsg =
        errMsg || "Sorry, something went wrong, please try again.";
    },
    handleInputFocus({ type }) {
      this.onFocus = type;
    },
    getLastFour(token) {
      const splitToken = token.split(";");
      const cardNumber = splitToken[0];
      const lastFour = cardNumber.substring(cardNumber.length - 4);
      this.cardInfo.lastFour = lastFour;
    },
    async nextPage() {
      this.errorMsg = "";
      if (this.isValid) {
        this.$store.commit("SET_IS_LOADING", true);
        await this.submitToken(this.CARD_TYPE);
        await this.submitToken(this.CVV_TYPE);
      }
    },
    prevPage() {
      this.$router.back();
    },
  },
  watch: {
    cardData: {
      handler() {
        if (this.cardData.card && this.cardData.cvv) {
          const card = {
            token: this.cardData.card,
            cvv: this.cardData.cvv,
            ...this.cardInfo,
          };

          this.$store.commit("SET_IS_LOADING", false);
          this.$store.commit("SET_CARD", card);
          this.$router.push("/booking/review");
        }
      },
      deep: true,
    },
  },
  computed: {
    isValid() {
      return (
        !!this.cardInfo.expiration &&
        !!this.cardInfo.zipCode &&
        !!this.cardInfo.email &&
        !!this.cardInfo.name
      );
    },
  },
});
</script>

<style scoped>
iframe {
  height: 24px;
  width: 50%;
}

input {
  font-family: Arial, Helvetica, sans-serif;
}
</style>
