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
        class="pt-5 grid md:grid-cols-2 lg:grid-cols-2 sm:grid-cols-1 gap-x-5 gap-y-3"
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
          <label>CVC</label>
          <div
            class="flex items-center w-full border px-3 py-sm rounded cursor-text"
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
      </div>
      <div class="pt-8">
        <wz-button color="primary" block :disabled="isSubmitting" @click="proceed">
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
        cvc: ''
      },
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
    proceed () {
      this.handleSubmit()
    },
    renderIfieldOptions (type) {
      return {
        enableLogging: false,
        autoFormat: true,
        autoFormatSeparator: ' ',
        placeholder: type === 'card' ? 'Card Number' : 'CVC',
        iFieldstyle: this.renderInputStyle(type)
      }
    },
    renderInputStyle (type) {
      return {
        width: '100%',
        'max-width': '100%',
        border: 'none',
        color: '#363636',
        padding: '0',
        'font-size': '1rem',
        outline: '0',
        margin: type === 'exp' ? '0' : '3px 0 0'
      }
    },
    renderIfieldOptionsAlt (type) {
      return {
        enableLogging: false,
        autoFormat: true,
        autoFormatSeparator: ' ',
        placeholder: type === 'card' ? 'Card Number' : 'CVC',
        iFieldstyle: this.renderInputStyleAlt(type)
      }
    },
    renderInputStyleAlt (type) {
      return {
        width: '100%',
        'max-width': type === 'card' ? '95%' : '90%',
        color: '#363636',
        padding: type === 'exp' ? '12px 16px' : '14px 16px',
        border: 'solid 1px rgb(203, 213, 224)',
        'border-radius': '8px',
        'font-size': '1rem',
        'font-weight': '500',
        overflow: 'none'
      }
    },
    async handleSubmit () {
      this.isSubmitting = true
      await this.submit(this.CARD_TYPE)
      await this.submit(this.CVV_TYPE)
    },
    async submit (type) {
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
    }
  },
  components: {
    ifields
  },
  watch: {
    cardData: {
      handler () {
        if (this.cardData.card && this.cardData.cvv) {
          console.log({ cardData: this.cardData })
          this.isSubmitting = false
          this.$router.push('/review-appointment')
        }
      },
      deep: true
    }
  }
})
</script>

<style scoped>
iframe {
  height: 24px;
  width: 100%;
}

input {
  font-family: Arial, Helvetica, sans-serif;
}
</style>
