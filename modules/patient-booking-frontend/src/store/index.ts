import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const Appointment = {
  state: () => ({
    location: {
      address: '',
      street: '',
      apartment: '',
      city: '',
      state: '',
      zipCode: '',
      longitude: '',
      latitude: '',
      cityId: 0,
      timeZone: ''
    },
    service: {
      groupId: 0,
      type: {
        id: 0,
        name: '',
        description: '',
        price: 0.0,
        image: '',
        notes: ''
      }
    },
    payment: {
      insurance: false,
      card: false
    },
    insuranceInfo: {
      front: '',
      back: ''
    },
    cardInfo: {
      lastFour: '',
      token: '',
      cvv: '',
      expiration: '',
      zipCode: ''
    },
    notes: '',
    dateAndTime: {
      startTime: '',
      endTime: '',
      date: '',
      id: 0
    }
  }),
  mutations: {
    setLocation (state: any, location: any) {
      state.location = location
    },
    setPayment (state: any, payment: any) {
      state.payment = payment
    },
    setGroupId (state: any, id: number) {
      state.service.groupId = id
    },
    setService (state: any, service: any) {
      state.service.type = service
    },
    clearService (state: any) {
      state.service.type = {
        id: 0,
        name: '',
        description: '',
        price: 0,
        image: '',
        notes: ''
      }
    },
    setServiceNotes (state: any, notes: string) {
      state.service.type.notes = notes
    },
    setNotes (state: any, notes:string) {
      state.notes = notes
    },
    setDateAndTime (state: any, dt:any) {
      state.dateAndTime = dt
    },
    setInsuranceInfo (state: any, insurance: string) {
      state.insuranceInfo = insurance
    },
    setCardInfo (state: any, card: any) {
      state.cardInfo = card
    }
  },

  getters: {
    location (state: any) {
      return state.location
    },
    locationAddress (state: any) {
      return state.location.address
    },
    locationStreet (state: any) {
      return state.location.street
    },
    locationApartment (state: any) {
      return state.location.apartment
    },
    locationCity (state: any) {
      return state.location.city
    },
    locationState (state: any) {
      return state.location.state
    },
    locationZipCode (state: any) {
      return state.location.zipCode
    },
    locationLongitude (state: any) {
      return state.location.longitude
    },
    locationLatitude (state: any) {
      return state.location.latitude
    },
    locationCityId (state: any) {
      return state.location.cityId
    },
    locationTimeZone (state: any) {
      return state.location.timeZone
    },
    payment (state: any) {
      return state.payment
    },
    groupId (state: any) {
      return state.service.groupId
    },
    serviceId (state: any) {
      return state.service.type.id
    },
    serviceName (state: any) {
      return state.service.type.name
    },
    servicePrice (state: any) {
      return state.service.type.price
    },
    serviceNotes (state: any) {
      return state.service.type.notes
    },
    notes (state: any) {
      return state.notes
    },
    insurance (state: any) {
      return state.payment.insurance
    },
    date (state: any) {
      return state.dateAndTime.date
    },
    time (state: any) {
      return {
        id: state.dateAndTime.id,
        startTime: state.dateAndTime.startTime,
        endTime: state.dateAndTime.endTime
      }
    },
    startTime (state: any) {
      return state.dateAndTime.startTime
    },
    endTime (state: any) {
      return state.dateAndTime.endTime
    },
    dateAndTime (state: any) {
      return state.dateAndTime
    },
    insuranceInfo (state: any) {
      return state.insuranceInfo
    },
    cardInfo (state: any) {
      return state.cardInfo
    }
  }
}

const Patient = {
  state: () => ({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    gender: '',
    dob: null,
    email: ''
  }),
  mutations: {
    setFirstName (state: any, firstName: string) {
      state.firstName = firstName
    },
    setLastName (state: any, lastName: string) {
      state.lastName = lastName
    },
    setPhoneNumber (state: any, phoneNumber: string) {
      state.phoneNumber = phoneNumber
    },
    setGender (state: any, gender: string) {
      state.gender = gender
    },
    setDob (state: any, dob: string) {
      state.dob = dob
    },
    setEmail (state: any, email: string) {
      state.email = email
    }
  },

  getters: {
    firstName (state: any) {
      return state.firstName
    },
    lastName (state: any) {
      return state.lastName
    },
    phoneNumber (state: any) {
      return state.phoneNumber
    },
    gender (state: any) {
      return state.gender
    },
    dob (state: any) {
      return state.dob
    },
    email (state: any) {
      return state.email
    }
  }
}

const store = new Vuex.Store({
  modules: {
    Appointment,
    Patient
  },
  state: {
    isLoggedIn: false,
    serviceList: [],
    timeSlots: []
  },
  mutations: {
    login (state: any) {
      state.isLoggedIn = true
    },
    logout (state: any) {
      state.isLoggedIn = false
    },
    setServiceList (state: any, serviceList: any) {
      state.serviceList = serviceList
    },
    setTimeSlots (state: any, timeSlots: any) {
      state.timeSlots = timeSlots
    }
  },
  getters: {
    isAuthenticated (state: any) {
      return state.isLoggedIn
    },
    serviceList (state: any) {
      return state.serviceList
    },
    timeSlots (state: any) {
      return state.timeSlots
    }
  }
})

export default store
