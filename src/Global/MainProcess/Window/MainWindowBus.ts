
import { ipcMain, IpcMainEvent  } from "electron";
import GMPMethod from '@/Global/MainProcess/GMPMethod';
import {exec} from 'child_process';
import GApp from '../GApp';
export function Init_MainWindowBus()
{
    ipcMain.on('emp_ontray', (ev:IpcMainEvent, isTray:boolean)=>
    {
        GMPMethod.SetTrayState(isTray); 
    });

    ipcMain.on('emp_startup', (ev:IpcMainEvent )=>
    {
        
        GApp.childProcess = exec('D:/UE4Deloy/WindowsNoEditor/BJ_3DDesignAPP.exe', {},
        (error:any, stdout:string, stderr:string) =>
        {
        });
    });
}