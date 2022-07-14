<template>
  <v-main
    id="pages"
    :class="$vuetify.theme.dark ? undefined : 'grey lighten-3'"
  >
    <router-view />
    <loader v-if="loading" />
    <dashboard-core-footer />
  </v-main>
</template>

<script>
import Vue from "vue";
import Loader from "../../../components/Loader.vue";

export default Vue.extend({
  name: "DashboardCoreView",
  components: {
    DashboardCoreFooter: () => import("./Footer"),
    Loader,
  },
  computed: {
    loading() {
      return this.$store.state.loading;
    },
  },
});
</script>
