//#region import  
import { Component, Vue } from'vue-property-decorator';
import { shell } from 'electron';
import {mkdir} from 'shelljs';
import { createWriteStream, existsSync,  statSync, fstat, readFileSync, readFile, mkdirSync, stat, unlinkSync } from 'fs';
import { dirname,resolve,join } from 'path'; 
import { ipcRenderer, IpcRendererEvent } from 'electron';
import GApp from '@/Global/MainProcess/GApp';
import _, { delay } from 'lodash';
import { DownloadFile,DownloadFilePartMutilple, GetWaitDownloadList } from '@/API/core';
import AdmZip from 'adm-zip';
import { from } from 'linq';
import request from 'request';
// custom component
import QingProgress from '@/components/progress/index.vue';
import GameSettingDialog from '@/components/GameSettingDialog/index.vue';
import { RequestProgressState, RequestProgress } from 'request-progress';
// data 
import { IDownloadPacketInfo, DownloadItem, EM_DownloadItemFileType, EM_DownloadItemState } from './data/data';
//#endregion
const DownCache_Files:Array<string> = [];
//
for(let i = 0; i < 10; i++)
{
  DownCache_Files.push( resolve( GApp.SystemStore.get('CacheDir') , `${i}.zip` ) );
}

@Component(
  {
    components:{
      'qing-progress' : QingProgress,
      'game-setting-dialog' :  GameSettingDialog
    }
  })
export default class StartupComponent extends Vue 
{
  //** *
  public AppInfo:any = {
    version: '0.1.0'
  };

  //** *
  public downinfo:IDownloadPacketInfo = 
  {
    DownloadDirList : [ /* new DownloadItem('demo.MP4','/public/demo.MP4', EM_DownloadItemFileType.Common) ,*/
                           new DownloadItem('管理端.zip','/管理端.zip', EM_DownloadItemFileType.Common) ,
                        /* new DownloadItem('favicon.ico','/favicon.ico', EM_DownloadItemFileType.Common)  ,
                           new DownloadItem('package-lock.json','/package-lock.json', EM_DownloadItemFileType.Common)  ,
                           new DownloadItem('1.jpg','/1.jpg', EM_DownloadItemFileType.Common)  ,
                           new DownloadItem('服装DIY.MP4','/服装DIY.MP4', EM_DownloadItemFileType.Common) */ ] ,
    bunzipping : false  ,
    handlefiles:[]      ,
    FileCount:0         ,
    bPause : false      ,
    curReqCount: 0
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
    let count = from  ( this.downinfo.handlefiles )
                .where( x => x[1] === false)
                .count();

    return count == 0;
  }

  /** 是否可更新 */
  public get bUpdate():boolean 
  {
    let count =  from  ( this.downinfo.DownloadDirList )
                 .where( x => x.state !== EM_DownloadItemState.Completed )
                 .count();

    return count > 0;
  }

  /** */
  public get percentage_downprocess():number
  {
    let Total_downloadSize = from( this.downinfo.DownloadDirList )
                             .select( x => x.contentSize  )
                             .defaultIfEmpty(0).sum();

    let Cur_downloadSize   = from( this.downinfo.DownloadDirList )
                             .select( x => x.transferSize )
                             .defaultIfEmpty(0).sum();
   
    let ret_val = ( Cur_downloadSize / Total_downloadSize ) * 100 ;
    
    console.log(Cur_downloadSize,Total_downloadSize, ret_val);
    ret_val = isNaN(ret_val) ? 0 : parseInt(ret_val.toFixed(2));
    return ret_val;
  }
  
  public percent_download:Array<number> = [];

  /** */
  public get percentage_mountprocess():number
  {
    //成功处理文件数
    let handlefilecount = from ( this.downinfo.handlefiles )
                                 .where( x=> x[1] === true )
                                 .count();
    
    let ret_val = ( handlefilecount / this.downinfo.FileCount) * 100;
    ret_val = isNaN(ret_val) ? 0 : parseInt(ret_val.toFixed(2));
    return ret_val;
  }

