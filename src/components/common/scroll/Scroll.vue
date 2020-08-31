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
      pullUpLoad: this.pullUpLoad,

      })
    // 2,监听滚动的位置
    this.scroll.on('scroll', (position) => {
      this.$emit('scroll', position)
    })
    // 3.上拉加载更多
    this.scroll.on('pullingUp', () =>{
      this.$emit('pullingUp')
    })
  },
  methods: {
    scrollTo(x, y, time=1000){
      this.scroll && this.scroll.scrollTo(x, y, time)
    },
    finishPullUp() {
      this.scroll.finishPullUp()
    },
    refresh() {
      console.log('---');
      this.scroll && this.scroll.refresh()
    }
  }
}
</script>

<style scoped>
</style>