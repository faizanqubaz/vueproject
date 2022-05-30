import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import { authGuard } from "@/auth/authGuard";

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
        beforeEnter: authGuard,
      },
      {
        name: "Open Visits",
        path: "visits/open",
        component: () => import("@/views/dashboard/visits/OpenVisits.vue"),
        beforeEnter: authGuard,
      },
      {
        name: "All Visits",
        path: "visits/all",
        component: () => import("@/views/dashboard/visits/AllVisits.vue"),
        beforeEnter: authGuard,
      },
      {
        name: "Visit Details",
        path: "visits/:id",
        component: () => import("@/views/dashboard/visits/VisitDetails.vue"),
        // beforeEnter: authGuard
      },
      {
        name: "Providers",
        path: "settings/providers",
        component: () =>
          import("@/views/dashboard/settings/providers/Providers.vue"),
        beforeEnter: authGuard,
      },
      {
        name: "Provider Details",
        path: "settings/providers/:providerId",
        component: () =>
          import("@/views/dashboard/settings/providers/ProviderDetails.vue"),
        props: true,
        beforeEnter: authGuard,
      },
      {
        name: "Cities",
        path: "settings/cities",
        component: () => import("@/views/dashboard/settings/Cities/Cities.vue"),
        beforeEnter: authGuard,
      },
      {
        name: "Add City",
        path: "settings/cities/add",
        component: () =>
          import("@/views/dashboard/settings/Cities/CityForm.vue"),
        beforeEnter: authGuard,
      },
      {
        name: "City Details",
        path: "settings/cities/:cityId",
        component: () =>
          import("@/views/dashboard/settings/Cities/CityForm.vue"),
        beforeEnter: authGuard,
      },
      {
        name: "Services",
        path: "settings/services",
        component: () => import("@/views/dashboard/settings/Services.vue"),
        beforeEnter: authGuard,
      },
      {
        name: "Service Groups",
        path: "settings/service-groups",
        component: () => import("@/views/dashboard/settings/ServiceGroups.vue"),
        beforeEnter: authGuard,
      },
      {
        name: "Service Zip Codes",
        path: "settings/service-zip-codes",
        component: () =>
          import("@/views/dashboard/settings/ServiceZipCodes.vue"),
        beforeEnter: authGuard,
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
