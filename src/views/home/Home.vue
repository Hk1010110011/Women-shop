<template>
  <div id="home">
    <!-- 主页面 -->
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>

    <tab-control class="tab-control"
            :titles="['流行', '新款', '精选']"
            @tabClick="tabClick"
            ref="tabControl1" v-show="isTabFixed" />

    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore"
            >
      <!-- 轮播图 -->
      <home-swiper :banners="banner" @swiperImg="swiperImg"></home-swiper>
      <!-- 详情页 -->
      <recommend-view :recommend="recommend"></recommend-view>
      <!-- 流行项 -->
      <feature-view ></feature-view>
      <!-- 款式类 -->
      <tab-control :titles="['流行', '新款', '精选']"
                   @tabClick="tabClick"
                   ref="tabControl2" />
      <goods-list :goods="showGoods"></goods-list>
    </scroll>
    <!-- 组件不能直接监听点击，传递.native 才能监听 -->
    <back-top @click.native="backClick" v-show="isShowBackTop" />

  </div>
</template>

<script>
/*            项目可视化组件               */
import HomeSwiper from './childComps/HomeSwiper'
import RecommendView from './childComps/RecommendView'
import FeatureView from './childComps/FeatureView'

/*            项目公共组件            */
import NavBar  from 'components/common/navbar/NavBar'
import Scroll from 'components/common/scroll/Scroll'
import TabControl from 'components/content/tabControl/TabControl'
import GoodsList from 'components/content/goods/GoodsList'
import BackTop from 'components/content/backTop/BackTop'

/*              数据导入              */
import {getHomeMultidata, getHomeGoods} from "network/home"
import {debounce} from "common/utils.js"
import {itemListenerMixin} from 'common/mixin'


export default {
  name: 'Home',
  components: {
    HomeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    TabControl,
    GoodsList,
    Scroll,
    BackTop
  },
  data() {
    return {
      banner: [],
      recommend: [],
      goods: {
        'pop' : {page: 0, list: [] },
        'new' : {page: 0, list: [] },
        'sell' : {page: 0, list: [] }
      },
      currentType: 'pop',
      isShowBackTop: false,
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0,
    }
  },
  mixins: [itemListenerMixin],
  computed: {
      showGoods() { // 返回 type 'xxx' 请求 点击的 'xxx'
      return this.goods[this.currentType].list
    }
  },
  destroyed() { // 离开销毁时运行 这个函数destroyed()
    console.log('Home destroyed ');
  },
  activated () {
    // console.log('activated');
    this.$refs.scroll.scrollTo(0, this.saveY, 0)
    this.$refs.scroll.refresh()
  },
  deactivated () {
    // console.log(this.$refs.scroll.getScrollY());
    // 1. 保存Y值
    this.saveY = this.$refs.scroll.getScrollY();
    // 2. 取消全局事件的监听
    this.$bus.$off('itemImageLoad', this.itemImgListener)
  },
  created() {
    // 1.请求多个数据
    this.getHomeMultidata();
    // 2.请求商品数据
    this.getHomeGoods('pop');
    this.getHomeGoods('sell');
    this.getHomeGoods('new');

  },
  mounted() {
    // 1.图片加载完成的监听事件
    // const refresh = debounce(this.$refs.scroll.refresh, 500)
    // this.itemImgListener = () => {refresh()}
    // this.$bus.$on('itemImageLoad', this.itemImgListener)
    // 对监听的事件进行保存
    // 2.获取tabControl的offsetTop
    // 所有组件都有一个属性： $el: 用于获取组件中的元素

  },
  methods: {
     // 1.请求多个数据
     /* 事件监听相关方法 */
    tabClick(index) { // 点击推荐，设置type 为 'xxx' 款式
      switch(index) {
        case 0:
          this.currentType = 'pop'
          break;
        case 1:
          this.currentType = 'new'
          break;
        case 2:
          this.currentType = 'sell'
      }
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;
    },
    backClick() { // 点击Div 回弹顶部
      this.$refs.scroll.scrollTo(0, 0, 1000)
    },
    contentScroll(position) { // 超出滚动范围 显示回到底部图标
      // 1.判断BackTop是否显示
      this.isShowBackTop = (-position.y) > 2000

      // 2.决定tabControl是否吸顶(position: fixed)
      this.isTabFixed = (-position.y) > this.tabOffsetTop
    },
    loadMore() { // 监听滚动底部，加载更多
      this.getHomeGoods(this.currentType)
      this.$refs.scroll.refresh()
    },
    swiperImg (){
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
    },
     /* 网络请求相关方法 */
    getHomeMultidata(){ // 请求banner 与 请求 图片
      getHomeMultidata().then(res => {
        // console.log(res);
        // this.result = res;
        this.banner = res.data.banner.list
        this.recommend = res.data.recommend.list

      })
    },
    getHomeGoods(type){ // 请求goods 数据 筛选 数据
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then(res => {
      // console.log(res);
        this.goods[type].list.push(...res.data.list)
        this.goods[type].page += 1
        // 完成上拉加载更多+重置
        this.$refs.scroll.finishPullUp()
      })
    },

  }
}
</script>

<style scoped>
#home{
  height: 100vh;
  position: relative;
}

.home-nav {
  background-color: var(--color-tint);
  color: #fff;
  font-weight: 500;
  letter-spacing:4px;
  font-size: 18px;

  /* 在使用浏览器原生滚动时，为了让导航不跟随一起滚动 */
  /* position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9; */
}

  .tab-control{
    /* 适配移动端 */
    position: relative;
    /* top : 44px; */
    z-index: 9;
  }
  .content{
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }


</style>
