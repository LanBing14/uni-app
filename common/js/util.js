/**
 *  1分钟内	 xx秒前
 *  1小时内	 xx分钟前
 *  1天内	xx小时前
 *  大于一天小于5天	x天前
 *  大于等于5天	xx-xx（月-日）
 *  跨年份	xxxx-xx-xx
 * @param timestamp
 * @returns {void | string | *}
 */
function friendlyDate(timestamp) {
	var formats = {
		'year': '%n%',
		'month': '%n%',
		'day': '%n% 天前',
        'day1': '%n%',
		'hour': '%n% 小时前',
		'minute': '%n% 分钟前',
		'second': '%n% 秒前',
	};

	var now = Date.now();
	var seconds = Math.floor((now - timestamp) / 1000);
	var minutes = Math.floor(seconds / 60);
	var hours = Math.floor(minutes / 60);
	var days = Math.floor(hours / 24);

    var thatYear = new Date(timestamp).getFullYear();
    var thisYear = new Date().getFullYear();
	var diffType = '';
	var diffValue = 0;
	if (thatYear !=  thisYear) {
		diffType = 'year';
        diffValue = getLocalTime(timestamp);
	} else {
		if (days > 0) {
			if (days >= 5) {
				diffType = 'day1';

				diffValue = getLocalTime(timestamp, 1);
			} else {
				diffType = 'day';
				diffValue = days;
			}

		} else {
			if (hours > 0) {
				diffType = 'hour';
				diffValue = hours;
			} else {
				if (minutes > 0) {
					diffType = 'minute';
					diffValue = minutes;
				} else {
					diffType = 'second';
					diffValue = seconds <= 0 ? (seconds = 1) : seconds;
				}
			}
		}
	}
	return formats[diffType].replace('%n%', diffValue);
}

/**
 * 时间戳转为年月日
 * @param timestamp
 * @param type 1:转为MM-DD 2:转为YYYY-MM-DD HH:MI 3:转为YYYY-MM-DD HH:MI:SS
 * @returns {string}
 */
function getLocalTime(timestamp, type) {
	var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
	var Y = date.getFullYear() + '-';
	var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
	var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
	var h = date.getHours() + '';
    if (h.length === 1) {
        h = '0' + h;
    }
    h += ':';
	var m = date.getMinutes() + '';
    if (m.length === 1) {
        m = '0' + m;
    }
	var s = date.getSeconds() + '';
	if (s.length === 1) {
		s = '0' + s;
	}

	if (type == 1) {
		return M + D;
	} else if (type == 2) {
        return Y + M + D + h + m;
	} else if (type == 3) {
        return Y + M + D + h + m + ':' + s;
	}
	return Y + M + D;
}

export {
	friendlyDate,
	getLocalTime
}
