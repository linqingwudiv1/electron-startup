import GWin from './GWin';
import { BrowserWindow, Menu, Tray, app } from 'electron';
import { Init_MainWindowBus } from './Window/MainWindowBus';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import Store from 'electron-store';


  /**
   * 主进程的全局静态方法
   */
  export default class GMPMethod
  {
      //创建窗口
      public static createWindow ():void 
      {
          GMPMethod.createMainWindow();
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
          GMPMethod.createTrayIcon();
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
            backgroundColor: '#fffffff',
            resizable: false,
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
        
          GWin.MainWindow.on('closed', () => 
          {
            GWin.MainWindow = null;
            
          });
          GWin.MainWindow.on('minimize', ( ev:any ) =>
          {
            GMPMethod.SetTrayState(true);
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
            label: '显示 ', 
            click: () =>
            {
              GMPMethod.SetTrayState(false);
            } 
          },
          { 
            label: ' 退出 ',  
            click:() =>
            {
              app.quit();
            }
          }
        ]);
          GWin.TrayIcon.on('double-click',() =>
          {
            GMPMethod.SetTrayState(false);
          } );
        GWin.TrayIcon.setToolTip('更新启动器');
        GWin.TrayIcon.setContextMenu(contextMenu);
      }
  }