//#region import  
import { Component, Vue, Prop , Mixins, Watch } from'vue-property-decorator';
//import { shell } from 'electron';
const {shell} =  require('electron').remote;
import shelljs,{mkdir} from 'shelljs';
import { createWriteStream, existsSync,  statSync, unlinkSync } from 'fs';
import { dirname,resolve,join } from 'path'; 
import { ipcRenderer, remote } from 'electron';
const { app } = remote;
import _, { delay } from 'lodash';
import { DownloadFilePartMutilple } from '@/API/core';
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
      'qing-progress' : QingProgress
    }
})
export default class UpdatorView extends Vue 
{
  //** *
  public AppInfo:any = {
    version: '0.1.0'
  };

  @Prop({default: []})
  public DownloadDirList!:Array<DownloadItem>;

  /** */
  public bInit:boolean = false;
  
  //
  public downinfo:IDownloadPacketInfo = 
  {
    handlefiles:[]       ,
    FileCount:0          ,
    curReqCount: 0       ,
    bPause: false
  };

  /** */
  mounted():void
  {
  }

  //#region http biz

  //#endregion

  //#region 属性(property)  

  public get test():string 
  {
    return GConst.BaseUrl;
  }



  /** 是否是暂停状态 */
  public get bPause():boolean
  {
    return this.downinfo.bPause;
  }
  
  public set bPause(val:boolean)
  {
    console.log('bPause....');
    this.DownloadDirList.forEach((item:DownloadItem) => 
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
    let ret_result = from(this.DownloadDirList)
                     .where(x => x.bRevice)
                     .count() > 0;

    return ret_result;
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


  /** 是否可更新 */
  public get bUpdate():boolean 
  {
    let count =  from  ( this.DownloadDirList )
                 .where( x => x.state !== EM_DownloadItemState.Completed )
                 .count();

    return count > 0;
  }

  /** */
  public get percentage_downprocess():number
  {
    let Total_downloadSize = from( this.DownloadDirList )
                             .select( x => x.contentSize  )
                             .defaultIfEmpty(0).sum();

    let Cur_downloadSize   = from( this.DownloadDirList )
                             .select( x => x.transferSize )
                             .defaultIfEmpty(0).sum();

    let ret_val = ( Cur_downloadSize / Total_downloadSize ) * 100 ;
    ret_val = isNaN(ret_val) ? 0 : parseInt(ret_val.toFixed(2));
    console.log('--------------: ',Total_downloadSize,Cur_downloadSize,ret_val );
    return ret_val;
  }
  
  public percent_download:Array<number> = [];


  /**
   * 
   */
  private handlewaitdownloadlist()
  { 
    // 缓存路径不存在则创建路径
    if ( !existsSync( GMPApp.SystemStore.get('CacheDir') ) )
    {
      let stdout = mkdir('-p', resolve( GMPApp.SystemStore.get('CacheDir') )).stdout;
    }

    this.DownloadDirList.forEach( (item:DownloadItem, index:number) => 
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
   * 分段下载....
   * @param item 
   * @param onsuccessful 
   */
  private download_progress(item:DownloadItem, onsuccessful:() => void ):void
  {
    this.downinfo.curReqCount++;
    const fullpath = item.fullPath;
    const req = DownloadFilePartMutilple(item.uri, item.byte_pos_start_def, item.byte_pos_end_def);
    let _res:request.Response; 

    item.segment_transferSize = 0;

    req.on('response', ( res:request.Response ) =>
    {
      _res = res;
      item.requests.push(req);

      /**  */
      if (res.statusCode === 206) 
      {
        let len:number = parseInt((res.headers as any)['content-range'].match(/\/(\d*)/)[1]);
        item.state = EM_DownloadItemState.Downloading;
        item.contentSize = len;
      };
    })
    .on('progress', ( state:RequestProgressState ) =>
    {
      if ( !_res.isPaused() )
      {
        item.transferSize += state.size.previousTransfer;
      }
    })
    .on('complete', (res:request.Response) => 
    {
      this.downinfo.curReqCount--;
      if (res.statusCode !== 206)
      {
        //某个分段点错误...
        this.handle_download_onfailed(_res,item);
        return;
      }

      item.requests.splice(item.requests.indexOf(req), 1);
      item.transferSize = item.byte_pos_end_def + 1;
      item.segment_transferSize = item.byte_pos_end_def - item.byte_pos_start_def + 1;

      if ( item.isCompleted )
      {
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
   * 
   * @param item 
   */
  private handle_download_onfailed( res:request.Response,item: DownloadItem )
  {
    this.downinfo.handlefiles.push( [ '下载失败:' + decodeURI(res.request.href) , false ] );
    //item.requests.splice( item.requests.indexOf( res.request as RequestProgress ), 1 );
    //res.destroy();

    item.state = EM_DownloadItemState.Error;
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

          const entryPath = join( GMPApp.MountedDir,  zipEntry.entryName);
          
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

public onclick_update = _.throttle( () =>
{
  this.downinfo.FileCount    = this.DownloadDirList.length;
  this.handlewaitdownloadlist()     ;
}, 500);

  // 暂停下载
  public onclick_pause = _.throttle( () =>
  {
    this.bPause = true;
  }, 150);


  // 继续下载
  public onclick_resume = _.throttle( ()=>
  {
    this.bPause = false;
  }, 150);


//#endregion

}

