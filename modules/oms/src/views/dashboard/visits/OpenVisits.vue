<template>
  <visits page="open" />
</template>

<script>
export default {
  name: "open-visits-page",
  components: {
    Visits: () => import("./Visits.vue"),
  },
};
</script>

<style></style>
