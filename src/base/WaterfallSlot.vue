<template>
  <div class="waterfall-slot" v-show="isShow">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    width: {
      require: true,
      validator: (val) => val >= 0
    },
    height: {
      require: true,
      validator: (val) => val >= 0
    },
    order: {
      default: 0,
      validator: (val) => val >= 0
    }
  },
  data() {
    return {
      isShow: false,
    }
  },
  methods: {
    notify() {
      this.$parent.$emit('reflow', this)
    },
    getMeta() {
      return {
        vm: this,
        node: this.$el,
        order: this.order,
        width: this.width,
        height: this.height,
        // moveClass: this.moveClass,
      }
    }
  },
  created() {
    this.rect = {
      top: 0,
      left: 0,
      width: 0,
      height: 0,
    }
    this.$watch(() => {
      this.width,
      this.height
    }, this.notify)
  },
  mounted() {
    this.$parent.$once('reflowed', () => {
      this.isShow = true
    })
    this.notify()
  }
}
</script>

<style lang="less" scoped>
.waterfall-slot {
  position: absolute;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>