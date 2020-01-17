<template>
  <div id="app">
    <div id="titlebar" class="titlebar-btn-group">
      <el-button id="btn-close" size="medium" type="text" icon="el-icon-close" v-on:click="onclick_close"></el-button>
    </div>
    <router-view/>
  </div>
</template>

<style lang="stylus">
#app
  font-family: 'Avenir', Helvetica, Arial, sans-serif; 
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  .titlebar-btn-group
    position  : fixed;
    top   : 10px;
    right : 10px;
    // background :blue;
    // padding 20px;
    .el-button
      -webkit-app-region  : none;
      padding    : 8px;
      color      : #383838;
      font-size  : 22px;
      font-weight: 900;
    .el-button:hover
      //color :red;
      background:#ff5555;
</style>

<script src="./App.ts" lang="ts">
</script>
