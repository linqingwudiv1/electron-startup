import { GConst } from '@/Global/GConst';
import { mkdir } from 'shelljs';
import {join, dirname, resolve} from 'path';
import {existsSync, statSync} from 'fs';
import GMPApp from '@/Electron/MP/GMPApp';
import { RequestProgress } from 'request-progress-ex';
import { from } from 'linq';

const DownCache_Files:Array<string> = [];
//
for(let i = 0; i < 10; i++)
{
  DownCache_Files.push( resolve( GMPApp.SystemStore.get('CacheDir') , `${i}.zip` ) );
}

/**
 * 文件类型
 */
export enum EM_DownloadItemFileType
{
  /**
   * 
   */
  Common = 0,
  /**
   * zip,需要解压
   */
  Zip = 1
};

/**
 * 下载状态
 */
export enum EM_DownloadItemState
{
  /**
   * 
   */
  None,
  /**
   * 等待下载...
   */
  Wait,
  /**
   * 下载中...
   */
  Downloading,
  /**
   * 下载完成...
   */
  Completed,
  /**
   * 未知错误
   */
  Error
};

/**
 * 
 */
export interface IDownloadPacketInfo
{
  /**
   * 所有已处理文件..
   */
  handlefiles:Array<[string,boolean]>;
  
  /**
   * 
   */
  FileCount:number;

  /**
   * 当前请求数
   */
  curReqCount:number;

  bPause:boolean;
};

/**
 * 
 */
export class DownloadItem
{
  /**
   * 
   * @param _title 
   * @param _uri 
   * @param _type 
   */
  constructor(_title:string,_uri:string,_type:EM_DownloadItemFileType = EM_DownloadItemFileType.Common)
  {
    this.title    = _title;
    this.uri      = _uri;
    this.fileType = _type;
  }
  /** 标题 */
  title:string = '';
  
  /** 下载路径 */
  uri:string = '';

  /** 文件大小 */
  contentSize:number = 0;

  /** 已接收大小 */
  transferSize:number = 0;

  /** 当前分段数 */
  segment:number = 0;

  /** 当前分段已接受大小 */
  segment_transferSize:number = 0;

  /** 文件类型 */
  fileType:EM_DownloadItemFileType = EM_DownloadItemFileType.Common;

  /** 下载状态 */
  state:EM_DownloadItemState = EM_DownloadItemState.None;

  /** 请求列表--预留扩展多线程下载 */
  requests:Array<RequestProgress> =[];

  /** */
  public get requestsOfFailed():Array<DownloadItem>
  {
    return from(this.requests).where(x=> x.response!.statusCode !== 206).select( (x:any) => x).toArray() as Array<DownloadItem>;
  }

  /** 分段请求,当前起始的byte位置 */
  public get byte_pos_start_def():number
  {
    return this.segment * GConst.SegmentSize;
  };
  
  /** 分段请求,当前结束的byte位置 */
  public get byte_pos_end_def():number
  {
    let ret_val = ( this.segment + 1 ) * GConst.SegmentSize - 1;
    if (ret_val > this.contentSize && 
        this.contentSize != 0)
    {
      return (this.contentSize - 1);
    }
    return ret_val;
  };

  /** 是否下载完成,已接受数据大小 === 请求资源大小 */
  public get isCompleted():boolean
  {
    if (  this.contentSize  === this.transferSize && 
          this.transferSize !== 0 )
    {
      return true;
    }
    else 
    {
      return false;
    }
  }

  /** 是否有接收数据 */
  public get bRevice():boolean
  {
    let ret_result = this.transferSize > 0;
    return ret_result;
  }

  /** 文件大小，返回0 文件不存在或尚未开始下载 */
  public get fileSize():number
  {
    if ( existsSync(this.fullPath))
    {
      return statSync(this.fullPath).size;
    }
    else 
    {
      return 0;
    }
  }

  /** 在请求 **/
  public get bHasRequest():boolean
  {
    return from(this.requests).count() > 0;
  }
  
  /** 如果 绝对路径不存在则创建 */
  public get fullPath():string
  {
    let fullpath;
    switch (this.fileType) 
    {
      default:
      case EM_DownloadItemFileType.Common:
      {
        fullpath = join(GMPApp.MountedDir, this.uri);
        break;
      }
      case EM_DownloadItemFileType.Zip:
      {
        fullpath = DownCache_Files[0];
        break;
      }
    }

    let fulldir = dirname(fullpath);

    if ( !existsSync(fulldir) )
    {
      let stdout = mkdir('-p', fulldir).stdout;
    }
    
    return fullpath;
  }
};
