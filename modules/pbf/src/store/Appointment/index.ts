const Appointment = {
  state: () => ({
    location: {
      address: "",
      street: "",
      apartment: "",
      city: "",
      state: "",
      zipCode: "",
      longitude: "",
      latitude: "",
      cityId: 0,
      timeZone: "",
    },
    dateTime: {
      startTime: "",
      endTime: "",
      date: "",
      id: 0,
    },
    payment: {
      insurance: false,
      card: false,
    },
    insurance: {},
    card: {},
    patient: {
      firstName: null,
      lastName: null,
      phone: null,
      email: null,
      dob: null,
      gender: null,
    },
  }),
  mutations: {
    SET_LOCATION(state: any, location: any) {
      state.location = location;
    },
    SET_DATETIME(state: any, dateTime: any) {
      state.dateTime = dateTime;
    },
    SET_PAYMENT(state: any, payment: any) {
      state.payment = payment;
    },
    SET_INSURANCE(state: any, insurance: any) {
      state.insurance = insurance;
    },
    SET_CARD(state: any, card: any) {
      state.card = card;
    },
    SET_PATIENT_FIRSTNAME(state: any, firstName: any) {
      state.patient.firstName = firstName;
    },
    SET_PATIENT_LASTNAME(state: any, lastName: any) {
      state.patient.lastName = lastName;
    },
    SET_PATIENT_PHONE(state: any, phone: any) {
      state.patient.phone = phone;
    },
    SET_PATIENT_EMAIL(state: any, email: any) {
      state.patient.email = email;
    },
    SET_PATIENT_DOB(state: any, dob: any) {
      state.patient.dob = dob;
    },
    SET_PATIENT_GENDER(state: any, gender: any) {
      state.patient.gender = gender;
    },
  },
  getters: {},
};

export default Appointment;
