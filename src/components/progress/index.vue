<template>
    <div class="qing-progress">
      <div v-bind:style="{ width: percentage + '%'}">
        <p>{{`${percentage}%`}} </p>
      </div>
    </div>
</template>

<script lang="ts" src="./index.ts"></script>
<style scope lang="stylus">
.qing-progress
    flex-grow: 1;
    background: white;
    display: inline-block;
    border-radius :15px;
    height 30px;
    div
        border-radius: 15px;
        background: rgb(64, 158, 255);
        height:100%;
        line-height: 30px;
        text-align: right;
        display: inline-block;
        vertical-align: middle;
    p
        vertical-align: middle;
        margin:0 5px;
        padding: 0;
        display: inline-block;
        font-size: 12px;
        color: white;
</style>