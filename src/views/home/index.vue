<template>
  <div class="home" v-loading="loadingArgs.bDownloadList" 
                    element-loading-spinner="el-icon-loading" 
                    element-loading-background="rgba(200, 200, 200, 0.7)">
    <startup v-show="bNeedUpdate" v-bind:download-dir-list="DownloadDirList"></startup>
  </div>
</template>

<script lang="ts" src="./index.ts">
</script>

<style lang="stylus" scoped>
.home
  padding 0;
  height 100vh;
  width: 100vw;
</style>