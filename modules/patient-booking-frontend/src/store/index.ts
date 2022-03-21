import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    location: {
      address: '',
      apartment: '',
      city: '',
      state: '',
      longitude: '',
      latitude: '',
      zipCode: ''
    },
    services: [{}],
    payment: {
      insurance: false,
      outOfPocket: false
    },
    service: {
      id: '',
      name: '',
      description: '',
      image: '',
      icon: '',
      price: 0
    },
    appointment: {
      notes: '',
      startTime: '',
      endTime: '',
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
    insuranceInfo: {
      front: null,
      back: null
    },
    outOfPocketInfo: {
      cardNumber: '',
      expirationDate: '',
      cvc: '',
      email: '',
      password: ''
    }
  },
  mutations: {
    setInsurance (state, payload) {
      state.payment.insurance = payload.insurance
    }
  }
})

export default store
