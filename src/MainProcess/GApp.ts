'use strict'
import { app,BrowserWindow, Menu, Tray } from "electron";
import Store from 'electron-store';
import Init_Decompress from './ElectronEventBus/unzip';
import 
{
    createProtocol,
    installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib';
import { join } from 'path';

import { Init_MainWindowBus } from './Window/MainWindowBus';
/**
 *  全局Window
 */
export class GWin
{
    public static MainWindow:BrowserWindow|null = null;
    public static TrayIcon:Tray|null = null;
}

type SystemStore = {
  CacheDir: string
}

/**
 * 
 */
export class GMethod
{
    public static createWindow ():void 
    {
        GMethod.createMainWindow();
        //GMethod.createTrayIcon();
    }

    /**
     * 
     */
    public static GetSystemStore():Store<SystemStore>
    {
      const store = new Store<SystemStore>({
        defaults: {
          CacheDir: process.cwd() + '/cache/'
        }
      });
      return store;
    
    }

    /**
     * 托盘
     * @param isTray true 托盘/ flase 退出托盘 
     */
    public static SetTrayState(isTray:boolean):boolean
    {
      if (isTray)
      {
        //进入托盘状态
        if (GWin.MainWindow != null)
        {
          GWin.MainWindow.setSkipTaskbar(true);
          GWin.MainWindow.hide();
        }
        GMethod.createTrayIcon();
        if (GWin.TrayIcon)
          GWin.TrayIcon.displayBalloon(
            {
              icon :undefined,
              title :'进入系统托盘',
              content :''
            });
      }
      else 
      {
        //退出托盘状态
        if(GWin.MainWindow != null)
        {
          GWin.MainWindow.show();
          GWin.MainWindow.setSkipTaskbar(false);
          if ( GWin.TrayIcon != null &&
               !GWin.TrayIcon.isDestroyed() )
          {
            GWin.TrayIcon.destroy();
            GWin.TrayIcon = null;
          }
        }
      }
      return true;
    }

    private static createMainWindow():void
    {
      // Create the browser window.
      GWin.MainWindow = new BrowserWindow(
        { 
          width: 800, 
          height: 600, 
          backgroundColor: '#fffff00',
          webPreferences: {
            nodeIntegration: true,
            webSecurity: false, // CORS
            nodeIntegrationInWorker: true // 开启Worker线程
          }
        });
        
        Init_MainWindowBus();
        Menu.setApplicationMenu(null);

        if (process.env.WEBPACK_DEV_SERVER_URL) 
        {
          // Load the url of the dev server if in development mode
          GWin.MainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
          if (!process.env.IS_TEST)
          {
              GWin.MainWindow.webContents.openDevTools();
          } 
        } 
        else 
        {
          createProtocol('app');
          // Load the index.html when not in development
          GWin.MainWindow.loadURL('app://./index.html');
        }
      
        GWin.MainWindow.on('closed', () => {
          GWin.MainWindow = null
        });
        GWin.MainWindow.on('minimize', ( ev:any ) =>
        {
          GMethod.SetTrayState(true);
          ev.preventDefault();
        });
    }

    /**
     * 
     */
    private static createTrayIcon():void
    {
      if ( GWin.TrayIcon != null && 
           GWin.TrayIcon.isDestroyed() )
      {
        GWin.TrayIcon.destroy();
        GWin.TrayIcon = null;
      }
      
      GWin.TrayIcon = new Tray('ico.jpg');

      const contextMenu = Menu.buildFromTemplate([
        { 
          label: '   显示   ', 
          click:()=>
          {
            GMethod.SetTrayState(false);
          } 
        },
        { 
          label: '   退出   ',  
          click:()=>
          {
            app.quit();
          }
        }
      ]);
        GWin.TrayIcon.on('double-click',()=>
        {
          GMethod.SetTrayState(false);
        } );
      GWin.TrayIcon.setToolTip('更新启动器');
      GWin.TrayIcon.setContextMenu(contextMenu);

    }
}

//export {GWin, GMethod};