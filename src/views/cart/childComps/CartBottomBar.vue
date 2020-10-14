<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button
          :is-checked="isSelectAll"
          class="check-button"
          @click.native="checkClick"/>
      <span>全选</span>
    </div>

    <div class="price">
      合计:{{totalPrice}}
    </div>
    <div class="calculate" @click="calcClick">
      去计算:{{checkLength}}
    </div>
  </div>
</template>

<script>
import CheckButton from 'components/content/checkButton/CheckButton'

import { mapGetters } from 'vuex'

export default {
  name: 'CartBottomBar',
  components: {
    CheckButton,
  },
  computed: {
    ...mapGetters(['cartList', 'cartList']),
    totalPrice() {
      return '￥' + this.cartList.filter(item => {
        return item.checked
      }).reduce((preValue, item) => {
        return preValue + item.price * item.count
      },0).toFixed(2)
    },
    checkLength() {
      return this.cartList.filter(item => item.checked).length
    },
    isSelectAll() {
      if(this.cartList.length === 0) return false
      // 1.使用filter
      // return !(this.cartList.filter(item => !item.checked).length)
      // 2.使用find
      return !(this.cartList.find(item => !item.checked))
      // 3.普通遍历
      // for (let item of this.cartList) {
      //   if(!item.checked) {
      //     return false
      //   }
      // }
      // return true

    }
  },
  methods: {
    checkClick() {
      if(this.isSelectAll){
        // 全部选中
        this.cartList.forEach(item => item.checked = false)
      }else { // 有部分或全不选中
        this.cartList.forEach(item => item.checked = true)
      }
    },
    calcClick() {
      if (!this.isSelectAll){
        this.$toast.show('购物车为空', 2000)
      }else{
        this.$toast.show('未完善', 2000)
      }
    }
  }
}
</script>

<style scoped>
.bottom-bar{
  position: relative;
  display: flex;
  height: 40px;
  line-height: 40px;
  background-color: #eee;
  color: #888;
  box-shadow: 0 -2px 3px rgba(0, 0, 0, .2);
  box-sizing: border-box;
}
.check-content{
  display: flex;
  align-items: center;
  margin-left: 12px;
  width: 60px;
}
.check-button{
  width: 23px;
  height: 23px;
  line-height: 20px;
  margin-right: 5px;
}
.price {
  margin-left: 40px;
  font-size: 16px;
  color: #666;
  flex: 1;
}
.calculate{
  background-color: orangered;
  color: #fff;
  width: 100px;
  height: 44px;
  text-align: center;
  line-height: 44px;

}
</style>