<template>
  <div class="max-w-screen-md mx-auto py-14 gap sm:gap-y-10">
    <div class="pl-4 pr-4 pt-0">
      <div class="w-2/5">
        <wz-progress width="6/8" />
      </div>
      <div class="pt-7">
        <h1 class="text-xl">Payment</h1>
        <p
          class="pt-3 text-base lg:text-lg font-normal text-gray-700 antialiased"
        >
          Please provide the credit card information to pay for the chosen
          service
        </p>
      </div>
      <div
        class="pt-8 grid md:grid-cols-1 lg:grid-cols-1 sm:grid-cols-1 gap-x-5 gap-y-3"
      >
        <div>
          <label>Card Number</label>
          <div
            class="flex items-center w-full border px-3 py-sm rounded cursor-text"
            :class="[onFocus === 'card' ? 'border-primary' : 'border-stroke']"
            @click="$refs.cardIfield.focusIfield(), onFocus = 'card'"
          >
            <wz-icon name="cardFront" color="darkGray" class="mr-2" />
            <ifields
              :account="ifieldAccount"
              :type="CARD_TYPE"
              :options="renderIfieldOptions('card')"
              ref="cardIfield"
              @token="data => handleTokenSuccess({ data, type: 'card' })"
              @error="handleTokenError"
              @focus="handleInputFocus({ type: 'card' })"
            />
          </div>
        </div>
      </div>
      <div
        class="pt-5 grid md:grid-cols-3 lg:grid-cols-3 sm:grid-cols-1 gap-x-5 gap-y-3"
      >
        <div>
          <label>Expiration Date</label>
          <div
            class="flex items-center w-full border px-3 py-sm rounded cursor-text"
            :class="[onFocus === 'exp' ? 'border-primary' : 'border-stroke']"
            @click="$refs.expDate.focus(), onFocus = 'exp'"
          >
            <wz-icon name="calendar" color="darkGray" class="mr-2" />
            <input maxlength="7" ref="expDate" v-model="cardInfo.expirationDate" :style="renderInputStyle('exp')" placeholder="MM/YYYY" />
          </div>
        </div>
        <div>
          <label>CVV</label>
          <div
            class="flex items-center w-full border px-2 py-sm rounded cursor-text"
            :class="[onFocus === 'cvv' ? 'border-primary' : 'border-stroke']"
            @click="$refs.cvvIfield.focusIfield(), onFocus = 'cvv'"
          >
            <wz-icon name="cardBack" color="darkGray" class="mr-2" />
            <ifields
              :account="ifieldAccount"
              :type="CVV_TYPE"
              :options="renderIfieldOptions('cvv')"
              ref="cvvIfield"
              @token="data => handleTokenSuccess({ data, type: 'cvv' })"
              @error="handleTokenError"
              @focus="handleInputFocus({ type: 'cvv' })"
            />
          </div>
        </div>
        <div>
          <label>Zip Code</label>
          <div
            class="flex items-center w-full border px-2 py-sm rounded cursor-text"
            :class="[onFocus === 'zipCode' ? 'border-primary' : 'border-stroke']"
            @click="$refs.zipCode.focus(), onFocus = 'zipCode'"
          >
            <wz-icon name="map-pin" color="darkGray" class="mr-2" />
            <input maxlength="7" ref="zipCode" v-model="cardInfo.zipCode"
            :style="renderInputStyle('exp')" placeholder="Zip Code" />
          </div>
        </div>
      </div>
      <div class="pt-8">
        <wz-button color="primary" block :disabled="isSubmitting || !isValid" @click="proceed">
          <p class="text-white">Proceed</p>
        </wz-button>
      </div>
      <div class="pt-4 items-center">
        <wz-button type="button" block text @click="$router.back()">
          <p class="text-darkGray">← Go back</p>
        </wz-button>
      </div>
    </div>
    <wz-snackbars v-model="snackbar.open" color="fontPrimary" :timeout="6000">
      <template>
        <div class="w-80 pl-4 text-white">{{ snackbar.message }}</div>
      </template>
      <template #action>
        <wz-button
          text
          @click="snackbar.open= false"
          color="red"
          class="text-red mr-4"
          >Close</wz-button>
      </template>
    </wz-snackbars>
  </div>
</template>

<script>
import Vue from 'vue'
import ifields, { CARD_TYPE, CVV_TYPE } from '@cardknox/vue-cardknox-ifields'

export default Vue.extend({
  data () {
    return {
      cardInfo: {
        number: '',
        name: '',
        expirationDate: '',
        cvc: '',
        zipCode: ''
      },
      lastFour: '',
      ifieldAccount: {
        xKey: process.env.VUE_APP_CARDKNOX_KEY,
        xSoftwareName: 'welz-patient-booking-app',
        xSoftwareVersion: '1.0.0'
      },
      isSubmitting: false,
      cardData: {},
      onFocus: '',
      snackbar: {
        open: false,
        message: ''
      }
    }
  },
  created () {
    this.CARD_TYPE = CARD_TYPE
    this.CVV_TYPE = CVV_TYPE
  },
  methods: {
    renderIfieldOptions (type) {
      return {
        enableLogging: false,
        autoFormat: true,
        autoFormatSeparator: ' ',
        placeholder: type === 'card' ? 'Card Number' : 'CVV',
        iFieldstyle: this.renderInputStyle(type)
      }
    },
    renderInputStyle (type) {
      return {
        width: '90%',
        'max-width': '90%',
        border: 'none',
        color: '#363636',
        padding: '0',
        'font-size': '1rem',
        outline: '0',
        margin: type === 'exp' ? '0' : '3px 0 0'
      }
    },
    async proceed () {
      if (this.isValid) {
        this.isSubmitting = true
        await this.submitToken(this.CARD_TYPE)
        await this.submitToken(this.CVV_TYPE)
      }
    },
    async submitToken (type) {
      try {
        const ref = this.getRefFromType(type)
        await ref.getToken()
      } catch (error) {
        console.error(error)
      }
    },
    getRefFromType (type) {
      switch (type) {
        case CARD_TYPE:
          return this.$refs.cardIfield
        case CVV_TYPE:
          return this.$refs.cvvIfield
        default:
          throw Error('unknown type')
      }
    },
    handleTokenSuccess ({ data, type }) {
      if (type === 'card') {
        this.getLastFour(data.data.xToken)
      }
      this.cardData = { ...this.cardData, [type]: data.data.xToken }
    },
    handleTokenError ({ data }) {
      const errMsg = data.errorMessage
      this.isSubmitting = false
      this.snackbar = {
        open: true,
        message: errMsg || 'Sorry, something went wrong, please try again.'
      }
    },
    handleInputFocus ({ type }) {
      this.onFocus = type
    },
    getLastFour (token) {
      const splitToken = token.split(';')
      const cardNumber = splitToken[0]
      const lastFour = cardNumber.substring(cardNumber.length - 4)
      this.lastFour = lastFour
    }
  },
  components: {
    ifields
  },
  watch: {
    cardData: {
      handler () {
        if (this.cardData.card && this.cardData.cvv) {
          const card = {
            token: this.cardData.card,
            cvv: this.cardData.cvv,
            zipCode: this.cardInfo.zipCode,
            expiration: this.cardInfo.expirationDate,
            lastFour: this.lastFour
          }
          this.isSubmitting = false
          this.$store.commit('setCardInfo', card)
          this.$router.push('/review-appointment')
        }
      },
      deep: true
    }
  },
  computed: {
    isValid () {
      return !!this.cardInfo.expirationDate && !!this.cardInfo.zipCode
    }
  }
})
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
