import Vue from "vue";
import VueMeta from "vue-meta";
import VCalendar from "v-calendar";
import { upperFirst, camelCase } from "lodash";
import * as VueGoogleMaps from "vue2-google-maps";

import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@/assets/main.css";

const requireComponent = require.context(
  // The relative path of the components folder
  "@/components",
  // Whether or not to look in subfolders
  true,
  // The regular expression used to match base component filenames
  /[A-Z]\w+\.(vue|js)$/
);

requireComponent.keys().forEach((fileName) => {
  // Get component config
  const componentConfig = requireComponent(fileName);

  // Get PascalCase name of component
  const componentName = upperFirst(
    camelCase(
      // Strip the leading `./` and extension from the filename
      fileName.replace(/^\.\/(.*)\.\w+$/, "$1")
    )
  );
  Vue.component(
    componentName,
    // Look for the component options on `.default`, which will
    // exist if the component was exported with `export default`,
    // otherwise fall back to module's root.
    componentConfig.default || componentConfig
  );
});

Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.VUE_APP_WELZ_BOOKING_GOOGLE_AUTH_KEY,
    libraries: "places",
  },
  installComponents: true,
});

Vue.use(VueMeta, {
  refreshOnceOnNavigation: true,
});

Vue.use(VCalendar, {
  componentPrefix: "vc",
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
