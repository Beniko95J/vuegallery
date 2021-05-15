<template>
  <div class="waterfall">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {

  },
  date() {
    return {

    }
  },
  methods: {
    reflow() {
      let width = this.$el.clientWidth;
      let metas = this.$children.map((slot) => slot.getMeta())
      metas.sort((a, b) => a.order - b.order)
    },
    getOptions() {
      return {

      }
    }
  },
  created() {
    this.$on('reflow', () => {

    })
  },
  mounted() {

  }
}

var verticalLineProcessor = (() => {
  function calculate(vm, options, metas, rects) {
    let width = vm.$el.clientWidth
    let grow = options.grow
    let strategy = grow ? getRowStrategyWithGrow(width, grow) : getRowStrategy(width, options)
    
  }

  function getRowStrategy(width, options) {
    let count, slotWidth
    if (options.minLineGap >= width) {
      count = 1
      slotWidth = width
    } else {
      count = width / options.lineGap
      let maxContentWidth = options.maxLineGap * ~~count
      let minContentWidth = options.minLineGap * ~~(count + 1)
      let maxCanFit = maxContentWidth >= width
      let minCanFit = minContentWidth <= width

      if (maxCanFit && minCanFit) {
        count = Math.round(count)
        slotWidth = width / count
      } else if (maxCanFit) {
        count = ~~count
        slotWidth = width / count
      } else if (minCanFit) {
        count = ~~(count + 1)
        slotWidth = width / count
      } else {
        count = ~~count
        slotWidth = options.maxLineGap
      }
      if (count === 1) {
        slotWidth = Math.max(slotWidth, width)
      }
    }

    return {
      width: getArrayFillWith(slotWidth, count),
      count: count,
      remain: getRemain(width, slotWidth * count, options.align)
    }
  }

  function getRowStrategyWithGrow(width, grow) {
    let sum = grow.reduce((sum, val) => sum + val)

    return {
      width: grow.map(val => width * val / sum),
      count: grow.length,
      remain: 0
    }
  }
})()

function getArrayFillWith(item, count) {
  let getter = (typeof item === 'function') ? () => item() : () => item
  let arr = []
  for (let i = 0; i < count; i++) {
    arr[i] = getter()
  }

  return arr
}

function getRemain(width, contentWidth, align) {
  switch (align) {
    case 'right':
      return width - contentWidth
    case 'center':
      return (width - contentWidth) / 2
    default:
      return 0
  }
}
</script>

<style>
.waterfall {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>