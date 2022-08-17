<template>
  <div>
    <div class="container" @click="chooseImage()">
      <input
        type="file"
        class="hidden"
        :id="id"
        @change="handleImage"
        accept="image/*"
      />
      <div class="uploader-empty" v-if="!img">
        <h4>Add Image</h4>
      </div>
      <div
        class="uploader-filled"
        :style="'background-image: url(' + img + ');'"
        v-else
      >
        <div class="del-img-wrapper">
          <v-icon
            class="del-img-btn"
            @click.stop="(img = null), (errorMessage = '')"
            >mdi-close</v-icon
          >
        </div>
      </div>
    </div>
    <div class="error-msg" v-show="errorMessage">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
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
    value: {
      handler(val) {
        this.img = val;
      },
      immediate: true,
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

<style scoped>
.container {
  margin: 18px 0;
  border-radius: 0.5rem;
  height: 14rem;
  background-color: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.hidden {
  display: none;
}
.uploader-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 1rem;
}
.uploader-filled {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 0.5rem;
  height: 14rem;
  width: 100%;
  cursor: pointer;
  position: relative;
}
.del-img-wrapper {
  position: absolute;
  right: 4px;
  top: 4px;
}
.del-img-btn {
  color: red;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #fff;
  border: 1px solid #000;
  cursor: pointer;
}
.error-msg {
  color: #f00;
  font-size: 0.8rem;
  margin-top: 0.5rem;
}
</style>
