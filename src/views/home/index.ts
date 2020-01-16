import { Component, Prop, Vue } from 'vue-property-decorator';

import { GetNeedDownloadList } from '@/API/core';
import {DownloadItem} from '@/Model/Request/data';
import {remote, shell} from 'electron';
import { delay } from 'lodash';
import _ from 'lodash';

import Updator from './Updator/index.vue';
import Startup from './Startup/index.vue';
import { ElectronDragHelper } from '@/utils/ElectronDragHelper';
const {app} = remote;

@Component(
{
  components: 
  {
    updator : Updator,
    statup : Startup
  }
})
export default class HomeView extends Vue {
  public DownloadDirList:Array<DownloadItem> = [];

  public loadingArgs:any = 
  { 
    bDownloadList: false
  };

  mounted() {
    this.http_GetNeedDownloadList();
    ElectronDragHelper('#top-nav-bar');
  }

  public get bNeedUpdate():boolean 
  {
    return this.DownloadDirList.length > 0;
  }
  
  private http_GetNeedDownloadList()
  {
    //延迟执行,保证动画连续性
    this.loadingArgs.bDownloadList = true;

    delay( ()=>
    {
      GetNeedDownloadList().then( ( res:any ) =>
      {
        this.loadingArgs.bDownloadList = false;
        this.DownloadDirList = [];
        res.data.forEach( (item:any) => {
          this.DownloadDirList.push(new DownloadItem(item.title ,item.uri ,item.fileType ) );
        });
      }).catch( (error:any)=>
      {        
        this.loadingArgs.bDownloadList = false;
        this.$alert('网络连接错误,请检查网络连接是否通畅..即将尝试重连连接...点击<退出>可退出当前应用程序', '网络错误', {
          confirmButtonText: '退出',
          type: 'error'
        }).then( () =>
        {
          setTimeout(() => {
            app.quit();
          }, 300);
        }).catch( () =>
        {
          this.http_GetNeedDownloadList();
        });
        console.log(error);
      });
    } ,300);

  }

  //#region Event 


  public openUrl = _.throttle( (url) => {
    shell.openExternal(url);
  });

  //#endregion
}