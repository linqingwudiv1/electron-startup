
/**
 * 
 */
declare module 'request-progress'
{
    import request from "request";

    //核心
    export default function process(request:any, opt?:RequestProgressOptions):RequestProgress;

    //
    export interface RequestProgress extends request.Request
    {
        /**
         * 
         */
        progressContext:RequestProgressContext;

        /**
         * 
         * @param ev 
         * @param callback 
         */
        on(ev:string, callback:any):this;

        /**
         * 
         * @param ev 
         * @param callback 
         */
        on(ev:'response', callback:(res:request.Response) => void):this;

        /**
         * 
         * @param ev 
         * @param callback 
         */
        on(ev:'progress',   callback:(state:RequestProgressState) => void ): this;
        
        /**
         * 
         * @param ev 
         * @param callback 
         */
        on(ev:'error',      callback:(err:any) => void) : this;
        
        /**
         * 
         * @param ev 
         * @param callback 
         */
        on(ev:'end',        callback:(...args:any) => void ): this;

        /**
         * 
         * @param ev 
         * @param callback 
         */
        on(ev:'completed', callback:(...args:any) => void ): this;

        /**
         * 
         * @param ev 
         * @param callback 
         */
        on(ev:'finish', callback:(...args:any) =>void):this;
    }

    //
    export interface RequestProgressContext
    {
        //
        request:RequestProgress;
        //
        options:RequestProgressOptions;
        //
        state:RequestProgressState;
    }

    //
    export interface RequestProgressOptions
    {
        // Throttle the progress event, defaults to 1000(ms)
        throttle?:number;
        // Only start to emit after XXXms delay, defaults to 0 (ms)           
        delay?:number;
        // Length header to use, defaults is  'content-length'                    
        lengthHeader?:string;
        // Whether retain Data on the progress event of previous revice data, defaults is false
        bRetainData?:boolean ;         
    }

    export interface RequestProgressState
    {
        /**
         * Overall percent (between 0 to 1)
         */
        percent:number;
        
        /**
         * The download speed in bytes/sec
         */
        speed:number;
         
        /**
         * 
         * @total The total payload size in bytes
         * @transferred The transferred payload size in bytes
         * @previousTransfer The previousTransfer record receive data size  while previous 'progress' event in bytes
         */
        size: {
            total:number,
            transferred:number,
            previousTransfer:number
        };

        /**
         * 
         * @elapsed  The total elapsed seconds since the start (3 decimals)
         * @remaining The remaining seconds to finish (3 decimals)
         */
        time: {
            elapsed:number, 
            remaining:number
        };
        /**
         * @data the data retain Data while previous 'progress' event  if bRetainData is true
         */
        data:Buffer|[];
    }
}