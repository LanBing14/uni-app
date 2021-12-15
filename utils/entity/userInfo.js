export class UserInfo {
	// 用户id
	userId;
    // 是否登录
    isLogin = false;
    // 用户名
    username;
    // 手机号
    mobile;
    // 邀请码
    invitationCode;
    // 简介
    introduction;
    // 公司/地址
    company;
    // 头像
    headPicUrl;
    // 行业
    industry;
	// 是填写邀请
	beInvite;
	// 姓名
	name;
	// 性别
	gender;
	// 邮件
	email;
	// 地址
	address;
	// 联系人
	linkman;
	// 是不是专家 （1：是；0：不是）
    isExpert;
	// 是否禁言
	forbidden;
	// 警告次数
	warnCount;
    constructor() {
    }
}
