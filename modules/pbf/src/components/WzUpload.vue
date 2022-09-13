<template>
  <div>
    <label class="font-semibold mb-4">{{ label }}</label>
    <div
      class="rounded border h-48.5 flex items-center justify-center cursor-pointer"
      :class="[errorMessage ? 'border-red' : 'border-stroke']"
      @click="chooseImage()"
    >
      <input
        type="file"
        class="hidden"
        :id="id"
        @change="handleImage"
        accept="image/*"
      />
      <div class="flex flex-col p-4 items-center justify-center" v-if="!img">
        <wz-icon name="image" class="mb-5" />
        <slot></slot>
      </div>
      <div
        class="w-full h-full bg-cover bg-center bg-no-repeat rounded relative"
        :style="'background-image: url(' + img + ');'"
        v-else
      >
        <div class="absolute right-2 top-2">
          <div
            class="w-6 h-6 flex items-center justify-center rounded-full cursor-pointer"
            @click.stop="(img = null), (errorMessage = '')"
          >
            <wz-icon name="close" class="fill-danger w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
    <div class="text-sm text-danger" v-show="errorMessage">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      img: null,
      id: Math.random().toString(36).slice(2),
      errorMessage: "",
    };
  },
  watch: {
    img() {
      this.$emit("input", this.img);
    },
  },
  methods: {
    chooseImage() {
      document.getElementById(this.id).value = "";
      document.getElementById(this.id).click();
    },

    handleImage(e) {
      this.errorMessage = "";

      const file = e.target.files[0];
      if (file) {
        this.createBase64(file);
      } else {
        return;
      }
    },

    createBase64(file) {
      this.img = null;

      const reader = new FileReader();
      reader.readAsDataURL(file);

      const maxSize = 10000000; // 10 MB
      if (file.size > maxSize) {
        this.errorMessage = "File cannot be larger than 10 MB";
      } else {
        reader.onload = (e) => {
          this.img = e.target.result;
        };
      }
    },
  },
};
</script>

<style></style>
