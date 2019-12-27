import rp, { RequestPromiseOptions } from 'request-promise';

const options:RequestPromiseOptions = {
    baseUrl:`http://129.204.160.155:16677/`,
    qs: {
        //access_token: 'xxxxx xxxxx' // -> uri + '?access_token=xxxxx%20xxxxx'
    },
    headers: {
        //'User-Agent': 'Request-Promise'
    },
    json: true // Automatically parses the JSON string in the response
};

const service = rp.defaults(options);
export default service;