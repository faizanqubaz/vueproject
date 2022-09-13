<template>
  <div>
    <div class="h-8 bg-primary" />
    <wz-navbar />
    <router-view />

    <wz-snackbars
      v-model="snackbarOpen"
      :type="$store.state.snackbar.type"
      :timeout="$store.state.snackbar.timeout"
      multiline
    >
      <template>
        <div class="w-80 pl-4 text-white">
          {{ $store.state.snackbar.message }}
        </div>
      </template>
      <template #action>
        <button @click="snackbarOpen = false" class="text-white mr-4">
          Close
        </button>
      </template>
    </wz-snackbars>
  </div>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  computed: {
    snackbarOpen: {
      get() {
        return this.$store.state.snackbar.open;
      },
      set(val) {
        this.$store.commit("SET_SNACKBAR_OPEN", val);
      },
    },
  },
});
</script>
