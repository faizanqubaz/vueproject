<template>
  <v-app>
    <dashboard-core-app-bar v-model="expandOnHover" />
    <dashboard-core-drawer :expand-on-hover.sync="expandOnHover" />
    <dashboard-core-view />
    <snackbar ref="snackbar" />
  </v-app>
</template>

<script>
import Vue from "vue";
import Snackbar from "@/components/Snackbar.vue";

export default Vue.extend({
  name: "DashboardIndex",
  data() {
    return {
      expandOnHover: true,
    };
  },
  mounted() {
    this.$root.snackbar = this.$refs.snackbar;
  },

  components: {
    DashboardCoreAppBar: () => import("./core/AppBar"),
    DashboardCoreDrawer: () => import("./core/Drawer"),
    // DashboardCoreSettings: () => import("./components/core/Settings"),
    DashboardCoreView: () => import("./core/View"),
    Snackbar,
  },
});
</script>

<style></style>
