

declare module 'request-progress'
{
    import request from "request";
    export default function process(request:any, opt:any):RequestProgress;


    interface RequestProgress extends request.Request
    {
        
        /**
         * 
         * @param ev 
         * @param callback 
         */
        on(ev:string,   callback:any):this;


        on(ev:'response', callback:(res:request.Response)=>void):this;

        /**
         * 
         * @param ev 
         * @param callback 
         */
        on(ev:'progress',   callback:(state:RequestProgressState)=>void ): this;
        
        /**
         * 
         * @param ev 
         * @param callback 
         */
        on(ev:'error',      callback:(err:any)=>void) : this;
        
        /**
         * 
         * @param ev 
         * @param callback 
         */
        on(ev:'end',        callback:()=>void ): this;

    }
    

    interface RequestProgressState
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
         */
        size:{total:number,transferred:number};

        /**
         * 
         * @elapsed  The total elapsed seconds since the start (3 decimals)
         * @remaining The remaining seconds to finish (3 decimals)
         */
        time:{elapsed:number, remaining:number};
    }
}