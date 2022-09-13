const Services = {
  state: () => ({
    service: {},
    serviceList: [],
    servicePackage: null,
    symptoms: [],
    serviceNotes: [],
    additionalNotes: null,
  }),
  mutations: {
    SET_SERVICE_LIST(state: any, serviceList: any) {
      state.serviceList = serviceList;
    },
    SET_SERVICE(state: any, service: any) {
      state.service = service;
    },
    SET_SERVICE_PACKAGE(state: any, servicePackage: any) {
      state.servicePackage = servicePackage;
    },
    SET_SYMPTOMS(state: any, symptoms: any) {
      state.symptoms = symptoms;
    },
    SET_SERVICE_NOTES(state: any, serviceNotes: any) {
      state.serviceNotes = serviceNotes;
    },
    SET_SERVICE_ADDITIONAL_NOTES(state: any, additionalNotes: any) {
      state.additionalNotes = additionalNotes;
    },
  },
  getters: {},
};

export default Services;
