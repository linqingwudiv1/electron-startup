import service from '@/utils/requestServices';
import progress from 'request-progress';


export function GetWaitDownloadList(version:string )
{
    return service.get('');
};

export function DownloadUpdateZip(path:string)
{
    //console.log(progress, request('http://192.168.1.131:16677/' + path));

    return progress (service.get(encodeURI(path), {json: false}), { });

    //eturn progress(service.get(encodeURI(path),
    //
    //   json: false
    //),{});
}