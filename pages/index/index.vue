<template>
	<view class="home-container">
		<!-- 顶部欢迎区域 -->
		<view class="welcome-section">
			<view class="welcome-content">
				<view class="user-info">
					<view class="greeting">
						<text class="greeting-text">{{getGreeting()}}</text>
						<text class="user-name">，房东</text>
					</view>
					<text class="current-date">{{getCurrentDate()}}</text>
				</view>
				<view class="weather-info" v-if="weatherData">
					<text class="weather-text">{{weatherData.temperature}}°C {{weatherData.condition}}</text>
				</view>
			</view>
		</view>

		<!-- 数据概览卡片 -->
		<view class="overview-section">
			<view class="overview-card income-card">
				<view class="card-header">
					<text class="card-title">本月收益</text>
					<view class="card-icon income-icon">
						<u-icon name="rmb-circle" color="#ff4757" size="28"></u-icon>
					</view>
				</view>
				<view class="card-content">
					<text class="card-value">￥{{overviewData.monthlyIncome || '0'}}</text>
					<text class="card-subtitle">较上月 {{overviewData.incomeChange >= 0 ? '+' : ''}}{{overviewData.incomeChange || 0}}%</text>
				</view>
			</view>

			<view class="overview-cards-grid">
				<view class="overview-card small-card">
					<view class="card-header">
						<text class="card-title">房源总数</text>
						<view class="card-icon house-icon">
							<u-icon name="home" color="#2979ff" size="24"></u-icon>
						</view>
					</view>
					<view class="card-content">
						<text class="card-value">{{overviewData.totalHouses || '0'}}</text>
						<text class="card-subtitle">已租 {{overviewData.rentedHouses || '0'}}</text>
					</view>
				</view>

				<view class="overview-card small-card">
					<view class="card-header">
						<text class="card-title">租客数量</text>
						<view class="card-icon tenant-icon">
							<u-icon name="account" color="#2ed573" size="24"></u-icon>
						</view>
					</view>
					<view class="card-content">
						<text class="card-value">{{overviewData.totalTenants || '0'}}</text>
						<text class="card-subtitle">活跃租客</text>
					</view>
				</view>
			</view>

			<view class="occupancy-rate">
				<view class="rate-header">
					<text class="rate-title">出租率</text>
					<text class="rate-value">{{overviewData.occupancyRate || '0'}}%</text>
				</view>
				<view class="progress-bar">
					<view class="progress-fill" :style="{width: overviewData.occupancyRate + '%'}"></view>
				</view>
				<view class="rate-details">
					<text class="rate-text">已出租 {{overviewData.rentedHouses || '0'}} / {{overviewData.totalHouses || '0'}}</text>
				</view>
			</view>
		</view>

		<!-- 待办事项提醒 -->
		<view class="todo-section" v-if="hasTodoItems">
			<view class="section-header">
				<text class="section-title">待办事项</text>
				<text class="section-more" @click="goToTodoList">查看全部</text>
			</view>
			<view class="todo-items">
				<view class="todo-item" v-if="todoData.pendingApplications > 0" @click="goToApplications">
					<view class="todo-icon application-icon">
						<u-icon name="file-text" color="#ff9ff3" size="20"></u-icon>
					</view>
					<view class="todo-content">
						<text class="todo-title">租赁申请</text>
						<text class="todo-desc">{{todoData.pendingApplications}} 个申请待审核</text>
					</view>
					<u-icon name="arrow-right" color="#999" size="16"></u-icon>
				</view>

				<view class="todo-item" v-if="todoData.pendingRepairs > 0" @click="goToRepairs">
					<view class="todo-icon repair-icon">
						<u-icon name="tools" color="#ffa502" size="20"></u-icon>
					</view>
					<view class="todo-content">
						<text class="todo-title">维修请求</text>
						<text class="todo-desc">{{todoData.pendingRepairs}} 个维修待处理</text>
					</view>
					<u-icon name="arrow-right" color="#999" size="16"></u-icon>
				</view>

				<view class="todo-item" v-if="todoData.expiringLeases > 0" @click="goToExpiringLeases">
					<view class="todo-icon lease-icon">
						<u-icon name="clock" color="#ff6b6b" size="20"></u-icon>
					</view>
					<view class="todo-content">
						<text class="todo-title">租约到期</text>
						<text class="todo-desc">{{todoData.expiringLeases}} 个租约即将到期</text>
					</view>
					<u-icon name="arrow-right" color="#999" size="16"></u-icon>
				</view>
			</view>
		</view>

		<!-- 快捷操作入口 -->
		<view class="quick-actions">
			<view class="section-header">
				<text class="section-title">快捷操作</text>
			</view>
			<view class="action-grid">
				<view class="action-item" @click="addHouse">
					<view class="action-icon add-icon">
						<u-icon name="plus" color="#fff" size="24"></u-icon>
					</view>
					<text class="action-text">添加房源</text>
				</view>

				<view class="action-item" @click="goToApplications">
					<view class="action-icon application-icon">
						<u-icon name="file-text" color="#fff" size="24"></u-icon>
					</view>
					<text class="action-text">租赁申请</text>
				</view>

				<view class="action-item" @click="goToRepairs">
					<view class="action-icon repair-icon">
						<u-icon name="tools" color="#fff" size="24"></u-icon>
					</view>
					<text class="action-text">维修管理</text>
				</view>

				<view class="action-item" @click="goToReports">
					<view class="action-icon report-icon">
						<u-icon name="chart" color="#fff" size="24"></u-icon>
					</view>
					<text class="action-text">收益分析</text>
				</view>
			</view>
		</view>

		<!-- 房源摘要 -->
		<view class="house-summary">
			<view class="section-header">
				<text class="section-title">房源概览</text>
				<text class="section-more" @click="goToHouseList">查看全部</text>
			</view>
			<view class="summary-filters">
				<view class="filter-item"
					v-for="filter in houseFilters"
					:key="filter.value"
					:class="{'active': currentFilter === filter.value}"
					@click="filterHouses(filter.value)">
					<text class="filter-text">{{filter.label}}</text>
					<text class="filter-count">{{filter.count}}</text>
				</view>
			</view>
			<view class="summary-list">
				<view class="summary-item" v-for="house in filteredHouses" :key="house.id" @click="editHouse(house, 3)">
					<view class="summary-item-left">
						<view class="summary-status">
							<u-tag :text="house.status===2 ? '已租' : '待租'"
								:size="mini"
								:type="house.status===2 ? 'success' : 'error'">
							</u-tag>
							<u-tag :text="house.releaseFlag===1 ? '已发布' : '未发布'"
								size="mini"
								:type="house.releaseFlag===1 ? 'success' : 'warning'">
							</u-tag>
						</view>
						<text class="summary-house-name">{{house.name || '未命名房屋'}}</text>
						<text class="summary-house-address">{{house.provinceName + house.cityName + house.areaName + house.addresInfo}}</text>
						<text class="summary-house-price">￥{{house.price}}/月</text>
					</view>
					<view class="summary-item-right">
						<s-image class="summary-house-img"
							:src="'/static/image/house.png'"
							mode="aspectFill">
						</s-image>
					</view>
				</view>
			</view>
		</view>

		<!-- 加载状态 -->
		<view class="loading-state" v-if="loading && houseList.length === 0">
			<view class="loading-content">
				<u-loading-icon mode="flower" color="#2979ff" size="28"></u-loading-icon>
				<text class="loading-text">正在加载数据...</text>
			</view>
		</view>

		<!-- 空状态 -->
		<view class="empty-state" v-if="houseList.length===0 && !loading && isLogin">
			<view class="empty-content">
				<u-empty mode="list" text="暂无房源" iconSize="80">
				</u-empty>
				<text class="empty-desc">点击右下角添加第一个房源开始管理您的房产</text>
				<u-button
					text="添加房源"
					type="primary"
					size="normal"
					@click="addHouse"
					class="empty-action-btn">
				</u-button>
			</view>
		</view>

		<!-- 未登录状态 -->
		<view class="login-state" v-if="!isLogin">
			<view class="login-content">
				<u-empty mode="list" text="请登录后查看房源信息" iconSize="80">
				</u-empty>
				<text class="login-desc">登录后即可管理您的房产和查看收益</text>
				<view class="login-btn-container">
					<u-button text="去登录" type="primary" size="normal" @click="goToLogin"></u-button>
				</view>
			</view>
		</view>

		<!-- 添加房源按钮 -->
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
				// 原有数据
				houseList: [],
				page: 1,
				pageSize: 10,
				hasMore: true,
				loading: false,
				total: 0,

				// 新增数据
				weatherData: null,
				overviewData: {
					monthlyIncome: 0,
					incomeChange: 0,
					totalHouses: 0,
					rentedHouses: 0,
					totalTenants: 0,
					occupancyRate: 0
				},
				todoData: {
					pendingApplications: 0,
					pendingRepairs: 0,
					expiringLeases: 0
				},
				currentFilter: 'all',
				houseFilters: [
					{ label: '全部', value: 'all', count: 0 },
					{ label: '已租', value: 'rented', count: 0 },
					{ label: '待租', value: 'available', count: 0 }
				]
			}
		},
		components: {
			sImage
		},
		onLoad() {
			// 模拟天气数据
			this.initWeatherData()
		},
		onShow() {
			if (this.isLogin) {
				this.refreshAllData()
			} else {
				this.houseList = []
			}
		},
		onPullDownRefresh() {
			if (this.isLogin) {
				this.refreshAllData(true)
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

			// 计算属性
			hasTodoItems() {
				return this.todoData.pendingApplications > 0 ||
					   this.todoData.pendingRepairs > 0 ||
					   this.todoData.expiringLeases > 0
			},

			filteredHouses() {
				if (this.currentFilter === 'all') {
					return this.houseList.slice(0, 3) // 只显示前3个
				} else if (this.currentFilter === 'rented') {
					return this.houseList.filter(house => house.status === 2).slice(0, 3)
				} else if (this.currentFilter === 'available') {
					return this.houseList.filter(house => house.status === 1).slice(0, 3)
				}
				return []
			}
		},
		methods: {
			// 新增方法
			async refreshAllData(isPullDownRefresh = false) {
				try {
					await Promise.all([
						this.getHouseList(0, isPullDownRefresh),
						this.getOverviewData(),
						this.getTodoData()
					])
				} catch (error) {
					console.error('刷新数据失败:', error)
					uni.showToast({
						title: '刷新失败',
						icon: 'none'
					})
				} finally {
					if (isPullDownRefresh) {
						uni.stopPullDownRefresh()
					}
				}
			},

			getGreeting() {
				const hour = new Date().getHours()
				if (hour < 6) return '凌晨好'
				if (hour < 9) return '早上好'
				if (hour < 12) return '上午好'
				if (hour < 14) return '中午好'
				if (hour < 17) return '下午好'
				if (hour < 19) return '傍晚好'
				return '晚上好'
			},

			getCurrentDate() {
				const date = new Date()
				const month = date.getMonth() + 1
				const day = date.getDate()
				const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
				const weekday = weekdays[date.getDay()]
				return `${month}月${day}日 ${weekday}`
			},

			initWeatherData() {
				// 模拟天气数据
				this.weatherData = {
					temperature: 22,
					condition: '晴朗'
				}
			},

			async getOverviewData() {
				try {
					// 模拟概览数据
					this.overviewData = {
						monthlyIncome: 12500,
						incomeChange: 8.5,
						totalHouses: this.houseList.length,
						rentedHouses: this.houseList.filter(h => h.status === 2).length,
						totalTenants: this.houseList.filter(h => h.status === 2).length,
						occupancyRate: this.houseList.length > 0
							? Math.round((this.houseList.filter(h => h.status === 2).length / this.houseList.length) * 100)
							: 0
					}

					// 更新筛选器计数
					this.houseFilters = [
						{ label: '全部', value: 'all', count: this.houseList.length },
						{ label: '已租', value: 'rented', count: this.houseList.filter(h => h.status === 2).length },
						{ label: '待租', value: 'available', count: this.houseList.filter(h => h.status === 1).length }
					]
				} catch (error) {
					console.error('获取概览数据失败:', error)
				}
			},

			async getTodoData() {
				try {
					// 模拟待办数据
					this.todoData = {
						pendingApplications: 3,
						pendingRepairs: 1,
						expiringLeases: 2
					}
				} catch (error) {
					console.error('获取待办数据失败:', error)
				}
			},

			filterHouses(filter) {
				this.currentFilter = filter
			},

			// 导航方法
			goToTodoList() {
				this.showDevelopmentTip('待办事项')
			},

			goToApplications() {
				uni.navigateTo({
					url: '/house_pages/house/leaseApplication'
				})
			},

			goToRepairs() {
				uni.navigateTo({
					url: '/house_pages/house/maintenanceList'
				})
			},

			goToExpiringLeases() {
				this.showDevelopmentTip('租约管理')
			},

			goToReports() {
				this.showDevelopmentTip('收益分析')
			},

			showDevelopmentTip(featureName) {
				uni.showModal({
					title: '功能提示',
					content: `${featureName}功能正在开发中，敬请期待！`,
					showCancel: false,
					confirmText: '知道了',
					confirmColor: '#2979ff'
				})
			},

			goToHouseList() {
				// 滚动到房源概览区域
				uni.pageScrollTo({
					selector: '.house-summary',
					duration: 300
				})
			},

			// 原有方法
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

						// 更新概览数据
						this.getOverviewData();
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
				if (!this.isLogin) {
					this.goToLogin();
					return;
				}
				uni.navigateTo({
					url: `/house_pages/house/add?id=${data.id}&type=${type}`
				})
			},
			tenants(data, type) {
				if (!this.isLogin) {
					this.goToLogin();
					return;
				}
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
				if (!this.isLogin) {
					this.goToLogin();
					return;
				}
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
			},
			goToLogin() {
				uni.navigateTo({
					url: '/pages/login/login'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.home-container {
		width: 100%;
		min-height: 100vh;
		background-color: #f5f5f5;
		box-sizing: border-box;
		padding-bottom: 120rpx;

		// 通用变量
		$primary-color: #2979ff;
		$success-color: #2ed573;
		$warning-color: #ffa502;
		$error-color: #ff4757;
		$info-color: #70a1ff;
		$text-primary: #333;
		$text-secondary: #666;
		$text-light: #999;
		$bg-color: #f5f5f5;
		$card-bg: #fff;
		$border-radius: 12rpx;
		$spacing-xs: 8rpx;
		$spacing-sm: 16rpx;
		$spacing-md: 20rpx;
		$spacing-lg: 30rpx;
		$shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);

		// 通用section样式
		.section-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: $spacing-sm;

			.section-title {
				font-size: 32rpx;
				font-weight: 600;
				color: $text-primary;
			}

			.section-more {
				font-size: 26rpx;
				color: $primary-color;
			}
		}

		// 顶部欢迎区域
		.welcome-section {
			background: linear-gradient(135deg, $primary-color, #1dceff);
			padding: $spacing-lg $spacing-md;
			color: #fff;

			.welcome-content {
				display: flex;
				justify-content: space-between;
				align-items: flex-start;

				.user-info {
					.greeting {
						.greeting-text {
							font-size: 36rpx;
							font-weight: 600;
						}

						.user-name {
							font-size: 32rpx;
							font-weight: 500;
						}
					}

					.current-date {
						display: block;
						margin-top: 8rpx;
						font-size: 26rpx;
						opacity: 0.9;
					}
				}

				.weather-info {
					.weather-text {
						font-size: 26rpx;
						opacity: 0.9;
					}
				}
			}
		}

		// 数据概览区域
		.overview-section {
			padding: $spacing-md;

			.overview-card {
				background: $card-bg;
				border-radius: $border-radius;
				padding: $spacing-md;
				margin-bottom: $spacing-sm;
				box-shadow: $shadow;

				.card-header {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: $spacing-sm;

					.card-title {
						font-size: 28rpx;
						color: $text-secondary;
					}

					.card-icon {
						width: 48rpx;
						height: 48rpx;
						border-radius: 50%;
						display: flex;
						align-items: center;
						justify-content: center;
					}

					.income-icon {
						background: rgba(255, 71, 87, 0.1);
					}

					.house-icon {
						background: rgba(41, 121, 255, 0.1);
					}

					.tenant-icon {
						background: rgba(46, 213, 115, 0.1);
					}
				}

				.card-content {
					.card-value {
						font-size: 36rpx;
						font-weight: 600;
						color: $text-primary;
						display: block;
						margin-bottom: 4rpx;
					}

					.card-subtitle {
						font-size: 24rpx;
						color: $text-light;
					}
				}

				&.income-card {
					.card-value {
						color: $error-color;
						font-size: 42rpx;
					}
				}

				&.small-card {
					.card-value {
						font-size: 32rpx;
					}
				}
			}

			.overview-cards-grid {
				display: flex;
				gap: $spacing-sm;
				margin-bottom: $spacing-sm;

				.overview-card {
					flex: 1;
					margin-bottom: 0;
				}
			}

			.occupancy-rate {
				background: $card-bg;
				border-radius: $border-radius;
				padding: $spacing-md;
				box-shadow: $shadow;

				.rate-header {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: $spacing-sm;

					.rate-title {
						font-size: 28rpx;
						color: $text-secondary;
					}

					.rate-value {
						font-size: 32rpx;
						font-weight: 600;
						color: $primary-color;
					}
				}

				.progress-bar {
					width: 100%;
					height: 12rpx;
					background: #f0f0f0;
					border-radius: 6rpx;
					overflow: hidden;
					margin-bottom: 8rpx;

					.progress-fill {
						height: 100%;
						background: linear-gradient(90deg, $primary-color, #1dceff);
						border-radius: 6rpx;
						transition: width 0.3s ease;
					}
				}

				.rate-details {
					.rate-text {
						font-size: 24rpx;
						color: $text-light;
					}
				}
			}
		}

		// 待办事项区域
		.todo-section {
			padding: 0 $spacing-md $spacing-md;

			.todo-items {
				background: $card-bg;
				border-radius: $border-radius;
				box-shadow: $shadow;
				overflow: hidden;

				.todo-item {
					display: flex;
					align-items: center;
					padding: $spacing-md;
					border-bottom: 1rpx solid #f5f5f5;

					&:last-child {
						border-bottom: none;
					}

					.todo-icon {
						width: 40rpx;
						height: 40rpx;
						border-radius: 50%;
						display: flex;
						align-items: center;
						justify-content: center;
						margin-right: $spacing-sm;
						flex-shrink: 0;
					}

					.application-icon {
						background: rgba(255, 159, 243, 0.1);
					}

					.repair-icon {
						background: rgba(255, 165, 2, 0.1);
					}

					.lease-icon {
						background: rgba(255, 107, 107, 0.1);
					}

					.todo-content {
						flex: 1;
						.todo-title {
							display: block;
							font-size: 28rpx;
							color: $text-primary;
							margin-bottom: 4rpx;
						}

						.todo-desc {
							font-size: 24rpx;
							color: $text-light;
						}
					}
				}
			}
		}

		// 快捷操作区域
		.quick-actions {
			padding: $spacing-md;

			.action-grid {
				background: $card-bg;
				border-radius: $border-radius;
				padding: $spacing-md;
				box-shadow: $shadow;
				display: grid;
				grid-template-columns: repeat(4, 1fr);
				gap: $spacing-md;

				.action-item {
					display: flex;
					flex-direction: column;
					align-items: center;
					text-align: center;
					padding: $spacing-xs;
					border-radius: 8rpx;
					transition: all 0.3s ease;
					position: relative;
					overflow: hidden;

					&::after {
						content: '';
						position: absolute;
						top: 50%;
						left: 50%;
						width: 0;
						height: 0;
						border-radius: 50%;
						background: rgba(41, 121, 255, 0.1);
						transition: all 0.3s ease;
						transform: translate(-50%, -50%);
					}

					&:active::after {
						width: 100rpx;
						height: 100rpx;
					}

					.action-icon {
						width: 80rpx;
						height: 80rpx;
						border-radius: 50%;
						display: flex;
						align-items: center;
						justify-content: center;
						margin-bottom: $spacing-xs;
						transition: transform 0.3s ease;

						&.add-icon {
							background: linear-gradient(135deg, $primary-color, #1dceff);
						}

						&.application-icon {
							background: linear-gradient(135deg, #ff9ff3, #ff6b9d);
						}

						&.repair-icon {
							background: linear-gradient(135deg, #ffa502, #ff6348);
						}

						&.report-icon {
							background: linear-gradient(135deg, #70a1ff, #5352ed);
						}
					}

					&:active .action-icon {
						transform: scale(0.95);
					}

					.action-text {
						font-size: 24rpx;
						color: $text-primary;
						transition: color 0.3s ease;
					}
				}
			}
		}

		// 房源摘要区域
		.house-summary {
			padding: 0 $spacing-md $spacing-md;

			.summary-filters {
				background: $card-bg;
				border-radius: $border-radius;
				padding: $spacing-sm;
				box-shadow: $shadow;
				display: flex;
				margin-bottom: $spacing-sm;

				.filter-item {
					flex: 1;
					display: flex;
					flex-direction: column;
					align-items: center;
					padding: $spacing-xs;
					border-radius: 8rpx;
					transition: all 0.3s ease;

					&.active {
						background: rgba(41, 121, 255, 0.1);

						.filter-text {
							color: $primary-color;
							font-weight: 500;
						}
					}

					.filter-text {
						font-size: 26rpx;
						color: $text-secondary;
						margin-bottom: 4rpx;
					}

					.filter-count {
						font-size: 24rpx;
						color: $text-light;
					}
				}
			}

			.summary-list {
				.summary-item {
					background: $card-bg;
					border-radius: $border-radius;
					padding: $spacing-md;
					margin-bottom: $spacing-sm;
					box-shadow: $shadow;
					display: flex;
					transition: all 0.3s ease;
					position: relative;
					overflow: hidden;

					&::before {
						content: '';
						position: absolute;
						top: 0;
						left: 0;
						right: 0;
						height: 0;
						background: linear-gradient(90deg, rgba(41, 121, 255, 0.1), rgba(29, 206, 255, 0.1));
						transition: height 0.3s ease;
					}

					&:active {
						transform: translateY(2rpx);
						box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.1);

						&::before {
							height: 100%;
						}
					}

					.summary-item-left {
						flex: 1;
						.summary-status {
							display: flex;
							gap: 8rpx;
							margin-bottom: 8rpx;
						}

						.summary-house-name {
							display: block;
							font-size: 30rpx;
							font-weight: 500;
							color: $text-primary;
							margin-bottom: 4rpx;
						}

						.summary-house-address {
							display: block;
							font-size: 24rpx;
							color: $text-secondary;
							margin-bottom: 4rpx;
						}

						.summary-house-price {
							font-size: 28rpx;
							color: $error-color;
							font-weight: 500;
						}
					}

					.summary-item-right {
						.summary-house-img {
							width: 120rpx;
							height: 120rpx;
							border-radius: 8rpx;
							margin-left: $spacing-sm;
							flex-shrink: 0;
							transition: transform 0.3s ease;
						}

						&:active .summary-house-img {
							transform: scale(0.98);
						}
					}
				}
			}
		}

		// 加载状态
		.loading-state {
			padding: 120rpx $spacing-md;
			display: flex;
			justify-content: center;

			.loading-content {
				display: flex;
				flex-direction: column;
				align-items: center;

				.loading-text {
					margin-top: 20rpx;
					font-size: 28rpx;
					color: $text-light;
				}
			}
		}

		// 空状态和登录状态
		.empty-state,
		.login-state {
			padding: 60rpx $spacing-md;
			display: flex;
			justify-content: center;

			.empty-content,
			.login-content {
				display: flex;
				flex-direction: column;
				align-items: center;
				text-align: center;

				.empty-desc,
				.login-desc {
					margin-top: 20rpx;
					font-size: 28rpx;
					color: $text-secondary;
					line-height: 1.5;
				}

				.empty-action-btn {
					margin-top: 40rpx;
					width: 300rpx;
					height: 88rpx;
				}
			}

			.login-btn-container {
				margin-top: 40rpx;

				::v-deep .u-button {
					width: 240rpx;
					height: 80rpx;
				}
			}
		}

		// 添加按钮
		.add-btn {
			position: fixed;
			right: 30rpx;
			bottom: 100rpx;
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
			background: linear-gradient(135deg, $primary-color, #1dceff);
			display: flex;
			align-items: center;
			justify-content: center;
			box-shadow: 0 4rpx 12rpx rgba(41, 121, 255, 0.4);
			z-index: 100;
			transition: all 0.3s ease;

			&:active {
				transform: scale(0.95);
				box-shadow: 0 2rpx 6rpx rgba(41, 121, 255, 0.3);
			}

			&::after {
				content: '';
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				border-radius: 50%;
				background: linear-gradient(135deg, $primary-color, #1dceff);
				opacity: 0;
				transform: scale(1);
				transition: all 0.3s ease;
				z-index: -1;
			}

			&:active::after {
				opacity: 0.3;
				transform: scale(1.2);
			}
		}
	}
</style>