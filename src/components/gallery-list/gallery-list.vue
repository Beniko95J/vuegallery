<template>
  <div class="gallery-list">
    <div class="gallery-list-head">
      <base-button to="/home" buttonName="Home" class="base-button"></base-button>
      <div class="search-head">
        <input type="text" placeholder="Search" class="search-input">
      </div>
    </div>
    
    <div class="gallery-list-main">
    </div>

    <div class="bg" :style="{backgroundImage: `url(${picUrl})`}"></div>
    <div class="mask"></div>
  </div>
</template>

<script>
import BaseButton from '@/base/BaseButton'

export default {
  components: {
    BaseButton
  },
  data() {
    return {
      picUrl: require('@/assets/wallpaper/wp.jpg')
    }
  }
}
</script>

<style lang="less" scoped>
.gallery-list {
  .gallery-list-head {
    display: flex;
    width: 100%;
    height: 80px;
    box-sizing: border-box;
    padding: 10px;
    .base-button {
      
    }
    .search-head {
      display: flex;
      width: 100%;
      height: 40px;
      padding: 10px 15px;
      overflow: hidden;
      background: @search_bg_coloe;
      .search-input {
        flex: 1;
        height: 40px;
        box-sizing: border-box;
        padding: 0 15px;
        border: 1px solid @btn_color;
        outline: 0;
        background: transparent;
        color: @text_color_active;
        font-size: @font_size_medium;
        box-shadow: 0 0 1px 0 #fff inset;
        &::placeholder {
          color: @text_color
        }
      }
    }
  }

  .mask,
  .bg {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
  }

  .mask {
    z-index: -1;
    background-color: @mask_color;
  }

  .bg {
    z-index: -2;
    background-repeat: no-repeat;
    background-size: cover;
    filter: blur(5px);
    opacity: 0.7;
    transition: 1s;
  }
}
</style>