  /** */
  public get bUnzipCompleted():boolean
  {
    if ( 100 === this.percentage_mountprocess )
    {
      return true;
    }
    return false;
  }

  /**
   * 
   */
  private handlewaitdownloadlist()
  {  
    // 缓存路径不存在则创建路径
    if (!existsSync( GApp.SystemStore.get('CacheDir') ) )
    {
      let stdout = mkdir('-p', resolve( GApp.SystemStore.get('CacheDir') )).stdout;
    }
    this.downinfo.DownloadDirList.forEach( (item:DownloadItem, index:number) => 
    {
      this.reqBranch(item);
    });
  }

  /**
   * 
   * @param item 
   */
  private reqBranch(item:DownloadItem)
  {
    this.downinfo.curReqCount++;
    switch (item.fileType) 
    {
      case EM_DownloadItemFileType.Common:
      {
        if( existsSync( item.fullPath ) )
        {
          unlinkSync( item.fullPath );
        }

        this.biz_filedownload_range(item);

        break;
      }
      case EM_DownloadItemFileType.Zip:
      {
        this.biz_zipdownload(item);
        break;
      }
    }
  }

  /**
   * 下载文件/range
   * @param item HTTP路径和安装相对路径
   */
  private biz_filedownload_range( item:DownloadItem ):void
  {
    let fullpath = item.fullPath;
    let req = DownloadFilePartMutilple(item.uri, item.byte_pos_start_def, item.byte_pos_end_def);
    let _res:request.Response; 
    item.requests.push(req);
    item.segment_transferSize = 0;

    req.on('response', ( res:request.Response ) =>
    {
      _res = res;
      if( res.statusCode === 206 )
      {  
        let len:number = parseInt( ( res.headers as any )['content-range'].match(/\/(\d*)/)[1] );
        item.state = EM_DownloadItemState.Downloading;
        item.contentSize = len;
      }
      else 
      {
        item.state = EM_DownloadItemState.Error;
        this.downinfo.curReqCount--;
      }
    })
    .on('progress', ( state:RequestProgressState ) =>
    {
      console.log('progress......', req, _res.isPaused(), state, item.transferSize);

      if ( !_res.isPaused() )
      {
        item.transferSize  += state.size.previousTransfer;
      }
    })
    .on('data', ( data:Buffer ) =>
    {
      //console.log('data ----:', data.length);
    })
    .on('error', ( error:any ) =>
    {
      this.downinfo.curReqCount--;
      this.downinfo.handlefiles.push( [ '下载失败:' + fullpath, false ] );
      item.state = EM_DownloadItemState.Error;
    })
    .on('complete', (res:request.Response) => 
    {
      item.requests.slice( item.requests.indexOf(req) );
      item.transferSize = item.byte_pos_end_def + 1;
      item.segment_transferSize = item.byte_pos_end_def - item.byte_pos_start_def + 1;

      if ( item.isCompleted )
      {
        this.downinfo.curReqCount--;
        this.downinfo.handlefiles.push( ['下载完成:' + fullpath, true]);
        item.state = EM_DownloadItemState.Completed;
      }
      else
      {
        item.segment++;
        this.biz_filedownload_range(item);
      }
    })
    .pipe( createWriteStream( fullpath, { flags: 'a+' } ) );
  }

