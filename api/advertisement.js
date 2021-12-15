import request from '@/utils/request.js';
import apiUrl from '@/api/apiUrl.js';

// app启动广告获取地址
export function Api_GetInfo() {
    return request(apiUrl.advertisement, {
        method: "get"
    });
}