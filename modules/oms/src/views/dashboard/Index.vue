<template>
  <v-app>
    <dashboard-core-app-bar v-model="expandOnHover" />
    <dashboard-core-drawer :expand-on-hover.sync="expandOnHover" />
    <dashboard-core-view />
  </v-app>
</template>

<script>
import Vue from "vue";
export default Vue.extend({
  name: "DashboardIndex",
  data() {
    return {
      expandOnHover: true,
    };
  },

  components: {
    DashboardCoreAppBar: () => import("./core/AppBar"),
    DashboardCoreDrawer: () => import("./core/Drawer"),
    // DashboardCoreSettings: () => import("./components/core/Settings"),
    DashboardCoreView: () => import("./core/View"),
  },
});
</script>

<style></style>
