import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

const theme = {
  primary: "#3856F6",
  secondary: "#2D3748",
  accent: "#3856F6",
  info: "#00CAE3",
  error: "#FF0000",
};

export default new Vuetify({
  theme: {
    themes: {
      dark: theme,
      light: theme,
    },
  },
});
