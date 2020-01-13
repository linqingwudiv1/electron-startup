import { Component, Prop, Vue } from 'vue-property-decorator';
import Startup from '@/views/Startup/index.vue';
import GameSettingDialog from '@/components/GameSettingDialog/index.vue';
import { GetNeedDownloadList } from '@/API/core';
import {DownloadItem} from '@/Model/Request/data';
import {remote} from 'electron';
import { delay,debounce } from 'lodash';
const {app} = remote;

@Component(
{
  components:
  {
    startup : Startup,
    gameSettingDialog: GameSettingDialog
  }
})
export default class HomeView extends Vue {
  public DownloadDirList:Array<DownloadItem>= [];

  public loadingArgs:any = 
  { 
    //bDownloadList: false,
    get bDownloadList():boolean
    {
      return this._bDownloadList;
    },
    t:delay((val:boolean)=>{
      this.loadingArgs.bDownloadList = val;
    },500),
    
    set bDownloadList(val:boolean)
    // (val:boolean) 
    {
      this.t(val);
    }  
  };

  mounted() {

    this.http_GetNeedDownloadList();
  }

  public get bNeedUpdate():boolean 
  {
    return this.DownloadDirList.length > 0;
  }
  
  private http_GetNeedDownloadList()
  {

    GetNeedDownloadList().then( ( res:any ) =>
    { 
      this.DownloadDirList = [];
      res.data.forEach((item:any) => {
        this.loadingArgs.bDownloadList = false;
        this.DownloadDirList.push(new DownloadItem(item.title ,item.uri ,item.fileType ) );
        console.log('bbb', this.DownloadDirList);
      });
    }).catch( (error:any)=>
    {
      this.loadingArgs.bDownloadList = false;
      this.$confirm('网络连接错误,请检查网络连接是否通畅..即将尝试重连连接...点击<退出>可退出当前应用程式', '网络错误', {
        confirmButtonText: '退出',
        cancelButtonText: '',
        type: 'error'
      }).then(()=>
      {
        setTimeout(() => {
          app.quit();
        }, 500);
      }).catch(()=>
      {
        this.http_GetNeedDownloadList();
      });
      console.log(error);
    });
  }
}