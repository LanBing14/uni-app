import request from '@/utils/request.js'

export function Api_ListData(params) {
    return request("/news", {
        method: "get",
        params: params
    });
}

 

