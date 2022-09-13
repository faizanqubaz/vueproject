<template>
  <div
    class="container mx-auto rounded-lg drop-shadow py-12 px-4 md:px-16 bg-white"
  >
    <div class="text-center">
      <p class="font-medium text-sm mb-4">{{ topTitle }}</p>
      <p class="font-semibold text-3xl">{{ title }}</p>
      <p class="text-sm my-4">{{ desc }}</p>
    </div>
    <slot />
    <div
      v-show="!confirmation"
      :class="prev ? 'text-center md:flex md:justify-between' : 'text-center'"
    >
      <button class="text-content m-2" v-show="prev" @click="$emit('to-prev')">
        <span class="flex items-center">
          <span
            class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-2 border-2 border-gray-300"
          >
            <wz-icon name="chevron-left" class="mb-2 w-2 h-2 fill-black" />
          </span>
          Back to Previous Page
        </span>
      </button>
      <button
        :disabled="!nextValid"
        :class="nextValid ? 'opacity-100' : 'opacity-60'"
        class="bg-secondary text-white py-3 px-8 rounded-full m-2"
        v-show="next"
        @click="$emit('to-next')"
      >
        <span class="flex items-center text-white">
          Continue
          <wz-icon name="chevron-right" class="mb-1 ml-3 w-2 h-2 fill-white" />
        </span>
      </button>
    </div>
    <div v-show="confirmation" class="text-center">
      <button
        :disabled="!nextValid"
        :class="nextValid ? 'opacity-100' : 'opacity-60'"
        class="bg-secondary text-white py-3 px-8 rounded-full"
        v-show="next"
        @click="$emit('to-next')"
      >
        <span class="flex items-center text-white"> Confirm Appointment </span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    topTitle: {
      type: String,
    },
    title: {
      type: String,
    },
    desc: {
      type: String,
    },
    next: {
      type: Boolean,
      default: false,
    },
    nextValid: {
      type: Boolean,
      default: false,
    },
    prev: {
      type: Boolean,
      default: false,
    },
    confirmation: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
