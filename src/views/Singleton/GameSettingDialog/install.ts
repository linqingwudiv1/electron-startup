
import Vue,{} from 'vue';
import GameSettingDialog from '@/views/Singleton/GameSettingDialog/index.vue';
import GameSettingDialogComponent from '@/views/Singleton/GameSettingDialog/index.ts';
import store from '@/store/index';
import router from '@/router/index';

declare const window:any;
let instance : any| null = null;
 //构造一个新的Vue实例句柄.....

/**
 * App初始化时调用...
 */
const install = function ( vue:typeof Vue, opts = {} )
{
    //往Vue类里写入一个`静态函数’
    Vue.prototype.$gameSettingDialog = (opt?:any)=>
    {
        if (!instance)
        {
            //如果单例未创建...
            let div = document.createElement('div');

            instance  =  new GameSettingDialog({
                el      : div   ,  
                store   : store ,  // 如果用到vuex需要包含
                router  : router   // 同route
            });

            document.body.appendChild(instance.$el);
        }

        return instance as GameSettingDialogComponent;
    };
} 

export default install;
