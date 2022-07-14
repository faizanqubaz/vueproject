<template>
  <v-overlay absolute :opacity="0.5" :value="true">
    <div class="d-flex flex-column text-center">
      <v-progress-circular indeterminate size="64"> </v-progress-circular>
      <span class="mt-4">Loading</span>
    </div>
  </v-overlay>
</template>

<script>
export default {};
</script>

<style></style>
