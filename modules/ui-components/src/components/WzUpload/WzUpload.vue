<template>
  <div
    class="rounded border border-stroke h-48.5 flex items-center justify-center cursor-pointer"
    @click="chooseImage()"
  >
    <input
      type="file"
      class="hidden"
      :id="id"
      @change="handleImage"
      accept="image/*"
    />
    <div class="flex flex-col p-4 items-center justify-center" v-if="!preview">
      <wz-icon name="image" class="mb-5" />
      <slot></slot>
    </div>
    <div
      class="w-full h-full bg-cover bg-center bg-no-repeat rounded relative"
      :style="'background-image: url(' + preview + ');'"
      v-else
    >
      <div class="absolute right-4 top-4">
        <div
          class="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer"
          @click.stop=";(preview = null), (img = null)"
        >
          <wz-icon name="close" color="red" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      img: null,
      preview: null,
      id: Math.random().toString(36).slice(2)
    }
  },
  watch: {
    img() {
      this.$emit('input', this.img)
    }
  },
  methods: {
    chooseImage() {
      document.getElementById(this.id).value = ''
      document.getElementById(this.id).click()
    },

    handleImage(e) {
      if (e.target.files[0]) {
        this.img = e.target.files[0]
        this.createBase64(this.img)
      } else {
        return
      }
    },

    createBase64(file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        this.preview = e.target.result
      }

      reader.readAsDataURL(file)
    }
  }
}
</script>

<style></style>
