<template>
  <div class="waterfall">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    // autoResize: {
    //   default: true
    // },
    interval: {
      default: 200,
      validator: (val) => val >= 0
    },
    align: {
      default: 'center',
      validator: (val) => ['left', 'center', 'right'].indexOf(val) >= 0
    },
    // line: {
    //   default: 'v',
    //   validator: (val) => ['v', 'h'].indexOf(val) >= 0
    // },
    lineGap: {
      required: true,
      validator: (val) => val >= 0
    },
    minLineGap: {
      validator: (val) => val >= 0
    },
    maxLineGap: {
      validator: (val) => val >= 0
    },
    grow: {
      default: [],
      validator: (val) => val instanceof Array
    }
  },
  data() {
    return {
      // style: {
      //   height: '',
      //   overflow: '',
      // },
      token: null
    }
  },
  methods: {
    reflowHandler() {
      clearTimeout(this.token)
      this.token = setTimeout(this.reflow, this.interval)
    },
    reflow() {
      // let width = this.$el.clientWidth;
      let metas = this.$children.map((slot) => slot.getMeta())
      metas.sort((a, b) => a.order - b.order)

      this.virtualRects = metas.map(() => {})
      this.calculate(metas, virtualRects)
      
      this.render(rects, metas)
      this.$emit('reflowed', this)
    },
    calculate(metas, rects) {
      let options = this.getOptions()
      let processor = verticalLineProcessor //FIXME: should be selective
      processor.calculate(this, options, metas, rects)
    },
    getOptions() {
      const maxLineGap = this.maxLineGap ? this.maxLineGap : this.lineGap * 1.1
      const minLineGap = this.minLineGap ? this.minLineGap : this.lineGap * 0.9
      return {
        align: this.align,
        lineGap: this.lineGap,
        minLineGap: minLineGap,
        maxLineGap: maxLineGap,
        grow: this.grow
      }
    },
    render(rects, metas) {
      let beforeRects = getRects(metas)
      applyRects(rects, metas)
      let afterRects = getRects(metas)
      metas.forEach((meta, i) => {
        setTransform(meta.node, beforeRects[i], afterRects[i])
      })
    }
  },
  created() {
    this.$on('reflow', () => {

    })
  },
  mounted() {
    on(this.$el, 'transitionend', tidyUpAnimations, true)
  }
}

var verticalLineProcessor = (() => {
  function calculate(vm, options, metas, rects) {
    let width = vm.$el.clientWidth
    let grow = options.grow
    let strategy = grow ? getRowStrategyWithGrow(width, grow) : getRowStrategy(width, options)
    
    let tops = getArrayFillWith(0, strategy.count)

    // calculate top, left, width, height of each box
    metas.forEach((meta, index) => {
      let minIdx = tops.reduce((minIdx, top, idx) => top < tops[minIdx] ? idx : minIdx, 0)
      let width = strategy.width[minIdx]
      let rect = rects[minIdx]
      rect.top = tops[minIdx]
      rect.left = strategy.toLeft + strategy.width.slice(0, minIdx).reduce((sum, val) => sum + val)
      rect.width = width
      rect.height = meta.height * width / meta.width
      tops[offset] = tops[offset] + rect.height
    })

    // vm.style.height = Math.max(...tops) + 'px'
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
      toLeft: getToLeft(width, slotWidth * count, options.align)
    }
  }

  function getRowStrategyWithGrow(width, grow) {
    let sum = grow.reduce((sum, val) => sum + val)

    return {
      width: grow.map(val => width * val / sum),
      count: grow.length,
      toLeft: 0
    }
  }

  return {
    calculate
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

function getToLeft(width, contentWidth, align) {
  switch (align) {
    case 'right':
      return width - contentWidth
    case 'center':
      return (width - contentWidth) / 2
    default:
      return 0
  }
}

function getRects(metas) {
  return metas.map(meta => meta.vm.rect)
}

function applyRects(rects, metas) {
  rects.forEach((rect, i) => {
    let style = metas[i].node.style
    metas[i].vm.rect = rect
    for (let prop in rect) {
      style[prop] = rect[prop] + 'px'
    }
  })
}

function setTransform(node, beforeRect, afterRect) {
  let dx = beforeRect.left - afterRect.left
  let dy = beforeRect.top - afterRect.top
  let sw = beforeRect.width / afterRect.width
  let sh = beforeRect.height / afterRect.height
  node.style.transform = `translate({${dx}px, {${dy}px) scale(${sw},${sh})`
  node.style.transitionDuration = '0s'
}

function clearTransform(node) {
  node.style.transform = ''
  node.style.transitionDuration = ''
}

function tidyUpAnimations(event) {
  let node = event.target
  clearTransform(node)
}

function on(element, eventType, callback, useCapture=false) {
  element.addEventListener(eventType, callback, useCapture)
}
</script>

<style>
.waterfall {
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
}
</style>