import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

import store from "@/store";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/Home.vue"),
    children: [
      {
        path: "/confirmation",
        name: "Confirmation",
        component: () => import("@/views/confirmation/Confirmation.vue"),
      },
    ],
  },
  {
    path: "/booking/:id",
    name: "Booking",
    component: () => import("@/views/booking/Booking.vue"),
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  const toBooking = to.path.includes("booking");
  if (toBooking) {
    const validBookingId = [
      "location",
      "services",
      "symptoms",
      "notes",
      "timeslot",
      "patient-payment",
      "payment",
      "card",
      "insurance",
      "patient",
      "review",
    ];
    if (
      !to.params.id ||
      !validBookingId.includes(to.params.id) ||
      (to.params.id &&
        to.params.id !== "location" &&
        !store.state.Appointment.location.address)
    ) {
      next("/booking/location");
    }
    next();
  } else {
    next();
  }
});

export default router;
