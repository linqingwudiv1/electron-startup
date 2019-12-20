import { Component, Prop, Vue } from 'vue-property-decorator';
import {shell} from 'electron';
import {mkdir} from 'shelljs';
import { createWriteStream, existsSync, statSync, fstat, readFileSync, readFile, mkdirSync } from 'fs';
import { dirname,resolve,join } from 'path'; 
import { ipcRenderer, IpcRendererEvent } from 'electron';
import GMPMethod from '@/Global/MainProcess/GMPMethod';
import GApp from '@/Global/MainProcess/GApp';
import _, { delay } from 'lodash';
import { DownloadUpdateZip, GetWaitDownloadList } from '@/API/core';
import {TweenMax,TweenLite, random} from 'gsap';
import AdmZip from 'adm-zip';


/**
 * custom component
 */
import QingProgress from '@/components/progress/index.vue';
import GameSettingDialog from '@/components/GameSettingDialog/index.vue';
import { RequestProgressState } from 'request-progress';

const DownCache_Files:Array<string> = [];

for(let i = 0;i < 10; i++)
{
  DownCache_Files.push( resolve( GApp.SystemStore.get('CacheDir') , `${i}.zip` ) );
}


/**
 * 
 */
interface IDownloadPacketInfo
{
  /**
   * 路径和是否需要解压
   */
  waitDownloadList:Array<[string, boolean]>,
  bunzipping:boolean;
  contentLength:number;
  downloadLength:number;
  curunzipfiles:Array<string>;
  FileCount:number;
};

@Component(
  {
    components:{
      'qing-progress' : QingProgress,
      'game-setting-dialog' :  GameSettingDialog
    }
  })
export default class StartupComponent extends Vue 
{
  /** */
  public AppInfo:any = {
    version: '0.1.0'
  };

  /** */
  public downinfo:IDownloadPacketInfo = 
  {
    waitDownloadList : [ ['/管理端.zip',  true  ],
                         ['/public/服装DIY.MP4', false ] ] ,
    bunzipping : false  ,
    contentLength:0     ,
    downloadLength:0    ,
    curunzipfiles:[]    ,
    FileCount:0         ,
  };

  /** */
  mounted():void
  {
    GetWaitDownloadList(GApp.UEVersion).then( (res:any)=>
    {
      console.log(``);
    });
  }

  /** 是否可启动 */
  public get bStartup():boolean
  {
    return this.downinfo.waitDownloadList.length == 0;
  }

  /** 是否可更新 */
  public get bUpdate():boolean 
  {
    return this.downinfo.waitDownloadList.length > 0;
  }

  /** */
  public get percentage_downprocess():number
  {
    let ret_val = ( this.downinfo.downloadLength / this.downinfo.contentLength ) * 100 ;
    ret_val = isNaN(ret_val) ? 0 : parseInt(ret_val.toFixed(2));
    
    return ret_val;
  }
  
  /** */
  public get percentage_mountprocess():number
  {
    let ret_val = (this.downinfo.curunzipfiles.length / this.downinfo.FileCount) * 100;
    ret_val = isNaN(ret_val) ? 0 : parseInt(ret_val.toFixed(2));
    return ret_val;
  }

  /** */
  public get bUnzipComplated():boolean
  {
    if ( 100 === this.percentage_mountprocess )
    {
      return true;
    }

    return false;
  } 

  /** */
  private handlewaitdownloadlist()
  {  
    // 路径不存在则创建路径
    if (!existsSync( GApp.SystemStore.get('CacheDir') ) )
    {
      let stdout = mkdir('-p', resolve( GApp.SystemStore.get('CacheDir') )).stdout;
    }

    this.downinfo.FileCount = this.downinfo.waitDownloadList.length;
    this.downinfo.waitDownloadList.forEach((item:[string,boolean], index:number) => 
    {
      if (item[1] == true)
      {
        this.biz_zipdownload(item);
      }
      else 
      {
        this.biz_filedownload(item);
      }
    });
  }

