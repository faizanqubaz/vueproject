<template>
  <div id="app">
    <wz-navbar>
      <template #logo>
        <a href="#">
          <img src="@/assets/welz_logo.png" alt="logo" class="h-6" />
        </a>
      </template>
      <template #icon>
        <a href="tel:+16465568500">
          <wz-icon name="device"  />
        </a>
      </template>
    </wz-navbar>
    <router-view />
  </div>
</template>

<style lang="scss"></style>
