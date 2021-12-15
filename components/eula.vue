<template>
    <view>
        <!-- 第一次操作提示框 -->
        <view class="share" v-if="info.dialogVisible" :class="shareClass">
            <view class="mask"></view>
            <view class="layer">
				<view class="title">
					<text class="title1">用户行为规范</text>
				</view>
				<view class="content">
                    <text class="content-txt">
                        一、信息内容规范
                        1 本条所述信息内容是指用户使用源点信用平台及服务过程中所制作、复制、发布、传播的任何内容，包括但不限于帐号头像、名字、用户说明、简介等注册信息，或发送的文字、语音、图片、视频、图文等信息和相关链接页面，以及其他使用帐号或功能帐号或本软件及服务所产生的内容。
                        2 你理解并同意，源点信用一直致力于为用户提供文明健康、规范有序的网络环境，你不得利用帐号或本软件及服务制作、复制、发布、传播如下干扰源点信用正常运营，以及侵犯其他用户或第三方合法权益的内容，包括但不限于：
                        2.1 发布、传送、传播、储存违反国家法律法规禁止的内容：
                        （1）违反宪法确定的基本原则的；
                        （2）危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；
                        （3）损害国家荣誉和利益的；
                        （4）煽动民族仇恨、民族歧视，破坏民族团结的；
                        （5）破坏国家宗教政策，宣扬邪教和封建迷信的；
                        （6）散布谣言，扰乱社会秩序，破坏社会稳定的；
                        （7）散布淫秽、色情、赌博、暴力、恐怖或者教唆犯罪的；
                        （8）侮辱或者诽谤他人，侵害他人合法权益的；
                        （9）煽动非法集会、结社、游行、示威、聚众扰乱社会秩序；
                        （10）以非法民间组织名义活动的；
                        （11）不符合《即时通信工具公众信息服务发展管理暂行规定》及遵守法律法规、社会主义制度、国家利益、公民合法利益、公共秩序、社会道德风尚和信息真实性等“七条底线”要求的；
                        （12）含有法律、行政法规禁止的其他内容的。
                        2.2 发布、传送、传播、储存侵害他人名誉权、肖像权、知识产权、商业秘密等合法权利的内容；
                        2.3 涉及他人隐私、个人信息或资料的；
                        2.4 发表、传送、传播骚扰、广告信息、过度营销信息及垃圾信息或含有任何性或性暗示的；
                        2.5 其他违反法律法规、政策及公序良俗、社会公德或干扰源点信用正常运营和侵犯其他用户或第三方合法权益内容的信息。

                        二、服务运营规范
                        除非法律允许或源点信用书面许可，你使用本服务过程中不得从事下列行为：
                        1 提交、发布虚假信息，或冒充、利用他人名义的；
                        2 诱导其他用户点击链接页面或分享信息的；
                        3 虚构事实、隐瞒真相以误导、欺骗他人的；
                        4 侵害他人名誉权、肖像权、知识产权、商业秘密等合法权利的；
                        5 未经源点信用书面许可利用帐号和任何功能，以及第三方运营平台进行推广或互相推广的；
                        6 利用帐号或本软件及服务从事任何违法犯罪活动的；
                        7 制作、发布与以上行为相关的方法、工具，或对此类方法、工具进行运营或传播，无论这些行为是否为商业目的；
                        8 其他违反法律法规规定、侵犯其他用户合法权益、干扰产品正常运营或源点信用未明示授权的行为。
                        为了更好地保障用户合法权益及良好的用户体验，源点信用针对用户制定了《用户隐私协议》，该使用规范与本协议一并生效，请你认真阅读并予以遵守。

                        三、对自己行为负责
                        你充分了解并同意，你必须为自己注册帐号下的一切行为负责，包括你所发表的任何内容、评论及点赞、推荐等行为，以及由此产生的任何后果。你应对本服务中的内容自行加以判断，并承担因使用内容而引起的所有风险，包括因对内容的正确性、完整性或实用性的依赖而产生的风险。源点信用无法且不会对因前述风险而导致的任何损失或损害承担责任。

                        四、违约处理
                        1 如果源点信用发现或收到他人举报或投诉用户违反本协议约定的，源点信用有权不经通知随时对相关内容进行删除、屏蔽，并视行为情节对违规帐号处以包括但不限于警告、限制或禁止使用部分或全部功能、帐号封禁直至注销的处罚，并公告处理结果。
                        2 你理解并同意，源点信用有权依合理判断对违反有关法律法规或本协议规定的行为进行处罚，对违法违规的任何用户采取适当的法律行动，并依据法律法规保存有关信息向有关部门报告等，用户应独自承担由此而产生的一切法律责任。
                        3 你理解并同意，因你违反本协议或相关服务条款的规定，导致或产生第三方主张的任何索赔、要求或损失，你应当独立承担责任；源点信用因此遭受损失的，你也应当一并赔偿。
                    </text>
				</view>
				<view class="h1Box">
				    <text class="h1 agreeEula" @click="agreeEula">同意</text>
				    <text class="h1" @click="refuseEula">拒绝</text>
				</view>
            </view>            
        </view>

    </view>

