declare namespace Electron
{
   interface IpcRenderer
   {
      /**
       * 
       * @param event 
       * @param listener 
       */
      send(event:'emp_ontray', listener:(isTray:boolean)=>void ):void;

      send(event:'emp_startup', listener:()=>void):void;
   }
}
