<template>
  <div id="tab-bar">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'TabBar',
}
</script>

<style>


  #tab-bar {
    display: flex;
    background-color: #e7e4e4;

    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;

    box-shadow: 0px -3px 5px rgba(185, 185, 185, 0.4);
  }

</style>
