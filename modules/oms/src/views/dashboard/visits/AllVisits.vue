<template>
  <visits />
</template>

<script>
export default {
  name: "all-visits-page",
  components: {
    Visits: () => import("./Visits.vue"),
  },
};
</script>

<style></style>
