import service from '@/utils/requestServices';
import request from 'request';
import progress from 'request-progress-ex';
import GMPApp from '@/Electron/MP/GMPApp';

//最大接受长度 256kb
const Max_Range = 256;
export function GetNeedDownloadList( )
{
    return service.get(`GetNeedDownloadList?veersion=${GMPApp.UEVersion}`, { json: true});
};

export function DownloadFile(path:string)
{
    return progress( service.get( encodeURI(path), { json: false } ), {});
}

export function DownloadFilePartMutilple(path:string, start:number, end:number)
{
    return progress( service.get(  encodeURI(path), 
    {
        headers: {
            'range': `bytes=${start}-${end}`
        } ,
        json: false 
    }), {  bRetainData :true } );
}