<template>
	<view class="yd-up-img">
		<view class="view-list">
			<block v-for="(item, index) in viewData" :key="index">
				<view class="img-view">
					<image class="up-img" @click="previewImage(index)" :src="previewUrl(item)" mode="aspectFill" />
					<view class="up-delete" @click.stop="removeImage(index)">
						<uni-icons type="trash" size="22" color="#D21513"></uni-icons>
					</view>
				</view>
			</block>
			<view class="choose-img" @click="chooseImage" v-if="showBtn">
				<image class="img-up" src="../../static/img/faq/upload.png" mode=""></image>
			</view>
		</view>
	</view>
</template>

<script>
import uniIcons from "@/components/uni-icons/uni-icons.vue"
import { Api_UpImg } from '@/api/baseApi.js';
import apiUrl from '@/api/apiUrl.js';
export default {
	components: {
		uniIcons,
	},
	model: {
		prop: 'imgUrls',
		event: 'change'
	},
	props: {
		option:{
			type:Object,
			default:function(){
				return {
					count:6,
				}
			}
		},
		imgUrls: {
			type:Array,
			default:function(){
				return []
			}
		}
	},
	data() {
		return {
			modelData: this.imgUrls,
			viewData:[],
            showBtn: true
		};
	},
	name: 'yd-upimg',
	watch: {
		imgUrls(val) {
			this.modelData = val;
		},
		modelData(val) {
			this.$emit('change', val);
		}
	},
	methods: {
		chooseImage() {
			let _self = this;
			uni.chooseImage({
				count: _self.option.count,
				sizeType: ['compressed', 'original'],
				sourceType: ['album', 'camera'],
				success: function(fres) {
					if((fres.tempFiles.length + _self.modelData.length) > 6){
						uni.showToast({
							icon:'none',
							title: '最多上传6张',
							duration: 2000
						});
						return false;
					}

					var flag = false;
					var filePathList = [];
					fres.tempFiles.forEach(item => {
						console.info(item.size);
						// 图片上传限制大小 10MB
						if (item.size < 1024 * 1024 * 10) {
							filePathList.push(item.path);
						} else {
							flag = true;
						}
					});
					if (flag) {
						uni.showToast({
							icon:'none',
							title: '单张图片限制10MB',
							duration: 2000
						});
					}
					if (filePathList.length > 0) {
						_self.upload(filePathList);
					}
				},
				fail: function(err) {
					console.log(err);
				}
			});
		},
		upImage(paths) {
			let _self = this;
			const promises = paths.map(function(path) {
				return promisify(upload)({
					path: path,
					_self: _self
				});
			});

			uni.showLoading({
				icon:'none',
				title: '正在上传'
			});

			Promise.all(promises)
			.then(function(data) {
				data.forEach(item =>{
					_self.modelData = _self.modelData.concat(item.url);
					_self.viewData = _self.viewData.concat(item.fullUrl);
				})
				uni.hideLoading();
				if (_self.viewData.length >= 6) {
                    _self.showBtn = false;
				}
			})
			.catch(function(res) {
				uni.hideLoading();
			});
		},
		async upload(paths) {
			await this.upImage(paths)
		},
		previewUrl(url){
			return url;
		},
		previewImage(idx) {
			let preview = [];
			for (let i = 0, len = this.viewData.length; i < len; i++) {
				preview.push(this.viewData[i]);
			}
			uni.previewImage({
				current: idx,
				urls: preview
			});
		},
		removeImage(idx) {
			this.viewData.splice(idx, 1);
			this.modelData.splice(idx, 1);
            if (this.viewData.length >= 6) {
                this.showBtn = false;
            } else {
                this.showBtn = true;
			}
		},
	}
};
const promisify = api => {
	return function(options, ...params) {
		return new Promise(function(resolve, reject) {
			api(
				Object.assign({}, options, {
					success: resolve,
					fail: reject
				}),
				...params
			);
		});
	};
};
const upload = function(options) {
	let _self = options._self,
		path = options.path,
		success = options.success,
		progress = options.progress,
		fail = options.fail;

	const uploadTask = uni.uploadFile({
		url: apiUrl.userCenter.userInfo.uploadImg,
		filePath: path,
		name: 'file',
		success: function(res) {
			var data = JSON.parse(res.data);
			if (res.statusCode == 200) {
				if (success) {
					success(data.data);
				}
			} else {
				if (fail) {
					fail(data);
				}
			}
		},
		fail: function(res) {
			console.log(res);
			if (fail) {
				fail(res);
			}
		}
	});
	uploadTask.onProgressUpdate(async function(res) {

	});
};
</script>

<style scoped>

.yd-up-img {
	padding: 20rpx 24rpx;
}

.choose-img{
	width: 200rpx;
	height: 200rpx;
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	align-items: center;
	justify-content: center;
	background-color: #F7F7F7;
}
.up-img{
	width: 200rpx;
	height: 200rpx;
}
.img-up{
	width: 150rpx;
	height: 150rpx;
}
.view-list{
	display: flex;
	flex-wrap: wrap;
	flex-direction: row;
	align-items: flex-start;
}

.img-view{
	width: 200rpx;
	height: 200rpx;
	position: relative;
	margin-right: 20rpx;
	margin-bottom: 20rpx;
}
.up-delete{
	width: 60rpx;
	height: 60rpx;
	position: absolute;
	top: 0;
	right: 0;
	line-height: 1.2;
}
</style>
