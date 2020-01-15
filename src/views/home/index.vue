<template>
  <div class="home" v-loading="loadingArgs.bDownloadList" 
                    element-loading-spinner="el-icon-loading" 
                    element-loading-background="rgba(180, 180, 180, 0.7)">
    <div>
      <div class="top">
        <el-button class="ele-item animated zoomIn supfast" 
                   size="medium"
                   icon="el-icon-s-home"
                   v-on:click="openUrl('http://www.bing.com')"
                   type="text">官网</el-button>
        <el-button class="ele-item animated zoomIn supfast" 
                   size="medium" 
                   icon="el-icon-s-goods"
                   v-on:click="openUrl('http://www.bing.com')"
                   type="text">商城</el-button>
        <el-button class="ele-item animated zoomIn supfast" 
                   size="medium" 
                   icon="el-icon-connection"
                   v-on:click="openUrl('http://www.bing.com')"
                   type="text">社区</el-button>
        <el-button class="ele-item animated zoomIn supfast" 
                   size="medium" 
                   icon="el-icon-chat-line-square"
                   v-on:click="openUrl('http://www.bing.com')"
                   type="text">支持</el-button>
      </div>
      <el-divider></el-divider> 
    </div>
    <div class="content">
      <template v-if="bNeedUpdate">
        <!-- <updator v-bind:download-dir-list="DownloadDirList"></updator> -->
        <statup></statup>
      </template>
    </div>
  </div>
</template>

<script lang="ts" src="./index.ts">
</script>

<style lang="stylus" scoped>
.home
  padding 0;
  display: flex;
  height:100vh;
  flex-direction: column;
  background: #e7e7e7;//lightgrey; 
  .el-divider--horizontal
      margin :12px 0;
  .top
    padding-top: 10px;
    display :flex;
    flex-direction :row;
    justify-content:space-around;
    width 100%;
    .el-button
      color: #484848;
      font-weight:900;
      font-size: 18px;
    .el-button:hover
      color: #6e6e6e;
    #btn-setting
      //
  .content
    //background :blue;
    padding 0px 10px 5px 10px;
    flex-grow: 1;
</style>