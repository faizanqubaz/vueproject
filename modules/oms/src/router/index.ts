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
        name: "Cities",
        path: "resources/cities",
        component: () => import("@/views/dashboard/resources/Cities.vue"),
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
