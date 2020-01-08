
import {join} from 'path';
import net from 'net';

const PipeServerName = join('\\\\.\\pipe','\\my_pipe');
const PipeServerName2 = join('\\\\.\\pipe','\\my_pipe1');
net.createServer().listen(PipeServerName2);
let server :net.Server|null = null;
export function InitPipeServer()
{
    if (server != null)
    {
        server.close();
        server = null;
    }

    server = net.createServer();
    server.listen(PipeServerName);
    
    server.on("error",function(exception:any) 
    {
      console.log("server error:" + exception);
    });
    
    server.on('connection',(connect:net.Socket) =>
    { 
      console.log('has connection ');
      connect.setEncoding('binary');

      connect.on('error',(exception:any) =>
      {
        console.log('socket error:' + exception);
        connect.end();
      });
      
      connect.on('connect', ()=> 
      {
        console.log('has connection...');
      });
      
      //客户端关闭事件
      connect.on('close', (data:any) =>
      {
        console.log('client closed!');
      });

      connect.on("data", (data:string) =>
      {
        switch (data) 
        {
          case 'tick\0':
            {
              console.log('on tick ');
              break;
            }
            case 'conn\0':
            {
              console.log('on conn ');
              break;
            }
            case 'quit\0':
            {
              console.log('on quit ');
              break;
            }
        }

      });
    });
    
}
