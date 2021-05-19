<template>
  <div>
    <waterfall
      :align="center"
      :line-gap="200"
      :min-line-gap="100"
      :max-line-gap="220"
    >
    </waterfall>
  </div>
</template>

<script>
import Waterfall from '@/base/Waterfall'
import WaterfallSlot from '@/base/WaterfallSlot'
import ItemFactory from '@/utils'

export default {
  components: {
    Waterfall,
    WaterfallSlot,
  }
}
</script>

<style lang="less" scoped>

</style>