<template>
  <wz-page
    top-title="Book your appoinment"
    title="Welz Services"
    desc="Explore and select the type of service you want"
    :next="true"
    :prev="true"
    @to-next="nextPage"
    @to-prev="prevPage"
    :nextValid="serviceChecker"
  >
    <div
      class="grid grid-cols-1 md:grid-cols-2 max-w-xl mx-auto items-center justify-center gap-6 pt-6 pb-10"
      v-if="serviceList && serviceList.length > 0"
    >
      <service
        v-for="(service, index) in serviceList"
        :key="`Service-${index}`"
        :serviceData="service"
      />
    </div>
  </wz-page>
</template>

<script>
import Vue from "vue";
import Service from "./components/Service.vue";

export default Vue.extend({
  components: {
    Service,
  },
  computed: {
    serviceChecker() {
      let valid = false;
      this.$store.state.Services.service &&
      this.$store.state.Services.service.id
        ? (valid = true)
        : (valid = false);
      return valid;
    },
    serviceList() {
      return this.$store.state.Services.serviceList;
    },
  },
  methods: {
    nextPage() {
      this.$router.push("/booking/symptoms");
    },
    prevPage() {
      this.$router.back();
    },
  },
});
</script>
