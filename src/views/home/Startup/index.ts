//#region import  
import { Component, Vue, Prop , Mixins, Watch } from'vue-property-decorator';
//import { shell } from 'electron';
const {shell} =  require('electron').remote;
import shelljs,{mkdir} from 'shelljs';
import { createWriteStream, existsSync,  statSync, unlinkSync } from 'fs';
import { dirname,resolve,join } from 'path'; 
import { ipcRenderer, IpcRendererEvent, remote } from 'electron';
const { app } = remote;
import _, { delay } from 'lodash';
import { DownloadFilePartMutilple, GetNeedDownloadList } from '@/API/core';
import AdmZip from 'adm-zip-ex';
import { from, range } from 'linq';
import request from 'request';
// custom component 
import QingProgress from '@/components/progress/index.vue';
import { RequestProgressState, RequestProgress } from 'request-progress-ex';
// data 
import { IDownloadPacketInfo, DownloadItem, EM_DownloadItemFileType, EM_DownloadItemState } from '@/Model/Request/data';
import GMPApp from '@/Electron/MP/GMPApp';
import { GConst } from '@/Global/GConst';
//#endregion

@Component({
    components:{
      'qing-progress'  : QingProgress
    }
})
export default class UpdatorView extends Vue 
{
  /** */
  mounted():void
  {
  }

  //#region http biz

  //#endregion

  //#region 属性(property)  

  

  /** 是否可启动 */
  public get bStartup():boolean
  {    
      return true;
  }


//#endregion

//#region 页面响应事件处理


  // 启动应用节流
  public onclick_startup =_.throttle( () =>
  {
    if ( this.bStartup )
    { 

      ipcRenderer.send( 'emp_startup' );
    }
    else 
    {
      this.$alert(`正在更新应用..请等待( wait updating application )`, {
        confirmButtonText: '确定(confirm)',
        callback: (action:any) => { }
      });
    }
  }, 500);


  /** */  
  public onclick_setting = _.throttle( () =>
  {

    this.$gameSettingDialog().show();
  });
}

//#endregion
