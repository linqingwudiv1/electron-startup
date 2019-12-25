
/**
 * 文件类型
 */
export enum EM_DownloadItemFileType
{
  /**
   * 
   */
  Common,
  /**
   * zip,需要解压
   */
  Zip
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
export class DownloadItem
{
  constructor(_title:string,_uri:string,_type:EM_DownloadItemFileType = EM_DownloadItemFileType.Common)
  {
    this.title = _title;
    this.uri = _uri;
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
  /** 文件类型 */
  fileType:EM_DownloadItemFileType = EM_DownloadItemFileType.Common;
  /** 下载状态 */
  state:EM_DownloadItemState = EM_DownloadItemState.None;
};

/**
 * 
 */
export interface IDownloadPacketInfo
{
  /**
   * 路径和是否需要解压
   */
  DownloadDirList:Array<DownloadItem>,
  bunzipping:boolean;
  /**
   * 所有已处理文件..
   */
  handlefiles:Array<[string,boolean]>;
  FileCount:number;
};
