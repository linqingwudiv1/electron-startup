
import {join} from 'path';
import net from 'net';
import { dialog,MessageBoxReturnValue } from 'electron';
import GMPMethod from './GMPMethod';
const PipeServerName = join('\\\\.\\pipe','\\my_pipe');

let bQuiting = false;
let server:net.Server|null = null;

export function InitPipeServer()
{
  if (server != null)
  {
    server.close();
    server = null;
  }

  server = net.createServer();
  server.listen(PipeServerName);

//#region server event 

  server.on("error", ( exception:any ) =>
  {
    console.log("server error:" + exception);
  });

  server.on('error', (err:Error) =>
  {
    console.log('pipe server error......:', err);
  });

  server.on('close', () =>
  {
    console.log('pipe server close......')
  });

//#endregion

  server.on('connection', ( connect:net.Socket ) =>
  {
    bQuiting = false;
    connect.setEncoding('binary');
    //进入托盘
    GMPMethod.SetTrayState(true);

    server!.getConnections((err:Error|null, count:number)=>
    {
      console.log('has connection.....',count );
    });

    connect.on('error', (err:Error) =>
    {
      //ipcMain.emit(`emp_ontray`, false);
      console.log('socket error:' + err);
      connect.end();
    });

    connect.on('end', () =>
    {
    });
    
    connect.on('close', (data:any) =>
    {
      console.log('client closed!');
      setTimeout(() => 
      {

        if (bQuiting != true)
        {
          dialog.showMessageBox({
            type: 'error',
            buttons: ['确认','尝试重新启动','退出'],
            title: '异常退出',
            message: ' \r\n 未知异常错误导致程序崩溃退出...... \r\n',
            //detail: '\r\n    联系XXX-XXXXXXXX \r\n'
          }).then((val:MessageBoxReturnValue)=>
          {
            switch (val.response) {
              case  0:
              {
                GMPMethod.SetTrayState(false);
                break;
              }
              case  1:
              {
                GMPMethod.StartupCP();
                break;
              }
              case  2:
              {
                process.exit();
                break;
              }
            }
          });
        }
        else 
        {
          process.exit();
          //GMPMethod.SetTrayState(false);
        }
      }, 500);

    });

    connect.on("data", (data:string) =>
    {
      switch (data) 
      {
        case 'tick\0':
          {
            console.log(' on tick......');

            let result:boolean = connect.write('resp');

            if (!result)
            {
              console.log('write responsed failed......');
            }

            break;
          }
          case 'conn\0':
          {
            console.log('on conn');
            break;
          }
          case 'quit\0':
          {
            bQuiting = true;


            break;
          }
      }
    });
  });
    
}
