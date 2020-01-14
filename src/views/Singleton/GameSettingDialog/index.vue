<template>
    <div class="game-setting-dialog">
        <el-dialog
        title="游戏设置"
        v-bind:visible.sync="bDialog"
        v-bind:close-on-click-modal="false"
        width="60%">
            <div class="settingform">
                <el-form ref="form" v-bind:model="form" label-width="80px">
                    <el-form-item label="活动名称">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="活动区域">
                        <el-select v-model="form.region" placeholder="请选择活动区域">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="活动时间">
                        <el-col v-bind:span="11">
                        <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
                        </el-col>
                        <el-col class="line" v-bind:span="2">-</el-col>
                        <el-col v-bind:span="11">
                        <el-time-picker placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="异步加载">
                        <el-switch v-model="form.delivery"></el-switch>
                    </el-form-item>
                    <el-form-item label="特殊资源">
                        <el-radio-group v-model="form.resource">
                        <el-radio label="品牌商赞助"></el-radio>
                        <el-radio label="场地免费"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="活动形式">
                        <el-input type="textarea" v-model="form.desc"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary">立即创建</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog> 
    </div>
</template>

<script lang="ts" src="./index.ts"></script>
<style scoped lang="stylus">
.game-setting-dialog
    .el-dialog
        .settingform
            overflow-y: auto;
            padding-right: 12px;
            height : 45vh;
</style>
