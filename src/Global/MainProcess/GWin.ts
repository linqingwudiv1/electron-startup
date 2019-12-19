import { BrowserWindow, Tray } from 'electron';

/**
 *  全局Window
 */
export default class GWin
{
    /** 主渲染Window */
    public static MainWindow:BrowserWindow|null = null;
    /** 系统托盘 */
    public static TrayIcon:Tray|null = null;
}
