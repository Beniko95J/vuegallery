<template>
  <div>
    <waterfall
      align="center"
      :line-gap="200"
      :min-line-gap="100"
      :max-line-gap="220"
      :watch="items"
      @reflowed="reflowed"
    >
      <waterfall-slot
        v-for="(item, index) in items"
        :width="item.width"
        :height="item.height"
        :order="index"
        move-class="item-move"
        :key="item.index"
      >
        <div class="item" :style="item.style" :index="item.index"></div>
      </waterfall-slot>
    </waterfall>
  </div>
</template>

<script>
import Waterfall from '@/base/Waterfall'
import WaterfallSlot from '@/base/WaterfallSlot'
import { ItemFactory } from '@/utils'

export default {
  components: {
    Waterfall,
    WaterfallSlot
  },
  data() {
    return {
      items: ItemFactory.get(1000),
      isBusy: false
    }
  },
  methods: {
    reflowed: function() {
      this.isBusy = false
    }
  }
}
</script>

<style lang="less" scoped>
.item {
  position: absolute;
  top: 5px;
  left: 5px;
  right: 5px;
  bottom: 5px;
  font-size: 1.2em;
  color: rgb(0, 158, 107);
  &:after {
    content: attr(index);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.item-move {
  transition: all .5s cubic-bezier(.55,0,.1,1);
  -webkit-transition: all .5s cubic-bezier(.55,0,.1,1);
}
</style>