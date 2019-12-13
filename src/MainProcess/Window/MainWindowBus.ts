
import { ipcMain, IpcMainEvent  } from "electron";
import { GMethod } from '../GApp';

export function Init_MainWindowBus()
{
    ipcMain.on('emp_ontray', (ev:IpcMainEvent, isTray:boolean)=>
    {
        GMethod.SetTrayState(isTray); 
    });
}