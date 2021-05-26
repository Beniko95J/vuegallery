<template>
  <div class="waterfall" :style="style">
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
      validator: (val) => val instanceof Array
    },
    watch: {
      default: () => ({})
    }
  },
  data() {
    return {
      style: {
        height: '',
        overflow: 'scroll',
      },
      token: null
    }
  },
  methods: {
    autoResizeHandler(autoResize) {
      if (autoResize === false) {
        off(window, 'resize', this.reflowHandler, false)
      } else {
        on(window, 'resize', this.reflowHandler, false)
      }
    },
    reflowHandler() {
      clearTimeout(this.token)
      this.token = setTimeout(this.reflow, this.interval)
    },
    reflow() {
      // let width = this.$el.clientWidth;
      let metas = this.$children.map((slot) => slot.getMeta())
      metas.sort((a, b) => a.order - b.order)

      this.virtualRects = metas.map(() => ({})) // () is important
      this.calculate(metas, this.virtualRects)
      
      this.style.overflow = 'hidden'
      this.render(this.virtualRects, metas)
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
        addClass(meta.node, meta.moveClass)
      })
    }
  },
  created() {
    this.virtualRects = []
    this.$on('reflow', () => {
      this.reflowHandler()
    })
    this.$watch(() => {
      this.align,
      this.lineGap,
      this.minLineGap,
      this.maxLineGap,
      this.grow,
      this.watch
    }, this.reflowHandler)
  },
  mounted() {
    on(this.$el, 'transitionend', tidyUpAnimations, true)
    this.autoResizeHandler(true)
  },
  beforeDestroy() {
    this.autoResizeHandler(false)
    off(this.$el, 'transitioned', tidyUpAnimations, true)
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
      let rect = rects[index]
      rect.top = tops[minIdx]
      rect.left = strategy.toLeft + (minIdx ? strategy.width.slice(0, minIdx).reduce((sum, val) => sum + val) : 0)
      rect.width = width
      rect.height = meta.height * width / meta.width
      tops[minIdx] = tops[minIdx] + rect.height
    })

    vm.style.height = Math.max(...tops) + 'px'
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
  // node.style.transitionDuration = '0.0s'
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

function off(element, eventType, callback, useCapture=false) {
  element.removeEventListener(eventType, callback, useCapture)
}

function addClass (elem, name) {
  if (!hasClass(elem, name)) {
    let cur = attr(elem, 'class').trim()
    let res = (cur + ' ' + name).trim()
    attr(elem, 'class', res)
  }
}

// function removeClass (elem, name) {
//   let reg = new RegExp('\\s*\\b' + name + '\\b\\s*', 'g')
//   let res = attr(elem, 'class').replace(reg, ' ').trim()
//   attr(elem, 'class', res)
// }

function hasClass (elem, name) {
  return (new RegExp('\\b' + name + '\\b')).test(attr(elem, 'class'))
}

function attr (elem, name, value) {
  if (typeof value !== 'undefined') {
    elem.setAttribute(name, value)
  } else {
    return elem.getAttribute(name) || ''
  }
}
</script>

<style>
.waterfall {
  position: relative;
}
</style>