<template>
  <div id="app">
    <router-view />

    <div
      class="fixed inset-0 bg-black bg-opacity-50"
      v-show="$store.state.isLoading"
    >
      <div class="flex flex-col w-full h-full items-center justify-center">
        <wz-loader color="white" size="12" class="mb-4" />
        <div class="text-white text-lg">Loading...</div>
      </div>
    </div>
  </div>
</template>
