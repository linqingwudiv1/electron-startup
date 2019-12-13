import { app,BrowserWindow, Menu, Tray } from "electron";
import Init_Decompress from './ElectronEventBus/unzip';
import 
{
    createProtocol,
    installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib';
/**
 *  全局Window
 */
export class GWin
{
    public static MainWindow:BrowserWindow|null = null;
    public static TrayIcon:Tray|null = null;
}

/**
 * 
 */
export class GMethod
{
    public static createWindow ():void 
    {
        GMethod.createMainWindow();
        GMethod.createTrayIcon();
    }

    private static createMainWindow():void
    {
      // Create the browser window.
      GWin.MainWindow = new BrowserWindow(
        { 
          width: 800, 
          height: 600, 
          backgroundColor: '#fff',
          webPreferences: {
            nodeIntegration: true,
            webSecurity: false, // CORS
            nodeIntegrationInWorker: true // 开启Worker线程
          }
        });
        
        Init_Decompress();
        //Menu.setApplicationMenu(null);
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
        GWin.MainWindow.on('minimize',(ev:any)=>
        {
        });
    }

    /**
     * 
     */
    private static createTrayIcon():void
    {
      GWin.TrayIcon = new Tray('ico.jpg')
      const contextMenu = Menu.buildFromTemplate([
        { label: '显示', type: 'radio',checked: true,click:()=>
          {
            if(GWin.MainWindow != null)
            {
              GWin.MainWindow.show();
            }
          } 
        },
        { 
          label: '退出', 
          type: 'radio' 
        }
      ])

      GWin.TrayIcon.setToolTip('更新启动器');
      GWin.TrayIcon.setContextMenu(contextMenu);
    }
}

//export {GWin, GMethod};