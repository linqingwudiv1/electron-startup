<template>
  <div class="main-com">
      <div class="content">
        <h1>软件更新应用启动器</h1>
        <span>{{AppInfo.version}} 当前请求数:{{ downinfo.curReqCount}}  ----- {{test}} ------ {{reqCount_failed}}</span>
        <el-divider></el-divider>
        <div class="unzipfilelistcontainer">
          <div id="unzipfilelist">
            <p class="item animated slideInLeft supfast" v-bind:class="{ 'erroritem' : item[1] == false }" 
                                                         v-for="(item,index) in downinfo.handlefiles" 
                                                         v-bind:key="index">
              {{item[0]}} 
            </p>
          </div>
        </div>
      </div>
      <div class="statusbar">
          <template v-if="!bUnzipCompleted">
            <p style="color:#00000000;">aabbccdd</p>
          </template>
          <template v-else>
            <p style="color:#00000000;">&nbsp;&nbsp;&nbsp;</p>
          </template>
      </div>
      <div class="footer">
        <div class="ele-item" style="width:100%;">
          <div class="flex-progress qing-box-shadow animated zoomIn supfast">
            <template>
              <div class="flex-progress-item">
                <span><strong>下载进度:&nbsp;</strong></span>
                <el-progress v-bind:text-inside="true" v-bind:stroke-width="26" v-bind:percentage="percentage_downprocess"></el-progress>
              </div>
              <div class="flex-progress-item">
                <span><strong>安装进度:&nbsp;</strong></span>
                <el-progress :text-inside="true" :stroke-width="26" v-bind:percentage="percentage_mountprocess"></el-progress>
              </div>
            </template>
          </div>
        </div>
        <el-button class="ele-item animated zoomIn supfast" 
                   size="medium" 
                   type="info"    
                   v-on:click="onclick_setting">系统设置</el-button>

        <template v-if="!bStartup">
          <template v-if="!bRevice">
            <el-button class="ele-item animated zoomIn supfast" 
                       size="medium"
                       type="primary" 
                       @click="onclick_update">更新应用</el-button>
          </template>
          <template v-else>
            <template v-if="!bPause">
              <el-button class="ele-item animated zoomIn supfast" 
                         size="medium" 
                         type="danger" 
                         v-on:click="onclick_pause">暂停更新</el-button>
            </template>
            <template v-else>
              <el-button class="ele-item animated zoomIn supfast" 
                         size="medium" 
                         type="primary" 
                         v-on:click="onclick_resume">继续下载</el-button> 
            </template>
          </template>
        </template>
        <template v-else>
          <el-button class="ele-item animated zoomIn supfast" 
                     size="medium" type="success" 
                     v-bind:disabled="!bUnpacking"
                     v-on:click="onclick_startup">启动应用</el-button>
        </template>
                  <el-button class="ele-item animated zoomIn supfast" 
                     size="medium" type="success" 

                     v-on:click="onclick_startup">启动应用</el-button>
      </div>
  </div>
</template>

<script lang="ts" src="./index.ts"></script>
<style scoped lang="stylus">
.main-com
  position: absolute;
  width : calc(100% - 16px);
  height: calc(100% - 16px);
  padding: 8px;
  background: lightgrey;
  user-select: none;
  display: flex;
  flex-direction: column;
  .supfast
    animation-duration :0.4s;
  .content
    display: flex;
    flex-direction: column;
    width: 100%;
    text-align: center;
    flex: 1 0 auto;
    .unzipfilelistcontainer
      flex: 1 0 auto;
      width: 100%;
      #unzipfilelist
        text-align: left;
        min-height: 100%;
        height    : 0px ;
        overflow-y: auto;
        overflow-x: hidden;
        .item
          animation-delay: 0ms;
        .erroritem
          color: $qing-danger;
        p
          font-size: 13px;
          user-select: all;
          margin: 0;
          padding 5px;
        p:nth-child(even) 
          background :rgb(200, 200, 200);
        p:nth-child(odd) 
          background :rgb(200, 200, 211);
        p:hover
          background: rgb(81, 104, 150);
  .statusbar
    p
      margin: 0;
      padding :5px;
      text-align :right;
  .footer
    height: 108px;
    display :flex;
    flex-direction: row;
    align-content:center;
    justify-content :flex-end;
    .ele-item
      margin : 10px 5px 10px 5px;
      .flex-progress
        padding: 6px;
        display: flex;
        flex-direction: column;
        height: calc(100% - 5px * 2);
        flex-wrap:nowrap;
        justify-content :space-between; 
        align-items :stretch;
        .flex-progress-item
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: baseline;
          .el-progress
            flex-grow: 1;
</style>
