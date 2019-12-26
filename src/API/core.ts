import service from '@/utils/requestServices';
import progress from 'request-progress';

//最大接受长度 256kb
const Max_Range = 256;
export function GetWaitDownloadList(version:string )
{
    return service.get('');
};

export function DownloadFile(path:string)
{
    return progress( service.get( encodeURI(path), { json: false } ), 
    {
        json: false
    });
}

export function DownloadFilePartMutilple(path:string, start:number, end:number)
{
    console.log(path, start, end);
    return progress( service.get( encodeURI(path), 
    {
        headers: {
            'range': `bytes=${start}-${end}`
        },
        json: false 
    }) , {} );
}