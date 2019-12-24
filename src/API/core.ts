import service from '@/utils/requestServices';
import progress from 'request-progress';


export function GetWaitDownloadList(version:string )
{
    return service.get('');
};

export function DownloadUpdateZip(path:string)
{
    return progress( service.get( encodeURI(path), { json: false } ), 
    {
        json: false
    });
}

export function DownloadUpdateZip1(path:string, start:number, end:number)
{
    return progress( service.get( encodeURI(path), 
    {
        headers: {
            'range': `bytes=${start}-${end}`
        },
        json: false 
    }) , {} );
}