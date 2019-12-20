import service from '@/utils/requestServices';
import progress from 'request-progress';
import request from 'request';

export function GetWaitDownloadList(version:string )
{
    return service.get('');
};

export function DownloadUpdateZip(path:string)
{
    //console.log(progress, request('http://192.168.1.131:16677/' + path));

    console.log('http://192.168.1.131:16677/' + encodeURI(path));
    return progress (request('http://192.168.1.131:16677/' + encodeURI(path)), {});

    //eturn progress(service.get(encodeURI(path),
    //
    //   json: false
    //),{});
}