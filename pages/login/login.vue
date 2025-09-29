<template>
	<view class="content">
		<view class="imgback">
			<view class="log-box">
				<image src="/static/logo.png" mode="scaleToFill"></image>
				<text class="text">欢迎使用房适</text>
			</view>

			<!-- 账号密码登录表单 -->
			<view class="form-box">
				<view class="input-group">
					<u--input
						placeholder="请输入手机号"
						prefixIcon="phone"
						prefixIconStyle="font-size: 22px;color: #909399"
						v-model="phone"
						border="none"
						color="#fff"
						placeholderStyle="color: rgba(255,255,255,0.7)"
						type="number"
						maxlength="11"
					></u--input>
				</view>
				<view class="input-group">
					<u--input
						placeholder="请输入密码"
						prefixIcon="lock"
						prefixIconStyle="font-size: 22px;color: #909399"
						v-model="password"
						border="none"
						color="#fff"
						placeholderStyle="color: rgba(255,255,255,0.7)"
						password
					></u--input>
				</view>
				<view class="btn-box">
					<button class="btn" @click="handleLogin">手机号登录</button>
					<!-- #ifdef MP-WEIXIN -->
					<button class="btn wechat-btn" type="default" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">微信快速登录</button>
					<!-- #endif -->
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapMutations
	} from "vuex"
	export default {
		data() {
			return {
				jsCode: "",
				phone: "",
				password: ""
			}
		},
		onLoad() {
			// #ifdef MP-WEIXIN
			uni.login({
				success: (res) => {
					this.jsCode = res.code
				}
			})
			// #endif
		},
		methods: {
			...mapMutations(["setLogin", "setUserInfo"]),
			// 手机号密码登录
			handleLogin() {
				if (!this.phone || !this.password) {
					uni.showToast({
						title: "请输入手机号和密码",
						icon: "none"
					})
					return
				}

				// 验证手机号格式
				if (!/^1[3-9]\d{9}$/.test(this.phone)) {
					uni.showToast({
						title: "请输入正确的手机号",
						icon: "none"
					})
					return
				}

				console.log("开始登录请求:", { phone: this.phone });
				this.$http.request({
					url: "/api/landlordUser/login",
					method: "post",
					data: {
						phone: this.phone,
						password: this.password
					}
				}).then(async (res) => {
					console.log("登录响应:", res);
					if (res.status === 1) {
						uni.showToast({
							title: "登录成功！",
							icon: "success"
						});
						// 存储token，适配浏览器环境
						try {
							// #ifdef H5
							localStorage.setItem("token", `Bearer ${res.data}`);
							// #endif
							// #ifndef H5
							await uni.setStorageSync("token", `Bearer ${res.data}`);
							// #endif
						} catch (e) {
							console.error("存储token失败:", e);
						}
						await this.getUserInfo()
					} else {
						console.log("登录失败，status不是1:", res);
						uni.showToast({
							title: res.message || "登录失败",
							icon: "none",
							duration: 3000
						});
					}
				}).catch((error) => {
					console.error("登录请求异常:", error);
					uni.showToast({
						title: "登录失败，请检查手机号和密码",
						icon: "none",
						duration: 3000
					})
				})
			},
			// 微信登录
			getPhoneNumber(res) {
				if (res.detail.errMsg != "getPhoneNumber:ok") {
					uni.showToast({
						title: "请授权！",
						icon: "none"
					})
					return
				} else {
					console.log("开始微信登录请求:", { code: res.detail.code });
					this.$http.request({
						url: "/api/landlordUser/loginByWx",
						method: "get",
						params: {
							code: res.detail.code,
							userType: 1,
							jsCode: this.jsCode
						}
					}).then(async (res) => {
						console.log("微信登录响应:", res);
						if (res.status === 1) {
							// 存储token，适配浏览器环境
							try {
								// #ifdef H5
								localStorage.setItem("token", `Bearer ${res.data}`);
								// #endif
								// #ifndef H5
								await uni.setStorageSync("token", `Bearer ${res.data}`);
								// #endif
							} catch (e) {
								console.log("存储token失败", e);
							}

							await this.getUserInfo()
						}
					})
				}

			},
			getUserInfo() {
				console.log("开始获取用户信息");
				return this.$http.request({
					url: "/api/landlordUser/selectById",
					method: "get",
				}).then((res) => {
					console.log("获取用户信息响应:", res);
					if (res.status === 1) {
						this.setLogin(true)
						this.setUserInfo(res.data)

						// 适配浏览器环境的红点显示
						try {
							// 有报修或租赁申请给红点
							if (
								(res.data.maintenanceLength && res.data.maintenanceLength > 0) ||
								(res.data.leaseApplicationLength && res.data.leaseApplicationLength > 0)
							) {
								if (typeof uni !== 'undefined' && uni.showTabBarRedDot) {
									uni.showTabBarRedDot({
										index: 1,
									})
								}
							} else {
								if (typeof uni !== 'undefined' && uni.hideTabBarRedDot) {
									uni.hideTabBarRedDot({
										index: 1,
									})
								}
							}
						} catch (e) {
							console.log("设置红点失败:", e);
						}
						// 跳转到上一页，适配浏览器环境
						try {
							if (typeof uni !== 'undefined') {
								let pages = getCurrentPages(); // 当前页面
								let beforePage = pages[pages.length - 2]; // 前一个页面

								if (beforePage) {
									uni.navigateBack({
										success: function() {
											beforePage.onLoad(beforePage.options); // 执行前一个页面的onLoad方法
										},
										fail: function(e) {
											uni.switchTab({
												url: '/pages/index/index'
											})
										}
									});
								} else {
									// 没有上一页，直接跳转到首页
									uni.switchTab({
										url: '/pages/index/index'
									})
								}
							} else {
								// 浏览器环境直接跳转
								window.location.href = '/pages/index/index';
							}
						} catch (e) {
							console.error("页面跳转失败:", e);
							// 如果跳转失败，尝试直接跳转到首页
							if (typeof uni !== 'undefined') {
								uni.switchTab({
									url: '/pages/index/index'
								})
							} else {
								window.location.href = '/pages/index/index';
							}
						}
					} else {
						this.setLogin(false)
					}
				}).catch((error) => {
					console.error("获取用户信息失败:", error);
					this.setLogin(false);
					uni.showToast({
						title: "获取用户信息失败",
						icon: "none",
						duration: 2000
					});
				})
			}

		}
	}
