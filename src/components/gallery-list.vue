<template>
  <transition
  appear 
  appear-class="custom-appear-class"
  appear-to-class="custom-appear-to-class"
  appear-active-class="custom-appear-active-class">
  <div class="gallery-list-container" ref="galleryListContainer">
    <div 
    class="gallery-list-item"
    v-for="(img, index) in itemList"
    :key="index"
    :style="{top: img.top + 'px', left: img.left + 'px', width: itemWidth + 'px', height: img.height + 'px'}"
    >
      <img :src="img.src" alt="">
    </div>
  </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      imgList: [],
      itemList: [],
      heightList: [],
      itemCol: 3,
      itemRight: 10,
      itemBottom: 10,
      containerWidth: 0,
      lock: true,
    }
  },
  computed: {
    itemWidth: function() {
      return (this.containerWidth - this.itemCol * this.itemRight) / this.itemCol
    }
  },
  methods: {
    getImgs() {
      this.imgList = [
        "https://pic.rmb.bdstatic.com/932ca9934baf734b3160fc76bc761dcf.jpeg",
        "https://ss2.baidu.com/-vo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/b7003af33a87e9500080e13912385343faf2b4cb.jpg",
        "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2529255061,3898604095&fm=26&gp=0.jpg",
        "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3376008599,2577895433&fm=26&gp=0.jpg",
        "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2538164638,2454489739&fm=26&gp=0.jpg",
        "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=235101227,1662203838&fm=26&gp=0.jpg",
        "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3459144041,1901798922&fm=11&gp=0.jpg",
        "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3379363998,2377527589&fm=26&gp=0.jpg",
        "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=4123338137,2748046536&fm=11&gp=0.jpg",
        "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3116135450,3184020205&fm=11&gp=0.jpg",
        "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=4080806858,1854570161&fm=11&gp=0.jpg",
        "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1949459665,247597437&fm=11&gp=0.jpg",
        "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1433933789,3443668472&fm=26&gp=0.jpg",
        "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2499198753,3249918221&fm=26&gp=0.jpg",
        "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2659998876,1549965278&fm=15&gp=0.jpg",
        "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3459729031,3827366337&fm=26&gp=0.jpg",
        "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2635451446,3680267750&fm=26&gp=0.jpg",
        "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1133790732,3263952126&fm=26&gp=0.jpg",
        "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3375224907,3777918150&fm=26&gp=0.jpg",
        "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2372825572,3775270174&fm=26&gp=0.jpg",
      ]
    },
    imgPreloading() {
      this.initHeightList()
      for (let i = 0; i < this.imgList.length; i++) {
        if (!this.itemList[i]) {
          let img = new Image()
          img.src = this.imgList[i]
          img.onload = () => {
            let imgData = {};
            imgData.imgWidth = img.width
            imgData.imgHeight = img.height
            imgData.height = this.itemWidth / imgData.imgWidth * imgData.imgHeight
            imgData.src = this.imgList[i]
            this.itemList.push(imgData)
            this.reflow(imgData)
          }
        }
        else {
          this.itemList[i].height = this.itemWidth / this.itemList[i].imgWidth * this.itemList[i].imgHeight
          this.reflow(this.itemList[i])
        }
      }
    },
    initHeightList() {
      this.heightList = new Array(this.itemCol)
      for (let i = 0; i < this.itemCol; i++) {
        this.heightList[i] = 0
      }
    },
    reflow(imgData) {
      let minIndex = this.filterMin()
      imgData.top = this.heightList[minIndex]
      imgData.left = minIndex * (this.itemRight + this.itemWidth)
      this.heightList[minIndex] += imgData.height + this.itemBottom
    },
    filterMin() {
      let minHeight = Math.min(...this.heightList)
      return this.heightList.indexOf(minHeight)
    },
    wait(func, time=300) {
      if(this.lock) {
        this.lock = false
        setTimeout(() => {
          func()
          this.lock = true
        }, time)
      }
    },
  },
  created() {
    this.getImgs()
    this.imgPreloading()
  },
  mounted() {
    this.containerWidth = this.$refs.galleryListContainer.offsetWidth
    window.onresize = () => {
      this.containerWidth = this.$refs.galleryListContainer.offsetWidth
      this.wait(this.imgPreloading)
    }
  }
}
</script>

<style lang="less" scoped>
.gallery-list-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: scroll;
  .gallery-list-item {
    position: absolute;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
}

.custom-appear-class{
	opacity: 0
}

.custom-appear-active-class{
	transition: opacity 2s;
}

.custom-appear-to-class{
	opacity: 0.5
}
</style>