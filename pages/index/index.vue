<template>
	<view class="page-view">
		<view class="house-list">
			<view class="house-item" v-for="(hItem,hIndex) in houseList" :key="hItem.id">
				<view class="house-item-header">
					<text class="house-name">{{hItem.name || '未命名房屋'}}</text>
					<view class="house-status">
						<u-tag text="已租" v-if="hItem.status===2" size="mini" type="success"></u-tag>
						<u-tag text="待租" v-else-if="hItem.status===1" size="mini" type="error"></u-tag>
						<u-tag text="已发布" v-if="hItem.releaseFlag===1" size="mini" type="success"></u-tag>
						<u-tag text="未发布" v-else-if="hItem.releaseFlag===0" size="mini" type="error"></u-tag>
						<u-tag text="未知状态" v-else size="mini" type="warning"></u-tag>
					</view>
				</view>

				<view class="house-item-body">
					<s-image @click="previewImg(hItem)" class="house-img"
						:src="'/static/image/house.png'" mode="aspectFill">
					</s-image>
					<view class="house-info">
						<view class="info-item">
							<text class="info-label">租金：</text>
							<text class="info-value price">￥{{hItem.price}}</text>
						</view>
						<view class="info-item">
							<text class="info-label">创建时间：</text>
							<text class="info-value">{{hItem.createdAt}}</text>
						</view>
						<view class="info-item">
							<text class="info-label">地址：</text>
							<text class="info-value address">{{hItem.provinceName + hItem.cityName +hItem.areaName+hItem.addresInfo}}</text>
						</view>
					</view>
				</view>

				<view class="house-actions">
					<u-button text="查看" size="mini" type="success" @click="editHouse(hItem,3)"></u-button>
					<u-button v-if="hItem.status===2" text="租客" size="mini" type="primary" @click="tenants(hItem)"></u-button>
					<u-button v-if="hItem.status===1" text="编辑" size="mini" type="warning" @click="editHouse(hItem,2)"></u-button>
					<u-button v-if="hItem.status===1" text="删除" size="mini" type="error" @click="deleteHouse(hItem)"></u-button>
				</view>
			</view>
		</view>

		<!-- 分页状态提示 -->
		<view class="pagination-status" v-if="houseList.length > 0">
			<!-- 加载中状态 -->
			<view class="loading-more" v-if="loading">
				<u-loading-icon mode="flower" color="#2979ff"></u-loading-icon>
				<text class="loading-text">加载中...</text>
			</view>

			<!-- 加载更多按钮 -->
			<view class="load-more-btn" v-else-if="hasMore">
				<u-button text="加载更多" size="mini" type="primary" @click="loadMore"></u-button>
			</view>

			<!-- 没有更多数据 -->
			<view class="no-more-data" v-else>
				<text class="no-more-text">没有更多数据了</text>
				<text class="total-count">共 {{total}} 条记录</text>
			</view>
		</view>

		<!-- 空状态 -->
		<u-empty v-if="houseList.length===0 && !loading" mode="list" :text="isLogin?'暂无住房,点击右下角新增一个吧':'请登录后查看'">
		</u-empty>

		<view class="add-btn" v-if="isLogin" @click="addHouse">
			<u-icon size="50rpx" bold color="#fff" name="plus"></u-icon>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from "vuex"
	import sImage from "@/components/sImage/sImage.vue"
	export default {
		data() {
			return {
				houseList: [],
				page: 1,
				pageSize: 10,
				hasMore: true,
				loading: false,
				total: 0
			}
		},
		components: {
			sImage
		},
		onLoad() {

		},
		onShow() {
			if (this.isLogin) {
				this.getHouseList()
			} else {
				this.houseList = []
			}
		},
		onPullDownRefresh() {
			if (this.isLogin) {
				this.getHouseList(0, true)
			} else {
				uni.stopPullDownRefresh();
			}
		},
		onReachBottom() {
			if (this.isLogin) {
				this.loadMore();
			}
		},
		computed: {
			...mapState(['isLogin']),
		},
		methods: {
			loadMore() {
				if (this.hasMore && !this.loading) {
					this.page++;
					this.getHouseList(0, false, true);
				}
			},
			getHouseList(parentId = 0, isPullDownRefresh = false, isLoadMore = false) {
				console.log("开始获取房屋列表，parentId:", parentId);
				if (this.loading) return Promise.resolve();

				this.loading = true;

				// 如果是下拉刷新，重置分页状态
				if (isPullDownRefresh) {
					this.page = 1;
					this.hasMore = true;
					this.houseList = [];
				}

				// 如果没有更多数据，直接返回
				if (!this.hasMore && !isPullDownRefresh) {
					this.loading = false;
					return Promise.resolve();
				}

				return this.$http.request({
					url: "/api/house/select",
					method: "get",
					data: {
						parentId,
						size: this.pageSize,
						index: this.page
					}
				}).then((response) => {
					console.log("获取房屋列表响应:", response);
					const { status, data } = response;
					if (status === 1 && data) {
						const newData = data.rows || [];
						console.log("解析到的房屋数据:", newData);
						console.log("数据总量:", data.total);
						console.log("当前页码:", this.page);
						console.log("每页大小:", this.pageSize);

						// 如果是加载更多，累加数据；否则替换数据
						if (isLoadMore) {
							this.houseList = [...this.houseList, ...newData];
							console.log("加载更多后，当前房屋列表长度:", this.houseList.length);
						} else {
							this.houseList = newData;
							console.log("重置列表后，房屋列表长度:", this.houseList.length);
						}

						// 更新分页状态
						this.total = data.total || 0;
						// 基于已加载的数据量和总量判断是否还有更多数据
						const currentTotal = isLoadMore ? this.houseList.length : newData.length;
						this.hasMore = currentTotal < this.total;

						console.log("分页状态更新 - 总量:", this.total, "已加载:", currentTotal, "是否还有更多:", this.hasMore);
					} else {
						console.log("API返回状态异常或数据为空");
						this.houseList = [];
						this.hasMore = false;
					}
				}).catch((error) => {
					console.error("获取房屋列表失败:", error);

					// 检查是否是图片相关的错误，如果是则忽略图片字段
					if (error.errMsg && error.errMsg.includes("Unexpected token '/'") && error.errMsg.includes("images")) {
						console.log("检测到图片路径格式错误，尝试清理数据中的图片字段");

						// 尝试从错误响应中提取有效数据
						try {
							if (error.data && typeof error.data === 'string') {
								// 尝试修复JSON格式
								const fixedJson = error.data.replace(/"([^"]*\/images\/[^"]*)"/g, function(match, imagePath) {
									// 清理图片路径中的多余空格
									const cleanedPath = imagePath.replace(/\s*\/\s*/g, '/').trim();
									return `"${cleanedPath}"`;
								});

								const parsedData = JSON.parse(fixedJson);

								// 清理所有图片字段
								const cleanedData = parsedData.data ? parsedData.data.map(item => ({
									...item,
									firstHeadImg: null,
									headImg: []
								})) : [];

								if (isLoadMore) {
									this.houseList = [...this.houseList, ...(cleanedData || [])];
									console.log("图片错误修复后，加载更多数据，当前长度:", this.houseList.length);
								} else {
									this.houseList = cleanedData || [];
									console.log("图片错误修复后，重置数据，当前长度:", this.houseList.length);
								}
								this.hasMore = false; // 修复后的数据没有分页信息，假设没有更多
								this.total = this.houseList.length;

								uni.showToast({
									title: "数据已加载（忽略图片错误）",
									icon: "none",
									duration: 2000
								});

								return;
							}
						} catch (e) {
							console.log("自动修复失败，使用模拟数据");
						}
					}

					// 如果无法修复，使用模拟数据
					console.log("使用模拟数据用于测试");
					const mockData = [
						{
							id: 1,
							name: "测试房屋1",
							status: 1,
							releaseFlag: 1,
							price: "2000",
							createdAt: "2024-01-01",
							provinceName: "广东省",
							cityName: "深圳市",
							areaName: "南山区",
							addresInfo: "科技园路1号",
							firstHeadImg: null,
							headImg: []
						},
						{
							id: 2,
							name: "测试房屋2",
							status: 2,
							releaseFlag: 1,
							price: "3000",
							createdAt: "2024-01-02",
							provinceName: "广东省",
							cityName: "深圳市",
							areaName: "福田区",
							addresInfo: "中心路2号",
							firstHeadImg: null,
							headImg: []
						}
					];

					if (isLoadMore) {
						this.houseList = [...this.houseList, ...mockData];
						console.log("使用模拟数据，加载更多后，当前长度:", this.houseList.length);
					} else {
						this.houseList = mockData;
						console.log("使用模拟数据，重置列表后，当前长度:", this.houseList.length);
					}
					this.hasMore = false; // 模拟数据没有更多了
					this.total = mockData.length;

					// 显示友好的错误提示
					if (typeof uni !== 'undefined' && uni.showToast) {
						uni.showToast({
							title: "服务器连接失败，显示测试数据",
							icon: "none",
							duration: 3000
						});
					} else {
						alert("服务器连接失败，显示测试数据");
					}
				}).finally(() => {
					// 重置加载状态
					this.loading = false;

					if (isPullDownRefresh) {
						uni.stopPullDownRefresh();
					}
				})
			},
			addHouse() {
				uni.navigateTo({
					url: `/house_pages/house/add?pid=0&type=1&name=`
				})
			},
			editHouse(data, type) {
				uni.navigateTo({
					url: `/house_pages/house/add?id=${data.id}&type=${type}`
				})
			},
			tenants(data, type) {
				uni.navigateTo({
					url: `/tenants_pages/tenants/list?id=${data.id}&name=${data.name}`
				})
			},
			previewImg() {
				const imageUrl = '/static/image/house.png';
				console.log("预览图片:", imageUrl);
				uni.previewImage({
					urls: [imageUrl]
				});
			},
			deleteHouse({
				id
			}) {
				uni.showModal({
					title: "提示",
					content: "是否确认删除？",
					success: (res) => {
						if (res.confirm) {
							this.$http.request({
								url: "/api/house/delete",
								methods: "get",
								data: {
									id
								}
							}).then(async ({
								status
							}) => {
								// 删除后刷新数据，重置为第一页
								this.page = 1;
								this.hasMore = true;
								this.houseList = [];
								await this.getHouseList(0);
								await uni.showToast({
									icon: 'none',
									title: "删除成功！"
								})
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-view {
		width: 100%;
		min-height: 100vh;
		background-color: #f5f5f5;
		padding: 20rpx;
		box-sizing: border-box;

		.house-list {
			width: 100%;
		}

		.house-item {
			background-color: #fff;
			border-radius: 12rpx;
			margin-bottom: 20rpx;
			padding: 20rpx;
			box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);

			.house-item-header {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 16rpx;
				padding-bottom: 16rpx;
				border-bottom: 1rpx solid #eee;

				.house-name {
					font-size: 32rpx;
					font-weight: 500;
					color: #333;
				}

				.house-status {
					display: flex;
					gap: 8rpx;
				}
			}

			.house-item-body {
				display: flex;
				margin-bottom: 16rpx;

				.house-img {
					width: 160rpx;
					height: 160rpx;
					border-radius: 8rpx;
					margin-right: 16rpx;
					flex-shrink: 0;
				}

				.house-info {
					flex: 1;

					.info-item {
						display: flex;
						align-items: flex-start;
						margin-bottom: 8rpx;
						font-size: 28rpx;

						.info-label {
							color: #666;
							width: 120rpx;
							flex-shrink: 0;
						}

						.info-value {
							color: #333;
							flex: 1;

							&.price {
								color: #ff4757;
								font-weight: 500;
							}

							&.address {
								font-size: 26rpx;
								color: #666;
							}
						}
					}
				}
			}

			.house-actions {
				display: flex;
				justify-content: flex-end;
				gap: 12rpx;

				::v-deep .u-button {
					min-width: 120rpx;
				}
			}
		}

		.pagination-status {
			margin: 30rpx 0;
			padding: 20rpx;
			text-align: center;
			background-color: #fff;
			border-radius: 12rpx;

			.loading-more {
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;

				.loading-text {
					margin-top: 10rpx;
					font-size: 26rpx;
					color: #999;
				}
			}

			.load-more-btn {
				::v-deep .u-button {
					width: 200rpx;
				}
			}

			.no-more-data {
				display: flex;
				flex-direction: column;
				align-items: center;

				.no-more-text {
					font-size: 26rpx;
					color: #999;
					margin-bottom: 8rpx;
				}

				.total-count {
					font-size: 24rpx;
					color: #ccc;
				}
			}
		}

		.add-btn {
			position: fixed;
			right: 30rpx;
			bottom: 100rpx;
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
			background: linear-gradient(135deg, #2979ff, #1dceff);
			display: flex;
			align-items: center;
			justify-content: center;
			box-shadow: 0 4rpx 12rpx rgba(41, 121, 255, 0.4);
			z-index: 100;
		}
	}
</style>