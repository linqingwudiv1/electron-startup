
/**
 * 一些全局常量
 */
export class GConst 
{   
    /** 启动exe路径... */
    public static readonly ProcessApp:string = "D:/UE4Deloy/WindowsNoEditor/BJShowEx.exe";
    /** http 一步下载量 (KB) */
    public static readonly SegmentSize:number = 1024   * 1024 ;

    /** 同时最大请求数...... max together request count */
    public static readonly MaxRequestCount:number = 5;

    /** API地址 */
    public static readonly BaseUrl:string = (process.env.VUE_APP_BASE_API) as string;
}