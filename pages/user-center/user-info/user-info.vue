<template>
    <view class="center">
        <!-- 列表 -->
        <view class="center-list">
            <view class="center-list-item border-bottom" @click="choosePhoto()">
                <text class="list-text">头像</text>
                <view class="word">
                    <image class="tx" :src="userInfo.headPicUrl" mode=""></image>
                </view>
                <view class="navigat-arrow">
                    <uni-icons type="arrowright" color="#bdbdbd"></uni-icons>
                </view>
            </view>
            <view class="center-list-item border-bottom" @click="goDetail('edit-introduction')">
                <text class="list-text">个人简介</text>
                <text class="word">{{userInfo.introduction}}</text>
                <view class="navigat-arrow">
                    <uni-icons type="arrowright" color="#bdbdbd"></uni-icons>
                </view>
            </view>
        </view>

        <view class="center-list">
            <view class="center-list-item border-bottom">
                <text class="list-text">行业</text>
                <view>
                        <picker @change="bindPickerChange" range-key="data_name" :value="index" :range="industryList">
                            <view class="word">{{industryList[index]?industryList[index].data_name:'请选择'}}</view>
                        </picker>
                </view>
                <view class="navigat-arrow">
                    <uni-icons type="arrowright" color="#bdbdbd"></uni-icons>
                </view>
            </view>
            <view class="center-list-item" @click="goDetail('edit-company')">
                <text class="list-text">公司/单位</text>
                <text class="word">{{userInfo.company}}</text>
                <view class="navigat-arrow">
                    <uni-icons type="arrowright" color="#bdbdbd"></uni-icons>
                </view>
            </view>
        </view>

        <view class="info-percent">
            <view class="progress-box">
                <progress :percent="processInfo" activeColor="red" active stroke-width="8"/>
            </view>
            <text class="per-word">资料完整度 {{processInfo}}%</text>
        </view>

        <picture-tailor ref="pictureTailor" :pictureSrc="photoSrc" @createImg="createImg"></picture-tailor>

    </view>
</template>

<script>
    import * as utils from '@/utils/index.js';
    import pictureTailor from "../../../components/picture-tailor/pictureTailor.vue";
    import * as api from "@/api/userCenter.js";
    import apiUrl from "@/api/apiUrl.js";

    export default {
        data() {
            return {
                userInfo: {},
                processInfo: 60,
                photoSrc: "",
                industryList: [{data_name: ''}],
                index: ''
            };
        },
        components: {
            pictureTailor
        },
        onLoad() {
            this.getIndustryList();
        },
        onUnload() {
        },
        onShow() {
            this.getInfo();
        },
        methods: {
            bindPickerChange(e) {
                this.index = e.target.value;
                api.Api_editIndustryCode(this.industryList[this.index].data_code).then(res => {
                    if (res.statusCode === 1) {
                        // 修改成功
                        this.getInfo();
                        // 显示获取积分
                        utils.showScore(res.data);
                    }
                });
            },
            getIndustryList() {
                api.Api_getDictionaryList('industryGroup').then(res => {
                    // data_name data_code
                    if (res.statusCode === 1) {
                        this.industryList = res.data;
                    }
                    // 回显行业
                    let len = this.industryList.length;
                    let name = utils.getStorageUserInfo('industry');
                    for (let i = 0; i < len; i++) {
                        if (this.industryList[i].data_name === name) {
                            this.index = i;
                            break;
                        }
                    }
                })
            },
            // 获取基本信息
            getInfo() {
                this.processInfo = 60;
                // 刷新用户信息
                utils.getUserInfo(true).then(userInfo => {
                    this.userInfo = userInfo;
                    if (utils.strIsNull(userInfo.introduction)) {
                        this.userInfo.introduction = '请填写'
                    } else {
                        if (this.userInfo.introduction.length > 10) {
                            this.userInfo.introduction = this.userInfo.introduction.substring(0, 10) + '...';
                        }
                        this.processInfo += 10;
                    }
                    if (utils.strIsNull(userInfo.company)) {
                        this.userInfo.company = '请填写'
                    } else {
                        this.processInfo += 10;
                    }
                    if (!utils.strIsNull(userInfo.industry)) {
                        this.processInfo += 10;
                    }
                    if (utils.strIsNull(userInfo.headPicUrl)) {
                        this.userInfo.headPicUrl = '/static/img/demo1.png';
                    } else {
                        this.processInfo += 10;
                    }
                })
            },
            goDetail(link) {
                uni.navigateTo({
                    url: link
                });
            },
            choosePhoto() {
                uni.chooseImage({
                    count: 1,
                    sizeType: ["compressed"],
                    success: (res) => {
                        this.photoSrc = res.tempFilePaths[0];
                        this.$refs.pictureTailor.onShowPic();
						uni.setNavigationBarTitle({title: '修改头像'});
                    }
                });
            },
            createImg(e) {
                let that = this;
                uni.uploadFile({
                    url: apiUrl.userCenter.userInfo.uploadImg,
                    filePath: e,
                    name: 'file',
                    success: function (data) {
                        // upload方法返回回来的数据是string类型，所以这里要转成json对象
                        let result = JSON.parse(data.data);
                        if (result.statusCode === 1) {
                            api.Api_EditHead(result.data.url).then(returnData => {
                                // 修改成功
                                that.getInfo();
                            })
                        }
                    }
                })
            }
        },
    };
</script>

<style scoped>
    @import '../../../common/css/uCenter/uCenter.css';

    .center-list-item,
    .center {
        display: flex;
        box-sizing: border-box;
    }

    .tx {
        width: 60rpx;
        height: 60rpx;
        vertical-align: middle;
		border-radius: 200rpx;
    }

    .word {
        height: 90rpx;
        line-height: 90rpx;
        font-size: 34rpx;
        color: #ce0201;
        text-align: right;
    }

    .logout {
        margin-top: 290rpx;
        margin-left: 90rpx;
        margin-right: 90rpx;
    }

    .info-percent {
        position: absolute;
        bottom: 38rpx;
        width: 70%;
        text-align: center;
    }

    .progress-box {
        border-radius: 10rpx;
        overflow: hidden;
    }

    .per-word {
        margin-top: 32rpx;
        color: #ce0201;
        text-align: center;
        width: 100%;
    }

    .c999 {
        color: #999999;
    }
</style>
