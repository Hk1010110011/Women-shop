import {POP, NEW, SELL} from './const'
import {debounce} from "common/utils.js"

export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null,
      refresh: null,
    }
  },
  mounted() {
    this.refresh = debounce(this.$refs.scroll.refresh, 500)
    this.itemImgListener = () => {this.refresh()}
    this.$bus.$on('itemImageLoad', this.itemImgListener)
    // console.log('我是混入中的内容');
  }
}

export const tabControlMixin = {
  data() {
    return {
      currentType: POP
    }
  },
  methods: {
    tabClick(index){
      switch(index){
        case 0:
          this.currentType = POP
          break
        case 1:
          this.currentType = NEW
          break
        case 2:
          this.currentType = SELL
          break
      }
      console.log(this.currentType);
    }
  }
}