  /**
   * 下载文件
   * @param item ftp路径和安装相对路径
   */
  private biz_filedownload(item:[string,boolean]):void
  {
    let path = item[0];
    let fullpath = resolve(GApp.MounteDir, path);
    let fulldir = dirname(fullpath);
    
    if (!existsSync(fulldir) )
    {
      let stdout = mkdir('-p', fulldir).stdout;
    }
    DownloadUpdateZip(path)
    // .on('response', ( res:Response ) =>
    // {
    //   let len:number = parseInt((res.headers as any )['content-length']);
    //   this.downinfo.contentLength += len;
    // })
    .on('progress', (state:any)=>
    {
      console.log('#############################',state);
    })
    .on('end', function () {
      console.log('#############################','   end');
      // Do something after request finishes
    })
    // .on('data', (data:Buffer) =>
    // {
    //   this.downinfo.downloadLength += data.length;
    // })
    // .on('complete', () =>
    // {
    //   this.downinfo.waitDownloadList.splice( this.downinfo.waitDownloadList.indexOf(item), 1);
    //   this.downinfo.curunzipfiles.push( '下载完成:' + fullpath );

    // })
    .pipe( createWriteStream(fullpath) );
  }

  /**
   * 下载压缩包，并解压安装
   * @param item 下载路径
   */
  private biz_zipdownload(item:[string,boolean]):void
  {
    let path = item[0];
    DownloadUpdateZip(path).on('response', ( res:Response ) =>
    { 
      let len:number = parseInt((res.headers as any )['content-length']);
      this.downinfo.contentLength += len;
    })
    .on('data', (data:Buffer) =>
    {
      this.downinfo.downloadLength += data.length;
    })
    .on('complete', () =>
    {
      this.downinfo.waitDownloadList.splice(this.downinfo.waitDownloadList.indexOf(item),1);
      const zipPath = DownCache_Files[0];
      
      this.downinfo.curunzipfiles.push('下载完成:' + zipPath);

      if( existsSync(zipPath)    && 
          statSync(zipPath).size >  0 )
      {
        let zip = new AdmZip(zipPath);
        let zipEntries = zip.getEntries(); 
        let len = zipEntries.length;
        this.downinfo.FileCount += len;

        zipEntries.forEach( ( zipEntry:any, index:number ) => 
        {
          
          delay(()=>
          {
            if ( zipEntry == null ) 
            {
              return;
            }
  
            const entryPath = join( GApp.MounteDir,  zipEntry.entryName);
  
            if ( zipEntry.isDirectory )
            {
              this.hasFileUnzip( entryPath );
              return;
            }
      
            let path = dirname( entryPath );
            // unzip entry......
            zip.extractEntryToAsync(zipEntry, path , true, true, (err:any) =>
            {
              if ( err != undefined )
              {
                console.log(err);
              }
              this.hasFileUnzip( entryPath );
            });
            
          }, index * 50);

        });
      }
    })
    .on('error', (err:any) =>
    {
      console.log(err);
    })
    .on('error', (err:any) =>
    {
      console.log(err);
    })
    .on('pipe', (req:any) =>
    {
    })
    .pipe(createWriteStream (DownCache_Files[0]) );
  }

  /**
   * 
   */
  private hasFileUnzip(path:string)
  {
    let delay_time = Math.random() * 100 + 50;

    this.downinfo.curunzipfiles.push('解压完成:' + path);
    this.$nextTick().then( (vue:any)=>
    {
      let ele:any = document.getElementById('unzipfilelist');
      ele.scrollTop = ele.scrollHeight;
    });
  }

  /**
   * 更新应用, 启动应用节流
   */
  public onclick_update = _.throttle( ()=>
  {
    this.downinfo.bunzipping = true   ;
    this.downinfo.contentLength  = 0  ;
    this.downinfo.downloadLength = 0  ;
    this.downinfo.FileCount = 0       ;
    this.downinfo.curunzipfiles  = [] ;
    this.handlewaitdownloadlist()     ;
  }, 500);

  /**
   * 启动应用节流
   */
  public onclick_startup =_.throttle( ()=>
  {
    if(this.bStartup)
    {
      ipcRenderer.send( 'emp_ontray', true);
      shell.openItem('D:/UE4Deloy/WindowsNoEditor/BJ_3DDesignAPP.exe');
    }
    else 
    {
      this.$alert(`正在更新应用..请等待`, {
        confirmButtonText: '确定',
        callback: (action:any) => {}
      });
    }
  }, 500);
} 