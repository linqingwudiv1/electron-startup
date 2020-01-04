'use strict'
import { app, protocol, Tray, Menu } from 'electron';
import GMPMethod from '@/Global/MainProcess/GMPMethod';
import GWin from '@/Global/MainProcess/GWin';
import GApp from './Global/MainProcess/GApp';
import {exec} from 'child_process';

import net from 'net';
import path from 'path';

const isDevelopment = process.env.NODE_ENV !== 'production';
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: { secure: true, standard: true } }]);
 
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') 
  {
    app.quit();
  }
})

app.on('before-quit',()=>
{
  console.log('--------------------before-quit', GApp.childProcess != null);

  console.log('--------------------before-quit', GApp.childProcess!.pid);
  if (GApp.childProcess != null)
  {
    let cmd = `taskkill /PID ${GApp.childProcess.pid} -t -f`;
    console.log('-------------------------', cmd);
    exec(cmd);  
  }

});

app.on('activate', () => 
{
  if (GWin.MainWindow === null) 
  {
    GMPMethod.createWindow();
  }
})

app.on('ready', async () => 
{
  if ( isDevelopment && 
       !process.env.IS_TEST ) 
  {
  }

  GMPMethod.createWindow();
})

if (isDevelopment) {
  if (process.platform === 'win32') 
  { 
    process.on('message', data => 
    {
      if (data === 'graceful-exit') 
      {
        app.quit();
      } 
    });
  }
  else 
  {
    process.on('SIGTERM', () => 
    {
      app.quit();
    });
  }
}
