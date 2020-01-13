import rp, { RequestPromiseOptions } from 'request-promise';
import { GConst } from '@/Global/GConst';

const options:RequestPromiseOptions = {
    baseUrl: GConst.BaseUrl,
    qs: {
        //access_token: 'xxxxx xxxxx' // -> uri + '?access_token=xxxxx%20xxxxx'
    },
    headers: {
        //'User-Agent': 'Request-Promise'
    },
    json: true, // Automatically parses the JSON string in the response
    timeout: 5000
};

const service = rp.defaults(options);
export default service;