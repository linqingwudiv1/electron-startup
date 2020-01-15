<template>
  <div id="app">
    <div class="titlebar-btn-group">
      <!-- <el-button id="btn-maxilize" type="text">_</el-button>
      <el-button id="btn-minilize" type="text" icon="el-icon-full-screen"></el-button> -->

      <el-button id="btn-close" size="medium" type="text" icon="el-icon-close"></el-button>
    </div>
    <router-view/>
  </div>
</template>

<style lang="stylus">
#app
  font-family 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing antialiased;
  -moz-osx-font-smoothing grayscale;
  .titlebar-btn-group
    position :fixed;
    top:10px;
    right :10px;
    .el-button
      padding :8px;
      color:#383838;
      font-size :22px;
      font-weight :900;
    .el-button:hover
      color :red;
      background:#c0c0c0;
</style>

<script src="./App.ts" lang="ts">
</script>
