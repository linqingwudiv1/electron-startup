import service from '@/utils/requestServices';

export function GetWaitDownloadList(version:string )
{
    return service.get('');
};

export function DownloadUpdateZip(path:string)
{
    //console.log(encodeURI(path));
    return service.get(encodeURI(path),
    {
        json: false
    });
}