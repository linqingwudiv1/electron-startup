//#region import  
import { Component, Vue } from'vue-property-decorator';
//import { shell } from 'electron';
const {shell} =  require('electron').remote;
import { execSync,spawnSync,spawn,exec } from 'child_process';
import shelljs,{mkdir} from 'shelljs';
import { createWriteStream, existsSync,  statSync, fstat, readFileSync, readFile, mkdirSync, stat, unlinkSync, WriteStream } from 'fs';
import { dirname,resolve,join } from 'path'; 
import { ipcRenderer, IpcRendererEvent } from 'electron';
import GApp from '@/Global/MainProcess/GApp';
import _, { delay } from 'lodash';
import { DownloadFilePartMutilple, GetWaitDownloadList } from '@/API/core';
import AdmZip from 'adm-zip-ex';
import { from } from 'linq';
import request from 'request';
// custom component
import QingProgress from '@/components/progress/index.vue';
import GameSettingDialog from '@/components/GameSettingDialog/index.vue';
import { RequestProgressState, RequestProgress } from 'request-progress-ex';
// data 
import { IDownloadPacketInfo, DownloadItem, EM_DownloadItemFileType, EM_DownloadItemState } from './data/data';

import {} from 'node-ipc';
//#endregion

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

  //
  public downinfo:IDownloadPacketInfo = 
  {
    DownloadDirList : [ /* new DownloadItem('demo.MP4','/public/demo.MP4', EM_DownloadItemFileType.Common) ,*/
                           new DownloadItem('管理端.zip',  '/管理端.zip', EM_DownloadItemFileType.Zip) ,
                        /* new DownloadItem('favicon.ico', '/favicon.ico', EM_DownloadItemFileType.Common)  ,
                           new DownloadItem('package-lock.json','/package-lock.json', EM_DownloadItemFileType.Common)  ,
                        /* new DownloadItem('1.jpg','/1.jpg', EM_DownloadItemFileType.Common)  ,
                           new DownloadItem('服装DIY.MP4','/服装DIY.MP4', EM_DownloadItemFileType.Common) */ ] ,
    handlefiles:[]      ,
    FileCount:0         ,
    curReqCount: 0      ,
    bPause: false
  };

  /** */
  mounted():void
  {

    GetWaitDownloadList(GApp.UEVersion).then( ( res:any ) =>
    {
    });
  }

  //#region 属性(property)
  
  /** 是否可启动 */
  public get bStartup():boolean
  {
    
    let count = from  ( this.downinfo.handlefiles )
                .where( x => x[1] === false)
                .count();

    let c = from (this.downinfo.DownloadDirList).where( x => x.state !== EM_DownloadItemState.Completed ).count();

    return count === 0 && c === 0;
  }

  public get bUnpacking():boolean
  {
    let ret_result = this.bStartup && this.downinfo.handlefiles.length > this.downinfo.FileCount;
    return ret_result;
  }

  /** 是否是暂停状态 */
  public get bPause():boolean
  {
    return this.downinfo.bPause;
  }
  
  public set bPause(val:boolean)
  {
    this.downinfo.DownloadDirList.forEach((item:DownloadItem) => 
    {
      item.requests.forEach( ( req:RequestProgress ) =>
      {
        if (val)
        {
          req.pause();
        }
        else 
        {
          req.resume();
        }
      });
    });

    this.downinfo.bPause = val;
  }

  /** 是否有接收数据 */
  public get bRevice():boolean
  {
    let ret_result = from(this.downinfo.DownloadDirList)
                     .where(x => x.bRevice)
                     .count() > 0;

    return ret_result;
  }

  /** 全局下载进度 */
  public get percentage_downprocess():number
  {
    let Total_downloadSize = from( this.downinfo.DownloadDirList )
                             .select( x => x.contentSize  )
                             .defaultIfEmpty(0).sum();
                             
    let Cur_downloadSize   = from( this.downinfo.DownloadDirList )
                             .select( x => x.transferSize )
                             .defaultIfEmpty(0).sum();

    let ret_val = ( Cur_downloadSize / Total_downloadSize ) * 100 ;
    
    ret_val = isNaN(ret_val) ? 0 : parseInt(ret_val.toFixed(2));

    return ret_val;
  }

  /** 安装进度 */
  public get percentage_mountprocess():number
  {
    //成功处理文件数
    let handlefilecount = from ( this.downinfo.handlefiles )
                                 .where( x => x[1] === true )
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

  //#endregion


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
    
    if( existsSync( item.fullPath ) )
    {
      unlinkSync( item.fullPath );
    }
    
    switch (item.fileType) 
    {
      case EM_DownloadItemFileType.Common:
      {
        this.download_progress(item, () => { /** */ } );
        break;
      }
      case EM_DownloadItemFileType.Zip:
      {
        this.download_progress(item, ()=> { this.unpack_zip(item); });
        break;
      }
    }
  }

