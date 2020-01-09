/** */
import { ipcMain, IpcMainEvent  } from "electron";

import GMPApp from '../GMPApp';
import GMPMethod from '../GMPMethod';

export function Init_MainWindowBus()
{
    ipcMain.on('emp_ontray', ( ev:IpcMainEvent, isTray:boolean ) =>
    {
        GMPMethod.SetTrayState(isTray);
    });

    ipcMain.on('emp_startup', (ev:IpcMainEvent )=>
    {
        GMPMethod.StartupCP();
        // GApp.childProcess.stdout!.on('data', (data:any) => 
        // {
        //     console.log('stdout: ' + data.toString());
        // });

        // GApp.childProcess.stderr!.on('data', (data:any) => 
        // {
        // });
    });
}