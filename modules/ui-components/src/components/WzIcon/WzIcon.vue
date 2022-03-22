<template>
  <component :is="`wzi-${name}`" :id="id" />
</template>
<script>

export default {
  props: {
    name: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      el: null,
      id: null
    }
  },
  mounted() {
    this.getElement()
  },

  watch: {
    color() {
      this.changeColor()
    },
    name() {
      this.getElement()
    }
  },
  methods: {
    async changeColor() {
      let path = this.el.getElementsByTagName('path')

      let newClass
      for (let i = 0; i < path.length; i++) {
        path[i].removeAttribute('class')
        let attrStroke = path[i].getAttribute('stroke')

        path[i].setAttribute('class', '')

        if (path[i].classList.length === 2) {
          path[i].classList.remove(path[i].classList[1])
        }
        if (attrStroke) {
          newClass = ['stroke-current', 'text-' + this.color]
        } else {
          newClass = ['fill-current', 'text-' + this.color]
        }

        path[i].classList.add(...newClass)
      }
    },
    async getElement() {
      this.id = Math.random().toString(36).slice(2)
      this.el = null
      while (!this.el)
        await new Promise((resolve) => {
          this.el = document.getElementById(this.id)
          setTimeout(resolve, 100)
        })

      this.changeColor()
    }
  }
}
</script>
