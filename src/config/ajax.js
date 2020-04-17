import axios from 'axios'
import {storage} from '.';
import {pushForcibly} from '../util/history';
import {prune} from "../util/object";

const cancels = {};
const requestQueue = [];
axios.defaults.timeout = 5000;
axios.defaults.withCredentials = false;
axios.defaults.headers['content-type'] = 'application/json;charset=UTF-8';
// development  --  yarn start
// test         --  yarn run test
// production   --  yarn run build
const API_VERSION = '/api/v1';
if (process.env.NODE_ENV === 'development') {
    axios.defaults.baseURL = `http://localhost:8080`;
} else if (process.env.REACT_APP_ENV === 'production') {
    axios.defaults.baseURL = `http://stranges.org`;
}

axios.interceptors.request.use(
    config => {
        // Do something before request is sent
        const request = JSON.stringify(config.url) + JSON.stringify(config.data);
        config.cancelToken = new axios.CancelToken((cancel) => {
            cancels[request] = cancel
        });
        if (requestQueue.includes(request)) {
            cancels[request]('cancel repeat http request')
        } else {
            requestQueue.push(request)
        }

        // set Auth Http HeaderLayout
        const token = storage.getToken();
        if (token && !/\/auth\/login/.test(config.url)) {
            config.headers['authorization'] = token
        }
        return config;
    }, err => {
        // Do something with request error
        return Promise.reject(err);
    });

axios.interceptors.response.use(
    res => {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        const request = JSON.stringify(res.config.url) + JSON.stringify(res.config.data);
        // remove current request which already was handled
        requestQueue.splice(requestQueue.findIndex(item => item === request), 1)

        // server endpoint require client endpoint to update its token
        const token = res.headers['authorization'];

        if (token) {
            storage.setToken(token);
        }
        return res;
    }, err => {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        if (err.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx

            // invalid token, go to login page
            if (err.response.status === 401) {
                console.log(err);
                return;

                storage.removeToken();
                // let pathname = history.location.pathname
                pushForcibly('/login');
            }
        } else if (err.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.error(err.request);

        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error', err.message);
        }

        // empty request queue when cancel or remove current request which already was handled
        if (axios.isCancel(err)) {
            requestQueue.length = 0
        } else {
            const request = JSON.stringify(err.config.url) + JSON.stringify(err.config.data);
            requestQueue.splice(requestQueue.findIndex(item => item === request), 1)
        }
        return Promise.reject(err);
    });

const ajax = {
    request(method, {url, data, params, headers = {}, config}) {
        url = API_VERSION + url;

        return new Promise((resolve, reject) => {
            axios({
                method: method.toLowerCase(),
                url: url,
                headers: headers,
                data: prune(data),
                params: prune(params),
                ...config,
            }).then(res => {
                // pass the response object to the returned promise
                resolve(res)
            }, err => {
                if (!err.Cancel) {
                    reject(err)
                }
            }).catch(err => {
                reject(err)
            })
        })
    },
    get(options) {
        return ajax.request("get", options);
    },
    post(options) {
        return ajax.request("post", options);
    },
    put(options) {
        return ajax.request("put", options);
    },
    del(options) {
        return ajax.request("delete", options);
    },
    isCancel(err) {
        return axios.isCancel(err);
    }
};


export default ajax;
