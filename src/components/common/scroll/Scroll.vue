<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
// 导入 Better-Scroll
import BScroll from 'better-scroll'

export default {
  name: 'Scroll',
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    probeType: {
      type: Number,
      default: 0
    },
    pullUpLoad: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scroll: null, // 设置变量存储
    }
  },
  mounted() {
    // 1.创建BScroll 对象
    this.scroll = new BScroll(this.$refs.wrapper, { //使用构造函数 BScroll 获取 元素
      click: true, // 设置点击响应
      observeDOM: true, // 设置PC端 允许滑动
      probeType: this.probeType, // 开启滚动监听
      pullUpLoad: this.pullUpLoad, // 开启

      })
    // 2,监听滚动的位置
    if(this.probeType === 2 || this.probeType === 3 ){
      this.scroll.on('scroll', (position) => {
      this.$emit('scroll', position)
    })
    }
    //
    // 3.监听scroll滚动到底部
    if (this.pullUpLoad) {
      this.scroll.on('pullingUp', () =>{
      this.$emit('pullingUp')
    })
    }
  },
  methods: {
    scrollTo(x, y, time){
      this.scroll && this.scroll.scrollTo(x, y, 500)
    },
    finishPullUp() {
      this.scroll && this.scroll.finishPullUp()
    },
    refresh() {
      this.scroll && this.scroll.refresh()
      // console.log('---!!!');
    },
    getScrollY() {
      return this.scroll ? this.scroll.y : 0
    }
  }
}
</script>

<style scoped>
</style>