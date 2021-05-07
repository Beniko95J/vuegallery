<template>
  <div class="base-button">
    <router-link :to="to" class="router-link">
      <div class="flex-layout">
        <div class="flex-item">
          <span>
            {{ buttonName }}
          </span>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  props: {
    to: {
      type: String
    },
    buttonName: {
      type: String
    }
  }
}
</script>

<style lang="less" scoped>
.base-button {
  height: 48px;
  min-width: 60px;
  border-radius: 24px;
  box-sizing: border-box;
  .router-link {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 24px;
    cursor: pointer;
    color: #333;
    .flex-layout {
      width: 100%;
      height: 100%;
      border-radius: 24px;
      background-color: #111;
      box-sizing: border-box;
      padding-left: 16px;
      padding-right: 16px;
      .flex-item {
        display: flex;
        width: 100%;
        height: 100%;
        justify-content: center;
        align-items: center;
        flex-direction: row;
        span {
          font-size: 16px;
          text-align: center;
          font-weight: 700;
          font-family: "Segoe UI", "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, "ヒラギノ角ゴ Pro W3", "Hiragino Kaku Gothic Pro", "ＭＳ Ｐゴシック", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        }
      }
    }
  }
}
</style>