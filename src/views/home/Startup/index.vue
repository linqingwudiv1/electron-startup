<template>
  <div class="startup-com">
      <div class="content">
            <el-row style="height :100%;" v-bind:gutter="10">
              <el-col v-bind:span="8" style="height :100%">
                <el-card style="height :100%;text-align:center;">
                    <div slot="header" class="clearfix">
                        <b> <i class="el-icon-chat-line-square">&nbsp;</i>推荐、公告</b>
                    </div>                 
                    <div v-for="o in 4" :key="o">
                        <el-link href="http://baidu.com" target="_blank" type="primary">{{'活动介绍 ' + o }}</el-link>
                    </div>
                </el-card>
              </el-col>
              <el-col v-bind:span="16" style="height :100%">
                  <video ref="video" src="https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_30mb.mp4" 
                         controls  
                         disablePictureInPicture="true"
                         controlslist="nodownload noremoteplayback" 
                         x5-video-player-type="h5"
                         type="video/mp4"
                         playsinline="false"></video>
              </el-col>
          </el-row>
        <!--  -->
      </div>
      <div class="footer">
         <div id="infobar" class="ele-item animated zoomIn">
             <span class="el-icon-connection"></span>L.Q
         </div>
         <el-button id="btn-setting"  
                   class="ele-item animated zoomIn supfast" 
                   size="medium"
                   type="info"
                   icon="el-icon-setting"
                   v-on:click="onclick_setting">系统设置</el-button>
                   
        <el-button id="btn-startup"   
         class="ele-item animated zoomIn" 
         size="medium" type="success" 
         icon="el-icon-switch-button"
         v-on:click="onclick_startup">　启动程序　</el-button> 

      </div>
  </div>
</template>

<script lang="ts" src="./index.ts"></script>
<style scoped lang="stylus">
.startup-com
  height 100%;
  user-select: none;
  display: flex;
  flex-direction: column;
  video 
    object-fit : fill;
    width :99%;
    height :100%;
    border-radius: 5px;
    box-shadow: inset 0 0 3px rgba(0,0,0,0.1);
  .content
    // display: flex;
    // flex-direction: column;
    width: 100%;
    align-items :flex-start;
    justify-self :flex-start;
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
          background :rgb(81, 104, 150);
  .statusbar
    p
      margin: 0;
      padding :5px;
      text-align :right;
  .footer
    padding: 12px 5px 12px 0;
    height: 56px;
    display :flex;
    flex-direction: row;
    align-content:center;
    justify-content :flex-end;
    .ele-item
        //
    #btn-setting
        font-size: 18px;
        font-weight:bold;
    #btn-startup
        font-size: 18px;
        font-weight:bold;
    #infobar
        font-size: 18px;
        font-weight:bold;
        border: 1px solid #DCDFE6;
        flex-grow 1;
        background:white;
        border-radius:4px;
        margin:0 10px 0 0;
        padding: 12px 20px 12px 20px;
        //
</style>
