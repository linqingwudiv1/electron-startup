import {ipcRenderer, remote} from 'electron';

const {BrowserWindow} = remote;


 export function ElectronDragHelper(elequery:string)
 {
    let wX:number = 0;
    let wY:number = 0;
    let dragging = false;
    let Interval:any = null;
    document.querySelector(elequery)!.addEventListener('mousedown',(ev:any)=>
    {
        dragging = true;
        wX = ev.pageX;
        wY = ev.pageY;
        Interval = setInterval(()=>{
            console.log('tick ..', )
        },41);
    });

    document.body.addEventListener('mousemove',(ev:MouseEvent)=>
    {
        ev.stopPropagation();
        if (dragging) {
            let xLoc = ev.screenX - wX;
            let yLoc = ev.screenY - wY;
    
            try {
                BrowserWindow.getFocusedWindow()!.setPosition(xLoc, yLoc);
            } catch (err) {
                console.log(err);
            }
        }
    });

    document.body.addEventListener('mouseup',(ev:MouseEvent)=>
    {
        dragging = false;
        clearInterval(Interval);
    });

 }