  /**
   * 下载压缩包，并解压安装
   * @param item 下载路径
   */
  private biz_zipdownload(item:DownloadItem):void
  {
    let path = item.uri;
    let _res:request.Response; 
    let req = DownloadFilePartMutilple( path , 
                                        item.byte_pos_start_def, 
                                        item.byte_pos_end_def);
    
    item.requests.push(req);
    req.on('response', ( res:request.Response ) =>
    { 
      _res = res;
      if(res.statusCode === 200)
      {
        let len:number = parseInt( ( res.headers as any )['content-length'] );
        item.contentSize = len;
        item.state = EM_DownloadItemState.Downloading;
      }
      else 
      {
        item.state = EM_DownloadItemState.Error;
      }
    })
    .on('progress', (state:RequestProgressState)=>
    {
      item.transferSize = state.size.transferred;
    })
    .on('complete', () =>
    {
      item.requests.slice( item.requests.indexOf(req) );
      item.transferSize = item.byte_pos_end_def + 1;
      item.segment_transferSize = item.byte_pos_end_def - item.byte_pos_start_def + 1;

      if (item.isCompleted)
      {
        this.downinfo.curReqCount--;
        this.unpack_zip(item);
      }
      else 
      {
        item.segment++;
        this.biz_zipdownload(item);
      }
    })
    .on('error', (err:any) =>
    {
      this.downinfo.curReqCount--;
      item.state = EM_DownloadItemState.Error;

      this.downinfo.handlefiles.push(['解压失败(unpack failured):' + path, false]);
    })
    .pipe(createWriteStream (DownCache_Files[0]) );
  }

  private unpack_zip(item:DownloadItem)
  {
    this.downinfo.curReqCount--;
    item.transferSize = item.contentSize;
    item.state = EM_DownloadItemState.Completed;
    const zipPath = DownCache_Files[0];
    this.downinfo.handlefiles.push( ['下载完成:' + zipPath, true] );

    if( existsSync(zipPath)    && 
        statSync(zipPath).size >  0 )
    {
      let zip = new AdmZip(zipPath);
      let zipEntries = zip.getEntries(); 
      let len = zipEntries.length;
      this.downinfo.FileCount += len;

      zipEntries.forEach( ( zipEntry:any, index:number ) => 
      {
        delay( () =>
        {
          if ( zipEntry == null ) 
          {
            return;
          }

          const entryPath = join( GApp.MountedDir,  zipEntry.entryName);
          
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
        }, index * 60);
      });
    }
  }

  /**
   * 
   */
  private hasFileUnzip(path:string)
  {
    this.$nextTick().then( (vue:any) =>
    {
      let ele:any = document.getElementById('unzipfilelist');
      ele.scrollTop = ele.scrollHeight;
    });
    this.downinfo.handlefiles.push(['解压完成(unpack completed):' + path, true]);
  }

  /**
   * 
   */
  public onclick_setting = _.throttle( () =>
  {
    this.$store.commit( 'ShowGameSettingDialog', true);
  });


  /**
   * 暂停更新
   */
  public onclick_pause = _.throttle( () =>
  {
    this.downinfo.DownloadDirList.forEach((item:DownloadItem) => {
      item.requests.forEach( ( req:RequestProgress )=>
      {
        req.pause();
      });
    });
  }, 100);

  public onclick_resume = _.throttle( ()=>
  {
    this.downinfo.DownloadDirList.forEach( ( item:DownloadItem ) => 
    {
      item.requests.forEach( (item:RequestProgress) =>
      {
        item.resume();
      });
    });
  }, 100);

  /**
   * 更新应用, 启动应用节流
   */
  public onclick_update = _.throttle( ()=>
  {
    this.downinfo.bunzipping = true   ;
    this.downinfo.FileCount =  this.downinfo.DownloadDirList.length;
    this.downinfo.handlefiles  = []   ;
    this.handlewaitdownloadlist()     ;
  }, 500);

  /**
   * 启动应用节流
   */
  public onclick_startup =_.throttle( ()=>
  {
    if ( this.bStartup )
    {
      ipcRenderer.send( 'emp_ontray', true);
      shell.openItem('D:/UE4Deloy/WindowsNoEditor/BJ_3DDesignAPP.exe');
    }
    else 
    {
      this.$alert(`正在更新应用..请等待(wait updating application )`, {
        confirmButtonText: '确定(confirm)',
        callback: (action:any) => {}
      });
    }
  }, 500);
}