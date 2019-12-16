import service from '@/utils/requestServices';

export function GetVersion()
{
    return service.get('');
};

export function DownloadUpdateZip()
{
    return service.get('%E7%AE%A1%E7%90%86%E7%AB%AF.zip',
    {
        json: false
    });
}