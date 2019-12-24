import rp, { RequestPromiseOptions } from 'request-promise';

const options:RequestPromiseOptions = {
    baseUrl:`http://192.168.1.131:16677/`,
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