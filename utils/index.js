import {Api_GetInfo} from '@/api/userCenter.js'
import {UserInfo} from '@/utils/entity/userInfo.js'
import store from '@/store'

// 时间戳格式化
export function dateFormat(timeStamp, fmt = "yyyy-MM-dd hh:mm:ss") {
    // 转换日期是，对于空的或为null的直接返回空
    if (!timeStamp || timeStamp === "NULL" || timeStamp === "null") {
        return null;
    }
    const date = new Date(timeStamp);
    const o = {
        "M+": date.getMonth() + 1, // 月份
        "d+": date.getDate(), // 日
        "h+": date.getHours(), // 小时
        "m+": date.getMinutes(), // 分
        "s+": date.getSeconds(), // 秒
        "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
        S: date.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
            RegExp.$1,
            (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
    }
    for (const k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length === 1
                    ? o[k]
                    : ("00" + o[k]).substr(("" + o[k]).length)
            );
        }
    }
    return fmt;
}

/**
 * 获取用户信息
 * @param key 属性
 * @returns {Promise<unknown>}
 */
export function getStorageUserInfo(key) {
    let userInfo = uni.getStorageSync('userInfo');
    if (null == userInfo || '' === userInfo || undefined === userInfo) {
        // 本地没有数据
        return '';
    }

    return userInfo[key];
}

/**
 * 获取用户信息
 * @param flag 是否更新用户信息
 * @returns {Promise<unknown>}
 */
export async function getUserInfo(flag) {
    let info;
    if (flag) {
        info = await promiseInfo();
    } else {
        // 从本地获取用户信息
        let userInfo = uni.getStorageSync('userInfo');
        if (null == userInfo || '' === userInfo || undefined === userInfo) {
            // 本地没有数据，重新请求接口获取用户信息
            info = await promiseInfo();
        } else {
            info = userInfo;
        }
    }
    return info;
};

/**
 * 判断字符串是否为空
 * @param str
 * @returns {boolean}
 */
export function strIsNull(str) {
    return null === str || undefined === str || '' === str;
}

/**
 * 判断数组是否为空
 * @param arr
 * @returns {boolean}
 */
export function arrIsNull(arr) {
    return null === arr || undefined === arr || [] === arr || arr.length === 0;
}

export function showScore(count) {
    if (strIsNull(count) || 0 == count) {
        return;
    }
    uni.showToast({
        title: '获得积分+' + count,
        duration: 2000,
        image: '/static/img/fa.png'
    });
}

function promiseInfo() {
    return new Promise((resolve, reject) => {
        try {
            Api_GetInfo().then(res => {
                let userInfo = new UserInfo();
                if (res.statusCode === 1) {
                    // 保存用户信息
                    userInfo = res.data;
                    userInfo.isLogin = true;
					store.dispatch('saveUserInfo', userInfo)
                } else {
                    // 未知
                    // 清空 缓存
                    uni.removeStorageSync("user-token");
                    uni.removeStorageSync("userInfo");
                    userInfo.isLogin = false;
                }
                uni.setStorageSync('userInfo', userInfo);
                resolve(userInfo);
            })
        } catch (e) {
            reject(e);
        }
    })
}

/**
 * 获取url地址中的参数
 * @param url
 * @param key
 * @returns {string | null}
 */
export function getUrlKey(url, key) {
    return (
        decodeURIComponent(
            (new RegExp('[?|&]' + key + '=' + '([^&;]+?)(&|#|;|$)').exec(
                url
            ) || [, ''])[1].replace(/\+/g, '%20')
        ) || null
    );
}

/**
 * html内容转换成text
 * 去掉html字符串中的所有标签元素
 * @param {Object} val
 */
export function html2Text (val) {
	if (strIsNull(val)) {
		return '';
	}
    return val.replace(/<[^>]+>/g,"");

}