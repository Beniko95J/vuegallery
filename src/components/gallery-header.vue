<template>
  <div class="gallery-list">
    <div class="gallery-list-head">
      <base-button to="/home" buttonName="Home" class="base-button"></base-button>
      <base-button to="/like" buttonName="Like" class="base-button"></base-button>
      <div class="search-outer">
        <div class="search-inner">
          <div class="search-layout">
              <input type="text" placeholder="Search" class="search-input">
          </div>
        </div>
      </div>
      <base-button to="/login" buttonName="Login" class="base-button"></base-button>
    </div>
    
    <div class="gallery-list-main">
      <gallery-list></gallery-list>
    </div>

    <div class="bg" :style="{backgroundImage: `url(${picUrl})`}"></div>
    <div class="mask"></div>
  </div>
</template>

<script>
import BaseButton from '@/base/BaseButton'
import GalleryList from '@/components/gallery-list'

export default {
  components: {
    BaseButton,
    GalleryList
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
  width: 100%;
  height: 100%;
  .gallery-list-head {
    display: flex;
    width: 100%;
    height: 68px;
    box-sizing: border-box;
    padding: 10px;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    .base-button {
      flex: 0 0 auto;
    }
    .search-outer {
      flex: 1 1 auto;
      width: 100%;
      height: 48px;
      min-width: 407px;
      box-sizing: border-box;
      padding-left: 8px;
      padding-right: 8px;
      .search-inner {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 48px;
        border-radius: 24px;
        background-color: #efefef;
        .search-layout {
          position: relative;
          flex: 1 1 auto;
          display: flex;
          align-items: center;
          flex-direction: row;
          width: 100%;
          height: 48px;
          box-sizing: border-box;
          padding: 0px 0px 0px 16px;
          .search-input {
            flex: 1 1 auto;
            width: 100%;
            height: 100%;
            background-color: transparent;
            border: none;
            color: #333;
            font-family: "Segoe UI", "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, "ヒラギノ角ゴ Pro W3", "Hiragino Kaku Gothic Pro", "ＭＳ Ｐゴシック", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
            font-size: 16px;
            font-weight: normal;
            outline: none;
            line-height: normal;
            vertical-align: middle;
            cursor: text;
          }
        }
      }
    }
  }

  .gallery-list-main {
    padding: 0px 25px 25px 25px;
    width: 100%;
    max-width: 1750px;
    margin: 0 auto;
    height: 100%;
    box-sizing: border-box;
    overflow-y: scroll;
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