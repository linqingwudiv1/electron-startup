<template>
  <div class="main-com">
      <div class="content">
        <h1>软件更新应用启动器</h1>
        <span>{{AppInfo.version}}</span>
        <el-divider></el-divider>
        <div class="unzipfilelistcontainer">
          <div id="unzipfilelist">
            <p class="item" v-for="(item,index) in downinfo.curunzipfiles" v-bind:key="index">
              <strong></strong>
              {{item}}
            </p>
          </div>
        </div>
      </div>
      <div class="statusbar">
          <template v-if="!bUnzipComplated">
            <p v-if="downinfo.bunzipping">下载安装中...</p>
            <p v-else>完成</p>
          </template>
          <template v-else>
            <p style="color:#00000000;">嘻嘻嘻</p>
          </template>
      </div>
      <div class="footer">
        <div class="ele-item" style="width:100%;">
          <div class="flex-progress">
            <div class="flex-progress-item">
              <span><strong>下载进度:</strong></span>
              <qing-progress v-bind:percentage="percentage_downprocess"></qing-progress>
            </div>
            <div class="flex-progress-item">
              <span><strong>安装进度:</strong></span>
              <qing-progress v-bind:percentage="percentage_mountprocess"></qing-progress>
            </div>
          </div>
        </div>
        <el-button class="ele-item" size="medium" type="info" v-on:click="onclick_test">系统设置</el-button>
        <el-button class="ele-item" size="medium" type="primary" v-on:click="onclick_startup">启动应用</el-button>

      </div>
  </div>
</template>

<script lang="ts" src="./index.ts"></script>
<style scoped lang="stylus">
.main-com
  //padding 8px;
  user-select none;
  width :100vw;
  height: 100vh;
  display :flex;
  flex-direction: column;
  .content
    display :flex;
    flex-direction:column;
    width :100%;
    text-align :center;
    background :lightgrey;
    flex :1 0 auto;
    .unzipfilelistcontainer
      flex :1 0 auto;
      width:100%;
      #unzipfilelist
        text-align :left;
        min-height:100%;
        height:0px;
        background:grey;
        overflow-y: auto;
        overflow-x:hidden;
        p
          user-select: all;
          margin: 0;
          padding 5px;
        p:nth-child(even) 
          background :rgb(200,200,200);
        p:nth-child(odd) 
          background :rgb(200,200,211);
        p:hover
          background: rgb(81,104,150);
  .statusbar
    p
      background: lightgrey;
      margin 0;
      padding :5px;
      text-align :right;
  .footer
    height: 108px;
    padding: 10px;
    display :flex;
    flex-direction: row;
    align-content:center;
    justify-content :flex-end;
    background: lightgrey;
    padding 0 10px;
    .ele-item
      margin : 10px 5px 10px 5px;
      .flex-progress
        //border: 1px solid darkgray;
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
        border-radius:5px;
        padding: 5px;
        display: flex;
        flex-direction: column;
        height: calc(100% - 5px * 2);
        flex-wrap:nowrap;
        justify-content :space-between; 
        align-items :stretch;
        .flex-progress-item
          //background:green;
          background:lightgrey;
          display :flex;
          flex-direction:row;
          justify-content :flex-start;
          align-items :baseline;
          .el-progress
            flex-grow: 1;
</style>
