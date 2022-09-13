<template>
  <div
    class="rounded-md border bg-white w-full"
    :class="[
      service.id === serviceData.id && clickable
        ? 'border-primary'
        : 'border-borderColor',
      clickable ? 'hover:border-primary cursor-pointer' : 'border-borderColor',
    ]"
    @click="clickable ? changeService() : ''"
  >
    <img :src="serviceData.image" class="w-full h-48 object-cover" alt="" />
    <div class="p-4 -mt-12 z-10 relative">
      <div class="w-14 h-14 mb-2 flex items-center justify-center">
        <img :src="serviceData.icon" alt="" />
      </div>
      <div class="font-semibold text-lg mb-2">{{ serviceData.name }}</div>
      <!-- <p class="text-sm opacity-60">
        {{ description }}
      </p> -->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    serviceData: {
      type: Object,
      required: true,
    },
    clickable: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    service: {
      get() {
        return this.$store.state.Services.service;
      },
      set(val) {
        if (val.name === "COVID-19 Tests") {
          this.$store.commit("SET_SYMPTOMS", []);
        }
        this.$store.commit("SET_SERVICE", val);
      },
    },
  },
  methods: {
    changeService() {
      this.service = this.serviceData;
    },
  },
};
</script>

<style></style>
