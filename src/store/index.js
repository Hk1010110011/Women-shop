import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutaions'
import actions from './actions'
import getters from './getters'
// 1.安装插件
Vue.use(Vuex)

const state = {
  cartList: [],
};

// 2.创建Storedui
const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})

// 3.挂载Vue实例上
export default store



  // payload 新添加商品
      // let oldProduct = null;
      // for (let item of state.cartList) {
      //   if(item.iid === payload.iid){
      //     oldProduct = item;
      //   }
      // }