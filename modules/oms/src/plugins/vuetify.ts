import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

const theme = {
    primary: '#3856F6',
    secondary: '#E91E63',
    accent: '#3856F6',
    info: '#00CAE3',
  }

export default new Vuetify({
    theme: {
        themes: {
          dark: theme,
          light: theme,
        },
      },
});
