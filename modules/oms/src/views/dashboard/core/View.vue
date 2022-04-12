<template>
  <v-main
    id="pages"
    :class="$vuetify.theme.dark ? undefined : 'grey lighten-3'"
  >
    <router-view />

    <dashboard-core-footer />
  </v-main>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  name: "DashboardCoreView",
  components: {
    DashboardCoreFooter: () => import("./Footer"),
  },
});
</script>
