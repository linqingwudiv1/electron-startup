
import { Component, Prop, Vue } from 'vue-property-decorator';
import {shell} from 'electron';

import { createWriteStream, existsSync, statSync } from 'fs';

import { dirname,resolve } from 'path';

import { ipcRenderer, IpcRendererEvent } from 'electron';
import { GMethod } from '@/MainProcess/GApp';
import _ from 'lodash';
import { DownloadUpdateZip } from '@/API/core';
import AdmZip from 'adm-zip';

/**
 * custom component
 */
import QingProgress from '@/components/progress/index.vue'

const DownCache_Files:Array<string> = [];
const BaseDir = process.cwd();

for(let i = 0;i < 10;i++)
{
  DownCache_Files.push( resolve( GMethod.GetSystemStore().get('CacheDir') , `${i}.zip` ) );
}

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
      'qing-progress' : QingProgress
    }
  })
export default class StartupComponent extends Vue 
{
  public AppInfo:any = {
    version: '0.1.0'
  };
  
  public downinfo:IDownloadPacketInfo = 
  {
    waitDownloadList : [ ['/管理端.zip',  true  ],
                         ['/服装DIY.MP4', false ] ] ,
    bunzipping : false  ,
    contentLength:0     ,
    downloadLength:0    ,
    curunzipfiles:[]    ,
    FileCount:0         ,
  };

  mounted():void
  {

  }

  public getversion():string
  {
    return '0.1.0';
  }

  public get percentage_downprocess():number
  {
    console.log(this.downinfo);
    let ret_val = ( this.downinfo.downloadLength / this.downinfo.contentLength ) * 100 ;
    ret_val = isNaN(ret_val) ? 0 : parseInt(ret_val.toFixed(2));
    
    return ret_val;
  }
  
  public get percentage_mountprocess():number
  {
    let ret_val = (this.downinfo.curunzipfiles.length / this.downinfo.FileCount) * 100;
    ret_val = isNaN(ret_val) ? 0 : parseInt(ret_val.toFixed(2));
    return ret_val;
  }

  public get bUnzipComplated():boolean
  {
    if ( 100 == this.percentage_mountprocess )
    {
      return true;
    }

    return false;
  }

  private handlewaitdownloadlist()
  {  
    this.downinfo.FileCount = this.downinfo.waitDownloadList.length;
    this.downinfo.waitDownloadList.forEach((item:[string,boolean], index:number) => 
    {
      if (item[1] == true)
      {
        this.biz_unzip(item[0]);
      }
      else 
      {
        DownloadUpdateZip(item[0]).on('response', ( res:Response ) =>
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
          this.downinfo.curunzipfiles.push( '下载完成:' + resolve( BaseDir, '/temp/', item[0] ) );
        })
        .pipe( createWriteStream( resolve( BaseDir, '/temp/', item[0] ) ) );
      }
    });
  }

  /**渲染进程处理 */
  private biz_unzip(path:string):void
  {
    //this.downinfo.curunzipfiles = [];

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
      const zipPath = DownCache_Files[0];
      this.downinfo.curunzipfiles.push('下载完成:' + zipPath);
      if( existsSync(zipPath)    && 
          statSync(zipPath).size >  0 )
      {
        const UnzipDir:string = resolve(BaseDir, "/temp/");
        let zip = new AdmZip(zipPath);
        let zipEntries = zip.getEntries(); 
        let len = zipEntries.length;
        this.downinfo.FileCount += len;

        zipEntries.forEach( (zipEntry:any,index:number) => 
        {
          
          if ( zipEntry == null ) 
          {
            return;
          }

          const entryPath = resolve(UnzipDir, '/t/',  zipEntry.entryName);
          
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
    .pipe( createWriteStream( DownCache_Files[0] ) );
  }

  /**
   * 
   */
  private hasFileUnzip(path:string)
  {
    this.downinfo.curunzipfiles.push('解压完成:' + path);
    this.$nextTick().then( (vue:any)=>
    {
      let ele:any = document.getElementById('unzipfilelist');
      ele.scrollTop = ele.scrollHeight;
    });
  }

  /**
   * 启动应用节流
   */
  public onclick_test = _.throttle( ()=>
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
    ipcRenderer.send( 'emp_ontray', true);
    shell.openItem('D:/UE4Deloy/WindowsNoEditor/BJ_3DDesignAPP.exe');
  }, 500);

} 