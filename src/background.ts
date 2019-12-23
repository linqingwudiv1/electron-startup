'use strict'
import { app, protocol, Tray, Menu } from 'electron';
import GMPMethod from '@/Global/MainProcess/GMPMethod';
import GWin from '@/Global/MainProcess/GWin';
const isDevelopment = process.env.NODE_ENV !== 'production';
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: { secure: true, standard: true } }]);
 
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') 
  {
    app.quit();
  }
})

app.on('activate', () => 
{
  if (GWin.MainWindow === null) 
  {
    GMPMethod.createWindow();
  }
})

app.on('ready', async () => 
{
  if (isDevelopment && !process.env.IS_TEST) 
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
    })
  } 
  else 
  {
    process.on('SIGTERM', () => 
    {
      app.quit();
    });
  }
}
