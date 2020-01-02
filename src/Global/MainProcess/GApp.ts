'use strict'

import { readFileSync } from 'fs';
import {join, resolve} from 'path';
import {ChildProcess} from 'child_process';
import Store from 'electron-store';

/**
 * Electron-Store的配置内容
 */
 interface SystemStore {
    CacheDir: string;
}

/**
 *  整个App的全局变量(使用getGlobal二次封装)
 */
export default class GApp
{
    /** App Root Path */
    public static readonly RootDir:string = process.cwd() ;
    /** App Update Fit Path */
    public static readonly MountedDir:string = join( GApp.RootDir ,'/UE/');

    /** 系统持久化配置实例 */
    private static sysStore?:Store<SystemStore> = undefined;
    
    /** Get 系统持久化配置单例 */
    public static get SystemStore():Store<SystemStore>
    {
      if (GApp.sysStore == undefined)
      {
        GApp.sysStore = new Store<SystemStore>({
          defaults: {
            CacheDir: join( GApp.RootDir , '/cache/')
          }
        });
      }
      return GApp.sysStore;   
    }
    /** UE4版本号 */
    public static UEVersion:string =  readFileSync('UE/version.json', { encoding: 'utf-8' });

    /** */
    public static childProcess:ChildProcess|null = null; 
}
