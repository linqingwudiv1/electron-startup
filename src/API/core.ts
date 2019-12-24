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

export function DownloadUpdateZip1(path:string, step:number)
{
    return progress( service.get( encodeURI(path), { json: false } ), 
    {
        json: false,
        headers: {
        }
    });
}