
declare module 'adm-zip'
{
    export default class AdmZip
    {
        /**
         * 
         * @param zipPath 
         */
        constructor( zipPath:string );
    
        /**
         * 
         */
        public getEntries():Array<ZipEntry>;
    
        /**
         * 
         * @param zipEntry 
         * @param targetPath 
         * @param maintainEntryPath 
         * @param overwrite 
         * @param callback 
         */
        public extractEntryToAsync( zipEntry:ZipEntry , 
                                    targetPath:string , 
                                    maintainEntryPath:boolean, 
                                    overwrite:boolean, 
                                    callback:(err:any)=>void):any;
    }

    export class ZipEntry
    {
        public entryName:string;
        public isDirectory:boolean;
    }
}
    