</template>

<script>
    import {Api_AddShare} from "@/api/share.js";
    import {Api_SaveScore} from "@/api/points.js";

    export default {
        props: {
            info: {
                type: Object,
                dialogVisible: Boolean,
                default: function (e) {
                    return {
                        type: 2, // 提示类型  0:收藏 1:关注问题 2:关注专家 3:发布问题 4:发表想法
                        dialogVisible: false
                    }
                }
            }
        },
        data() {
            return {
                shareClass: ''
            }
        },
        methods: {
            agreeEula() {
                // 设置同意Eula协议
                uni.setStorageSync('eula', true);
                this.info.dialogVisible = false;
                this.$parent.commit();
            },
            refuseEula() {
                this.info.dialogVisible = false;
            },
            showEula() {
                this.info.dialogVisible = true;
            }
        }
    }
</script>

<style scoped>
    .mask {
        background-color: rgba(0, 0, 0, .5);
        position: fixed;
        width: 750rpx;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 4500;
    }
    
    .layer {
        width: 600rpx;
    	height: 900rpx;
    	margin: auto;
        position: fixed;
    	top: 200rpx;
    	left: 0;
    	right: 0;
        z-index: 5000;
        background-color: #ffffff;
        border-radius: 10rpx;
        align-items: center;
        justify-content: center;
    	flex-direction: column;
    	overflow: hidden;
    }
    
    .title {
        width: 600rpx;
    	height: 100rpx;
    	line-height: 100rpx;
    	border-top-width: 5rpx;
    	border-top-style: solid;
    	border-top-color: #D10C0B;
    	justify-content: center;
    	align-items: center;
    	text-align: center;
    }
    
    .title1 {
    	font-weight: 400;
    	font-size: 36rpx;
    	text-align: center;
    }
    
    .content {
    	height: 700rpx;
    	padding: 0 20rpx;
    	overflow-y: scroll;
    }

    .content-txt {
        font-size: 28rpx;
    }

    uni-view .content-txt{
        line-height: 28rpx !important
    }
    .h1Box {
        height: 100rpx;
    	line-height: 100rpx;
        width: 600rpx;
        display: flex;
    	flex-direction: row;
        justify-content: space-between;
        align-items: center;
    	text-align: center;
    	border-top-width: 1rpx;
    	border-top-style: solid;
    	border-top-color: #f7f7f7;
    }
    
    .h1 {
    	flex: 1;
        font-size: 32rpx;
    	color: #999;
    	text-align: center;
    }
    
    .agreeEula {
    	border-right-width: 1rpx;
    	border-right-style: solid;
    	border-right-color: #f7f7f7;
    }
</style>
