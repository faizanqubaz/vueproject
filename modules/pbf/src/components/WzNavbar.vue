<template>
  <div class="top-0 left-0 right-0 z-50">
    <div class="bg-white">
      <div
        class="container mx-auto px-4 md:px-0"
        :class="
          padding
            ? 'py-3 transition-all duration-500 ease-in-out'
            : 'py-6 transition-all duration-500 ease-in-out'
        "
      >
        <div class="flex items-center justify-between lg:gap-16">
          <a href="/" class="">
            <img src="@/assets/welz_logo.png" class="h-10" alt="" />
          </a>
          <div
            class="flex-1 gap-7 items-center text-sm text-black hidden lg:flex"
          >
            <a href="https://welz.com#home" class="hover:text-primary">
              HOME
            </a>
            <a href="https://welz.com#services" class="hover:text-primary">
              SERVICES
            </a>
            <a href="https://welz.com#how-it-works" class="hover:text-primary">
              HOW IT WORKS
            </a>
            <a href="https://welz.com#about" class="hover:text-primary">
              ABOUT
            </a>

            <a href="https://welz.com#locations" class="hover:text-primary">
              LOCATIONS</a
            >

            <a href="https://welz.com#faq" class="hover:text-primary"> FAQ</a>
          </div>
          <div class="hidden lg:flex gap-16 items-center">
            <div class="text-sm uppercase">
              Need help? call us: 1-646-556-8500
            </div>
            <a
              href="https://book.welz.com/#/appointment"
              target="_blank"
              class="text-white py-4 px-9 px bg-black border border-gray-50 rounded-full"
            >
              Book Now
            </a>
          </div>
          <div class="flex items-center lg:hidden">
            <a
              href="https://book.welz.com/#/appointment"
              target="_blank"
              class="text-white py-3 md:py-4 px-6 md:px-9 px bg-black border border-gray-50 rounded-full mr-5"
            >
              Book Now
            </a>
            <div class="" @click="nav = true">
              <div class="w-9 mb-2 h-0.5 bg-black rounded-lg"></div>
              <div class="w-9 h-0.5 bg-black rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="fixed inset-0 bg-white py-6 px-4 z-30"
      :class="
        nav
          ? 'visible transition-opacity opacity-100 duration-500'
          : 'invisible delay-500 transition-opacity opacity-0 duration-500'
      "
    >
      <div class="h-9"></div>
      <div class="flex items-center justify-between mb-16">
        <a href="/" class="">
          <img src="@/assets/welz_logo.png" class="h-10" alt="" />
        </a>

        <div class="flex items-center lg:hidden">
          <a
            href="https://book.welz.com/#/appointment"
            target="_blank"
            class="text-white py-3 md:py-4 px-6 md:px-9 px bg-black border border-gray-50 rounded-full mr-4"
          >
            Book Now
          </a>
          <div @click="nav = false">
            <wz-icon name="close" class="h-10 w-10 fill-black" alt="" />
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-4 mx-12 mb-12">
        <a
          href="https://welz.com/#home"
          @click="nav = false"
          class="font-medium text-3xl mb-6"
          >Home</a
        >
        <a
          href="https://welz.com/#services"
          @click="nav = false"
          class="font-medium text-3xl mb-6"
          >Services</a
        >
        <a
          href="https://welz.com/#how-it-works"
          @click="nav = false"
          class="font-medium text-3xl mb-6"
          >How It Works</a
        >
        <a
          href="https://welz.com/#about"
          @click="nav = false"
          class="font-medium text-3xl mb-6"
          >About</a
        >
        <a
          href="https://welz.com/#locations"
          @click="nav = false"
          class="font-medium text-3xl mb-6"
          >Locations</a
        >
        <a
          href="https://welz.com/#faq"
          @click="nav = false"
          class="font-medium text-3xl mb-6"
          >FAQ</a
        >
      </div>
      <div class="text-sm uppercase mx-12">
        Need help? call us: 1-646-556-8500
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nav: false,
      padding: false,
    };
  },
  beforeMount() {
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      if (window.scrollY >= 270) {
        this.padding = true;
      } else {
        this.padding = false;
      }
    },
  },
};
</script>
