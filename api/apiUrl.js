// 生产环境
let protocol = 'https://';
let domain = 'www.yuandiancredit.com';

// 开发环境
// let protocol = 'http://';
// let domain = '192.168.20.116:9528';

let prefix = '/api/v1';
let host = protocol + domain;
let wsUrl = 'ws://' + domain + prefix + '/message/';
let baseUrl = host + prefix;

// 分享的链接地址
let shareUrl = baseUrl + '/ydapp.html?path=';

// 网站资讯详情页路由地址
let shareNewsUrl = host + '/Detail/news/';

// 网站文章详情页路由地址
let shareTopicUrl = host + '/Detail/topic/';

// 网站百科详情页路由地址
let shareEntryUrl = host + '/Detail/entry/';

// 网站著作详情页路由地址
let shareBookDetailUrl = host + '/BookDetail/';

// 邀请好友的二维码地址
let invitationQrUrl = baseUrl + "/d_qr.png";

export default {
    host: host,
    baseUrl: baseUrl,
    wsUrl: wsUrl,
    shareUrl: shareUrl,
    shareNewsUrl: shareNewsUrl,
    shareTopicUrl: shareTopicUrl,
    shareEntryUrl: shareEntryUrl,
    shareBookDetailUrl: shareBookDetailUrl,
    invitationQrUrl: invitationQrUrl,
    userCenter: {
        userInfo: {
            uploadImg: baseUrl + '/fs/attachments/image/0',
            editHead: '/app/user/save-head-img',
            getUserInfo: '/app/user/get-info',
            editUsername:'/app/user/edit-username',
            editIntroduction:'/app/user/edit-introduction',
            editCompany: '/app/user/edit-company',
            editIndustryCode: '/app/user/edit-industry-code',
            isUsername: '/app/user/is-username',
            getShareInfo: '/app/user/get-share-info'
        },
        viewHistory: '/app/browse-history/page'
    },
    dictionary: {
        getByGroupCode: '/system/dictionaries/get-by-group-code'
    },
    // app启动广告获取地址
    advertisement: '/cms/adverts/app/getInfo'
};
