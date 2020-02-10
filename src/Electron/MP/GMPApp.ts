'use strict'

import { readFileSync, existsSync } from 'fs';
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
export default class GMPApp
{
    /** App Root Path */
    public static readonly RootDir:string = process.cwd();

    /** App Update Fit Path */
    public static readonly MountedDir:string = join( GMPApp.RootDir ,'/UE/');

    /** 系统持久化配置实例 */
    private static sysStore?:Store<SystemStore> = undefined;

    /** Get 系统持久化配置单例 */
    public static get SystemStore():Store<SystemStore>
    {
      if ( GMPApp.sysStore === undefined )
      {
        GMPApp.sysStore = new Store<SystemStore>({
          defaults: {
            CacheDir: join( GMPApp.RootDir , '/cache/')
          }
        });
      }

      return GMPApp.sysStore;
    }

    /** UE4版本号 */
    public static get UEVersion ():string
    {
      if ( existsSync('UE/version.json') )
      {
        return readFileSync( 'UE/version.json', { encoding: 'utf-8' } );
      }
      else 
      {
        return '';
      }
    }

    /**  */
    public static childProcess:ChildProcess|null = null; 
}
