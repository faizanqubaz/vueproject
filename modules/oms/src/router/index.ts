import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    component: () => import("@/views/dashboard/Index.vue"),
    children: [
      {
        name: "Dashboard",
        path: "",
        component: () => import("@/views/dashboard/Dashboard.vue"),
        // beforeEnter: authGuard
      },
      {
        name: "Visits",
        path: "visits",
        component: () => import("@/views/dashboard/visits/Visits.vue"),
        // beforeEnter: authGuard
      },
      {
        name: "Providers",
        path: "resources/providers",
        component: () => import("@/views/dashboard/resources/Providers.vue"),
        // beforeEnter: authGuard
      },
      {
        name: "Cities",
        path: "resources/cities",
        component: () =>
          import("@/views/dashboard/resources/Cities/Cities.vue"),
        // beforeEnter: authGuard
      },
      {
        name: "Add City",
        path: "resources/cities/add",
        component: () =>
          import("@/views/dashboard/resources/Cities/CityForm.vue"),
        // beforeEnter: authGuard
      },
      {
        name: "City Detail",
        path: "resources/cities/:cityId",
        component: () =>
          import("@/views/dashboard/resources/Cities/CityForm.vue"),
        // beforeEnter: authGuard
      },
      {
        name: "Services",
        path: "resources/services",
        component: () => import("@/views/dashboard/resources/Services.vue"),
        // beforeEnter: authGuard
      },
      {
        name: "Service Groups",
        path: "resources/service-groups",
        component: () =>
          import("@/views/dashboard/resources/ServiceGroups.vue"),
        // beforeEnter: authGuard
      },
      {
        name: "Service Zip Codes",
        path: "resources/service-zip-codes",
        component: () =>
          import("@/views/dashboard/resources/ServiceZipCodes.vue"),
        // beforeEnter: authGuard
      },
    ],
  },
  {
    path: "*",
    redirect: "/",
  },
];

const router = new VueRouter({
  routes,
});

export default router;
