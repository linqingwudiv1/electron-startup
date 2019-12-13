
import { ipcMain, IpcMainEvent  } from "electron";
import {GWin} from '@/MainProcess/GApp';
import { dirname } from 'path';
const AdmZip = require('adm-zip') ;

const UnzipDir:string  = "d:/temp/";



function Init_Decompress()
{
  ipcMain.on('emp_unzip', (ev:IpcMainEvent, zipPath:string):void =>
  {
    let zip = new AdmZip(zipPath);
    let zipEntries = zip.getEntries(); 
    let len = zipEntries.length;

    if (len > 0)
    {
      ev.reply('erp_unzip_onstart',  zipEntries.length);
    } 

    let arr_error:Array<[string, string]> = [];
    
    zipEntries.forEach((zipEntry:any,index:number) => 
    {
      if ( GWin.MainWindow == null || 
           zipEntry == null ) 
      {
        return;
      }

      if ( zipEntry.isDirectory )
      {
        ev.reply('erp_unzip_onprocess', UnzipDir + '/t/' + zipEntry.entryName, true, index, len);
        return;
      }

      let path = dirname( UnzipDir + '/t/' + zipEntry.entryName );
      //unzip entry....
      zip.extractEntryToAsync(zipEntry, path , true, true, (err:any) =>
      {
        if ( err != undefined )
        {
          console.log(err);
        }
        ev.reply('erp_unzip_onprocess', path, true, index, len);
      });
    });
    ev.reply('erp_unzip_oncomplate',arr_error);

  });
}
export default Init_Decompress;