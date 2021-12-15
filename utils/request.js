import Config from '@/api/apiUrl.js'
import Request from './luch-request/request.js'

const http = new Request();
http.setConfig((config) => {
    config.baseUrl = Config.host; /* 根域名 */
    return config
});

http.interceptor.request((config, cancel) => {
    /* cancel 为函数，如果调用会取消本次请求。需要注意：调用cancel,本次请求的catch仍会执行。必须return config */
    // config.header = {
    //     ...config.header,
    //     a: 1
    // }
    // if (config.custom.auth) {
    //   config.header.token = 'token'
    // }
    // if (!token) { // 如果token不存在，调用cancel 会取消本次请求，但是该函数的catch() 仍会执行
    //     cancel('token 不存在', config) //  把修改后的config传入，之后响应就可以拿到修改后的config。 如果调用了cancel但是不传修改后的config，则catch((err) => {}) err.config 为request拦截器修改之前的config
    // }
    return config;
});

http.interceptor.response((response) => {
    // 返回统一处理
    if (response.data.statusCode === 500) {
       /* uni.showToast({
            icon: 'none',
            title: '服务器错误',
            duration: 2000
        });*/
    } else if (response.data.statusCode === 501) {
    } else if (response.data.statusCode === 401) {

        // 清空 缓存
        uni.removeStorageSync("user-token");
        uni.removeStorageSync("userInfo");

        uni.showToast({
            icon:'none',
            title: '请先登录',
            duration: 2000
        });

        // 跳转登录
        setTimeout(function(){
            uni.navigateTo({
                url: '/pages/login/login'
            });
        }, 1000);
    } else {
        // 正常返回
        return response.data;
    }
}, (response) => {
    /*  对响应错误做点什么 （statusCode !== 200），必须return response*/
    uni.showToast({
        icon: 'none',
        title: '服务器连接错误',
        duration: 2000
    });
    return response
});

const request = function (url, option) {
    url = Config.baseUrl + url;
    const newOptions = {
        timeout: 60000,
        url,
        ...option
    };

    const method = newOptions.method.toLowerCase();
    if (newOptions.header || !uni.getStorageSync('user-token')) {
        newOptions.header = {
            ...newOptions.header,
        };
    } else {
        let token = '';
        if (uni.getStorageSync('user-token')) {
            token = 'Bearer ' + uni.getStorageSync('user-token');
        }
        newOptions.header = {
            ...newOptions.header,
            'Authorization': token
        };
    }

    if (
        method === 'post' ||
        method === 'put' ||
        method === 'patch' ||
        method === 'delete'
    ) {
        newOptions.data = newOptions.params;
        newOptions.method = 'post';
        newOptions.params = {
            _method: method
        }
    } else {
        // get 请求增加手机客户端标识
        try {
            if (newOptions.params) {
                newOptions.params['clientId'] = plus.push.getClientInfo().clientid;
            } else {
                newOptions.params = {
                    clientId: plus.push.getClientInfo().clientid
                }
            }
        } catch (e) {
        }
    }

    return new Promise((resolve, reject) => {
        return http.request(newOptions).then(i => {
            resolve(i)
        }).catch(e => {
            reject(e)
        });
    });
};

export default request
