
import { Component, Prop, Vue } from 'vue-property-decorator';
import {shell} from 'electron';
import { createWriteStream, fstat, existsSync, Stats, statSync } from 'fs';

import request from 'request';
import { Readable } from 'stream';
import { dirname } from 'path';

import { ipcRenderer, IpcRendererEvent } from 'electron';
import { GMethod } from '@/MainProcess/GApp';
import _ from 'lodash';

const AdmZip = require('adm-zip');

const Cache_Base_Dir:string  = "d:/temp/";
const Cache_File_Name:Array<string> = [];

for(let i = 0;i < 10;i++)
{
  Cache_File_Name.push(Cache_Base_Dir + `${i}.zip`);
}

interface IDownloadPacketInfo
{
  bunzipping:boolean;
  contentLength:number;
  downloadLength:number;
  curunzipfiles:Array<string>;
};

@Component({})
export default class StartupComponent extends Vue 
{
  public AppInfo:any = {
    version: '0.0.1'
  };
  
  public downinfo:IDownloadPacketInfo = 
  {
    bunzipping : false,
    contentLength:0 ,
    downloadLength:0,
    curunzipfiles:[]
  };

  mounted():void 
  {
    ipcRenderer.on('erp_unzip_onstart', (ev:IpcRendererEvent,len:number)=>
    {
      console.log('erp_unzip_onstart    ', len);
    }); 
    ipcRenderer.on('erp_unzip_onprocess', (ev:IpcRendererEvent,path:string, bSuccess:boolean, index:number, len:number)=>
    {
      this.downinfo.curunzipfiles.push(path);
      let ele:any = document.getElementById('unzipfilelist');
      ele.scrollTop = ele.scrollHeight;
    }); 
    
    ipcRenderer.on('erp_unzip_oncomplate', (ev:IpcRendererEvent,path:string, arr_errorEntry:Array<[string, string]>)=>
    {
      console.log('erp_unzip_oncomplate    ', arr_errorEntry);
    }); 
  }

  public get percentage_downprocess():number
  {
    let ret_val = (this.downinfo.downloadLength / this.downinfo.contentLength) * 100 ;
    ret_val = isNaN(ret_val) ? 0 : parseInt(ret_val.toFixed(2));
    return ret_val;
  }
  
  public get percentage_mountprocess():number
  {
    let ret_val = 0;
    return ret_val;
  }

  public get bUnzipComplated():boolean
  {
    return false;
  }

  /** 进程通讯 **/
  private biz_decompress():void
  {
    this.downinfo.curunzipfiles = [];
    request.get('http://192.168.1.131:16677/%E7%AE%A1%E7%90%86%E7%AB%AF.zip')
    .on('response',(res:Response)=>
    {
      let len:number = parseInt((res.headers as any )['content-length']);
      this.downinfo.contentLength += len;
    })
    .on('data',(data:Buffer) =>
    {
      this.downinfo.downloadLength += data.length;
    })
    .on('complete', ()=>
    {
      if(existsSync(Cache_File_Name[0]) && statSync(Cache_File_Name[0]).size > 0)
      {
        ipcRenderer.send('emp_unzip',Cache_File_Name[0]);
      }
    })
    .on('error', (err:any) =>
    {
      console.log(err);
    })
    .on('pipe', (req:any) =>
    {
    })
    .pipe(createWriteStream(Cache_File_Name[0]));

  }

  /**渲染进程处理 */
  private biz_unzip():void
  {
    this.downinfo.curunzipfiles = [];
    request.get('http://192.168.1.131:16677/%E7%AE%A1%E7%90%86%E7%AB%AF.zip')
    .on('response', ( res:Response ) =>
    {
      let len:number = parseInt((res.headers as any )['content-length']);
      this.downinfo.contentLength += len;
    })
    .on('data',(data:Buffer) =>
    {
      this.downinfo.downloadLength += data.length;
    })
    .on('complete', ()=>
    {
      const zipPath = Cache_File_Name[0];
      if( existsSync(zipPath)    && 
          statSync(zipPath).size >  0)
      {
        const UnzipDir:string  = "d:/temp/";
        let zip = new AdmZip(zipPath);
        let zipEntries = zip.getEntries(); 
        let len = zipEntries.length;

        zipEntries.forEach((zipEntry:any,index:number) => 
        {
          if ( zipEntry == null ) 
          {
            return;
          }
          const entryPath = UnzipDir + '/t/' + zipEntry.entryName;
          if ( zipEntry.isDirectory )
          {
            this.hasFileUnzip( entryPath );
            return;
          }
    
          let path = dirname( entryPath );
          //unzip entry....
          zip.extractEntryToAsync(zipEntry, path , true, true, (err:any) =>
          {
            if ( err != undefined )
            {
              console.log(err);
            }
            this.hasFileUnzip( entryPath );
          });
        });
        //this.downinfo.bunzipping = false;
      }
    })
    .on('error', (err:any) =>
    {
      console.log(err);
    })
    .on('pipe', (req:any) =>
    {
    })
    .pipe(createWriteStream(Cache_File_Name[0]));
  }

  /**
   * 
   */
  private hasFileUnzip(path:string)
  {
    this.downinfo.curunzipfiles.push(path);
    this.$nextTick().then((vue:any)=>
    {
      let ele:any = document.getElementById('unzipfilelist');
      ele.scrollTop = ele.scrollHeight;
    });

  }

  /**
   * 
   */
  public onclick_test = _.throttle( ()=>
  {
    console.log(`11`);
    this.downinfo.bunzipping = true;
    this.downinfo.contentLength  = 0;
    this.downinfo.downloadLength = 0;
    this.downinfo.curunzipfiles  = [];
    this.biz_unzip();
  }, 500);

  /**
   * 启动应用防抖
   */
  public onclick_startup =_.throttle( ()=>
  {
    ipcRenderer.send('emp_ontray',true);
    shell.openItem('D:/UE4Deloy/WindowsNoEditor/BJ_3DDesignAPP.exe');

  },500);
}
