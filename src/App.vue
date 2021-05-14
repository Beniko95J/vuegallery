<template>
  <div id="app">
    <!-- <transition
    appear 
    appear-class="custom-appear-class"
    appear-to-class="custom-appear-to-class"
    appear-active-class="custom-appear-active-class"> -->
    <router-view class="router-view" v-if="show"></router-view>
    <!-- </transition> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: true
    }
  }
}
</script>


<style lang="less">
#app {
  position: relative;
  width: 100%;
  height: 100%;

  .router_view {
    width: 100%;
    height: 100%;
  }
}
</style>
