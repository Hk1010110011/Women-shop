<template>
  <div id="home">
    <!-- 主页面 -->
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore"
            >
      <!-- 轮播图 -->
      <home-swiper :banners="banner"></home-swiper>
      <!-- 详情页 -->
      <recommend-view :recommend="recommend"></recommend-view>
      <!-- 流行项 -->
      <feature-view ></feature-view>
      <!-- 款式类 -->
      <tab-control class="tab-control"
            :titles="['流行', '新款', '精选']"
            @tabClick="tabClick" />
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
    }
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list
    }
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
       const refresh = this.debounce(this.$refs.scroll.refresh, 500)
       // 3.监听item图片加载完整
       this.$bus.$on('itemImageLoad', () => {
       // this.$refs.scroll.refresh()
       refresh()
    })
  },
  methods: {
     // 1.请求多个数据
     /* 事件监听相关方法 */
    tabClick(index) {
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
    },
    backClick() {
      this.$refs.scroll.scrollTo(0, 0, 1000)
    },
    contentScroll(position) {
      this.isShowBackTop = (-position.y) > 2000
    },
    loadMore() {
      this.getHomeGoods(this.currentType)
    },
     /* 网络请求相关方法 */
    getHomeMultidata(){
      getHomeMultidata().then(res => {
        // console.log(res);
        // this.result = res;
        this.banner = res.data.banner.list
        this.recommend = res.data.recommend.list
      })
    },
    getHomeGoods(type){
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then(res => {
      // console.log(res);
        this.goods[type].list.push(...res.data.list)
        this.goods[type].page += 1

        this.$refs.scroll.finishPullUp()
      })
    },

  }
}
</script>

<style scoped>
#home{
  padding-top: 49px;
  height: 100vh;
}

.home-nav {
  background-color: var(--color-tint);
  color: #fff;

  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9;
}

  .tab-control{
    /* 适配移动端 */
    /* position: sticky; */
    /* top : 44px; */
    z-index: 9;
  }
  .content{
    height: calc(100% - 49px);
    overflow: hidden;
  }
</style>
