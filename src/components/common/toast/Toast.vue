<template>
  <div v-show="isshow" class="toast">
    <div>{{message}}</div>
  </div>
</template>

<script>
export default {
  name: 'Toast',
  props: {
    // message: {
    //   type: String,
    //   defailt: ''
    // },
    // show: {
    //   type: Boolean,
    //   default: false
    // }
  },
  data() {
    return {
      message: '',
      isshow: false,
    }
  },
  methods: {
    show(message="默认文字", duration=2000){
      this.isshow = true;
      this.message = message;

      setTimeout(() => {
        this.isshow = false;
        this.message = '';
      },duration)
    }
  }
}
</script>

<style scoped>
.toast{
  position: fixed;
  top: 50%;
  left: 50%;
  padding: 8px 10px;
  transform: translate(-50%, -50%);
  color: #fff;
  z-index: 9999;
  background-color: rgba(0,0,0,.65);
  border-radius: 5px;
}
</style>