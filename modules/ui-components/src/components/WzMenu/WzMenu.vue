<template>
  <div class="relative inline-block" tabindex="0" @blur="blur"  id="menuContainer">
    <slot name="activator" :on="on" >
    </slot>
    <div class="absolute z-30 " :class="offsetX ? 'right-0' : 'left-0'" v-show="value" :style="'top:' + parentHeight + 'px;'">
      <div class="whitespace-nowrap shadow-xl" @click="blur()">
          <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    offsetX:{
      type: Boolean,
      default: false
    },
  },
  data () {
    return{
      parentHeight: null,
      parentWidth: null,
      value:false,
    }
  },
  computed: {
    on () {
      let wz = this
      return {
        click () {
          wz.value = !wz.value
          if (wz.value) { document.getElementById("menuContainer").focus() }
        },
      }
    }
  },
  mounted () {
    this.parentHeight = 8 + document.getElementById("menuContainer").offsetHeight
    this.parentWidth = 8 + document.getElementById("menuContainer").offsetWidth
  },
  methods: {
   blur() {
    this.value = false
   }
  }

}
</script>

<style></style>