//#region 这里属于逻辑处理，极少的页面交互逻辑,有时间的话可以优先解耦代码
  /**
   * 
   * @param item 
   * @param onsuccessful 
   */
  private download_progress(item:DownloadItem, onsuccessful:()=>void ):void
  {
    const fullpath = item.fullPath;
    const req = DownloadFilePartMutilple(item.uri, item.byte_pos_start_def, item.byte_pos_end_def);
    let _res:request.Response; 

    item.segment_transferSize = 0;

    req.on('response', ( res:request.Response ) =>
    {
      item.requests.push(req);
      _res = this.handle_res_event(res, item);
    })
    .on('progress', ( state:RequestProgressState ) =>
    {
      if ( !_res.isPaused() )
      {
        item.transferSize += state.size.previousTransfer;
      }
    })
    .on('error', ( error:any ) =>
    {
      this.downinfo.curReqCount--;
      this.downinfo.handlefiles.push( [ '下载失败:' + fullpath, false ] );
      item.state = EM_DownloadItemState.Error;
    })
    .on('complete', (res:request.Response) => 
    {
      item.requests.splice(item.requests.indexOf(req), 1);
      item.transferSize = item.byte_pos_end_def + 1;
      item.segment_transferSize = item.byte_pos_end_def - item.byte_pos_start_def + 1;
      if ( item.isCompleted )
      {
        this.downinfo.curReqCount--;
        this.downinfo.handlefiles.push( ['下载完成:' + fullpath, true] );
      }
      else 
      {
        item.segment++;
        this.download_progress(item, onsuccessful );
      }
    })
    .pipe( createWriteStream( fullpath, { flags: 'a+' } ) )
    .on('finish', () =>
    {
      //分段下载，isCompleted 判断不能少..
      if (item.isCompleted)
      {
        item.state = EM_DownloadItemState.Completed;
        onsuccessful();     
      }
    });
  }

  /**
   * 返回
   * @param res 
   * @param item 
   */
  private handle_res_event( res: request.Response, item: DownloadItem) {

    if (res.statusCode === 206) 
    {
      let len: number = parseInt((res.headers as any)['content-range'].match(/\/(\d*)/)[1]);
      item.state = EM_DownloadItemState.Downloading;
      item.contentSize = len;
    }
    else 
    {
      item.state = EM_DownloadItemState.Error;
      this.downinfo.curReqCount--;
    }
    return res;
  }

  private unpack_zip(item:DownloadItem)
  {
    const zipPath = item.fullPath;
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
          zip.extractEntryToAsync(zipEntry, path , true, (err:any) =>
          {
            if ( err != undefined )
            {
              console.log(err);
              this.downinfo.handlefiles.push(['解压失败(unpack completed):' + path, false]);
              return;
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

//#endregion

//#region 页面响应事件处理


  /**
   * 
   */
  public onclick_setting = _.throttle( () =>
  {
    this.$store.commit( 'ShowGameSettingDialog', true);
  });

  /**
   * 暂停下载
   */
  public onclick_pause = _.throttle( () =>
  {
    this.bPause = true;
  }, 150);

  /**
   * 继续下载
   */
  public onclick_resume = _.throttle( ()=>
  {
    this.bPause = false;
  }, 150);

  /**
   * 更新应用, 启动应用节流
   */
  public onclick_update = _.throttle( () =>
  {
    this.downinfo.FileCount    = this.downinfo.DownloadDirList.length;
    this.downinfo.handlefiles  = []   ;
    this.handlewaitdownloadlist()     ;
  }, 500);

  /**
   * 启动应用节流
   */
  public onclick_startup =_.throttle( ()=>
  {
    if ( true || this.bStartup )
    {
      ipcRenderer.send( 'emp_ontray', true);
      GApp.test = 'abcdef123456';
      ipcRenderer.send( 'emp_startup');

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

//#endregion
