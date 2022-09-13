/* eslint-disable @typescript-eslint/no-explicit-any */
import Vue from "vue";
import Vuex from "vuex";
import Appointment from "@/store/Appointment";
import Services from "@/store/Services";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    Appointment,
    Services,
  },
  state: {
    serviceList: [],
    isLoading: false,
    snackbar: {
      open: false,
      message: "Appointment Booked",
      timeout: 5000,
      type: "success",
    },
    createdAppointment: {},
  },
  getters: {},
  mutations: {
    SET_SERVICE_LIST(state: any, serviceList: any) {
      state.serviceList = serviceList;
    },
    SET_IS_LOADING(state: any, isLoading: boolean) {
      return (state.isLoading = isLoading);
    },
    SET_SNACKBAR_OPEN(state: any, open: boolean) {
      state.snackbar.open = open;
    },
    SET_SNACKBAR_MESSAGE(state: any, message: string) {
      state.snackbar.message = message;
    },
    SET_SNACKBAR_TIMEOUT(state: any, timeout: any) {
      state.snackbar.timeout = timeout;
    },
    SET_SNACKBAR_TYPE(state: any, type: string) {
      state.snackbar.type = type;
    },
    SET_CREATED_APPOINTMENT(state: any, createdAppointment: any) {
      state.createdAppointment = createdAppointment;
    },
  },
  actions: {},
});