</script>

<style lang="scss" scoped>
	.content {
		width: 100%;

		.imgback {
			width: 750rpx;
			height: 100vh;
			// background: #4261ef;
			background-image: linear-gradient(135deg, #2979ff, #1dceff);
			// background: url("https://manybox.oss-cn-shanghai.aliyuncs.com/wechat/20210319161003793_logback.png") no-repeat;
			background-size: cover;
			overflow: hidden;

			.log-box {
				width: 100%;
				height: 349rpx;
				display: flex;
				align-items: center;
				flex-direction: column;
				margin-top: 202rpx;

				image {
					margin-bottom: 30rpx;
					width: 200rpx;
					height: 200rpx;
				}

				.text {
					height: 40rpx;
					font-size: 32rpx;
					font-weight: 600;
					color: #FFFFFF;
					line-height: 40rpx;
					text-align: center;
				}
			}

			.form-box {
				margin-top: 100rpx;
				padding: 0 60rpx;

				.input-group {
					margin-bottom: 30rpx;
					padding: 20rpx 0;
					border-bottom: 1px solid rgba(255, 255, 255, 0.3);
				}

				.btn-box {
					margin-top: 60rpx;

					.btn {
						width: 100%;
						height: 88rpx;
						line-height: 88rpx;
						background: #ffffff;
						text-align: center;
						border-radius: 48rpx;
						font-size: 26rpx;
						font-weight: 600;
						color: #2979ff;
						margin-bottom: 20rpx;
					}

					.wechat-btn {
						background: rgba(255, 255, 255, 0.9);
					}
				}
			}
		}
	}
</style>