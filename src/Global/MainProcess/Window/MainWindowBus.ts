
import { ipcMain, IpcMainEvent  } from "electron";
import GMPMethod from '@/Global/MainProcess/GMPMethod';

export function Init_MainWindowBus()
{
    ipcMain.on('emp_ontray', (ev:IpcMainEvent, isTray:boolean)=>
    {
        GMPMethod.SetTrayState(isTray); 
    });
}