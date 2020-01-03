
import { ipcMain, IpcMainEvent  } from "electron";
import GMPMethod from '@/Global/MainProcess/GMPMethod';
import {exec,spawn,execFile} from 'child_process';
import {createServer} from 'net';
import GApp from '../GApp';


export function Init_MainWindowBus()
{
    ipcMain.on('emp_ontray', ( ev:IpcMainEvent, isTray:boolean ) =>
    {
        GMPMethod.SetTrayState(isTray); 
    });
    ipcMain.on('emp_startup', (ev:IpcMainEvent )=>
    {
        let server = createServer();

        GApp.childProcess = spawn('D:/UE4Deloy/WindowsNoEditor/BJ_3DDesignAPP.exe', {});

        GApp.childProcess.stdout!.on('data', (data:any) => {    
            console.log('stdout: ' + data.toString());
        });

        GApp.childProcess.stderr!.on('data', (data:any) => {
          console.log('stderr: ' + data.toString());
        });
        
        setTimeout(() => {
            console.log(GApp.childProcess!.pid);
            //GApp.childProcess!.kill();
        }, 10000);
    });
}