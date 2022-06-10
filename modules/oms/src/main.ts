import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { Auth0Plugin } from "./auth";
import VueMeta from 'vue-meta'

Vue.use(VueMeta, {
  refreshOnceOnNavigation: true
})

Vue.use(Auth0Plugin, {
  domain: process.env.VUE_APP_WELZ_AUTH0_DOMAIN,
  clientId: process.env.VUE_APP_WELZ_OMS_AUTH0_CLIENT_ID,
  audience: process.env.VUE_APP_WELZ_OMS_AUTH0_AUDIENCE,
  onRedirectCallback: (appState: { targetUrl: string }) => {
    router.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname
    );
  },
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
