import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    location: {
      address: '',
      apartment: ''
    },
    payment: {
      insurance: false,
      outOfPocket: false
    },
    appointment: {
      serviceId: '',
      notes: '',
      timeslot: '',
      date: ''
    },
    patient: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      gender: '',
      dob: '',
      email: '',
      consent: false
    },
    insurance: {
      front: null,
      back: null
    },
    paymentInfo: {
      cardNumber: '',
      expirationDate: '',
      cvc: '',
      email: '',
      password: ''
    }
  }
})
