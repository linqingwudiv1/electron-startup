import GMPWin from './GMPWin';
import { BrowserWindow, Menu, Tray, app } from 'electron';
import { Init_MainWindowBus } from './EventBus/MainWindowBus';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import { InitPipeServer } from './NamedPipeServer';
import {exec,spawn} from 'child_process';
import GMPApp from './GMPApp';
import { GConst } from '@/Global/GConst';
  /**
   * 主进程的全局静态方法
   */
  export default class GMPMethod
  {
      //创建窗口
      public static createWindow ():void 
      {
          InitPipeServer();
          GMPMethod.createMainWindow();
      }
      
      //杀死子进程...
      public static killCP():void
      {
        console.log('--------------------before-quit', GMPApp.childProcess!.pid);
        if (GMPApp.childProcess != null)
        {
          let cmd = `taskkill /PID ${GMPApp.childProcess.pid} -t -f`;
          exec(cmd);  
        }
      }

      /**
       * 启动监听程序.....
       */
      public static StartupCP():void 
      {
        GMPApp.childProcess = spawn(GConst.ProcessApp, {} );
        console.log('pid of cp  : ', GMPApp.childProcess.pid);
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
          if (GMPWin.MainWindow != null)
          {
            GMPWin.MainWindow.setSkipTaskbar(true);
            GMPWin.MainWindow.hide();
          }

          GMPMethod.createTrayIcon();

          if (GMPWin.TrayIcon)
          {
            // GMPWin.TrayIcon.displayBalloon(
            //   {
            //     icon :undefined,
            //     title :'进入系统托盘',
            //     content :''
            //   });
          }
        }
        else 
        {
          //退出托盘状态
          if(GMPWin.MainWindow != null)
          {
            GMPWin.MainWindow.setSkipTaskbar(false);
            GMPWin.MainWindow.show();
          }
        }
        return true;
      }
  
      private static createMainWindow():void
      {
        // Create the browser window.
        GMPWin.MainWindow = new BrowserWindow(
          {
            width : 800, 
            height: 600, 
            frame: false,
            titleBarStyle: 'hidden',
            // alwaysOnTop :true,
            backgroundColor: '#fffffff',
            //resizable: false,
            icon:'./ico.jpg',
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
            GMPWin.MainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
            if (!process.env.IS_TEST)
            {
                GMPWin.MainWindow.webContents.openDevTools();
            } 
          } 
          else 
          {
            createProtocol('app');
            // Load the index.html when not in development
            GMPWin.MainWindow.loadURL('app://./index.html');
          }
        
          GMPWin.MainWindow.on('closed', (ev:any) => 
          {
            ev.preventDefault();
            GMPWin.MainWindow = null;
          });

          GMPWin.MainWindow.on('minimize', ( ev:any ) =>
          {
            console.log('on minimize.....');
            ev.preventDefault();
            GMPMethod.SetTrayState(true);
            GMPWin.MainWindow!.focus();
            ev.preventDefault();
          });
      }
  
      /**
       * 
       */
      private static createTrayIcon():void
      {
        if ( GMPWin.TrayIcon != null && 
             !GMPWin.TrayIcon.isDestroyed() )
        {
          GMPWin.TrayIcon.destroy();
          GMPWin.TrayIcon = null;
          console.log(`destory tray...`);
        }

        GMPWin.TrayIcon = new Tray('ico.jpg');
  
        const contextMenu = Menu.buildFromTemplate([
          {
            label: ' 显示 ',
            click: () =>
            {
              GMPMethod.SetTrayState(false);
            }
          },
          { 
            label: ' 退出 ',
            click: () =>
            {
              app.quit();
            }
          }
        ]);
          GMPWin.TrayIcon.on('double-click',() =>
          {
            GMPMethod.SetTrayState(false);
          } );
        GMPWin.TrayIcon.setToolTip('更新启动器');
        GMPWin.TrayIcon.setContextMenu(contextMenu);
      }
  }