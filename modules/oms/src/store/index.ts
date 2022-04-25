import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    barColor: "rgba(0, 0, 0, .8), rgba(0, 0, 0, .8)",
    drawer: true,
    updatePatientDialog: false,
  },
  mutations: {
    SET_DRAWER(state, payload) {
      state.drawer = payload;
    },
    SET_SCRIM(state, payload) {
      state.barColor = payload;
    },
    SET_UPDATE_PATIENT_DIALOG(state, payload) {
      state.updatePatientDialog = payload;
    },
  },
  actions: {},
  modules: {},
});
