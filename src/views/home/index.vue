<template>
  <div class="home" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.7)">
    <startup v-show="bNeedUpdate" v-bind:download-dir-list="DownloadDirList"></startup>
    <!-- <game-setting-dialog></game-setting-dialog> -->
  </div>
</template>

<script lang="ts" src="./index.ts"></script>
<style lang="stylus" scoped>
.home
  padding 0;
  height 100vh;
  width: 100vw;
</style>