
declare namespace Electron
{
   interface IpcRenderer
   {
      /**
       * 
       * @param event 
       * @param listener 
       */
      send(event:'emp_onC', listener:(arg:string)=>void ):void;
   }
}
