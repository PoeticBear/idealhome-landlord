<template>
	<view class="page-view">
		<view class="demo-notice">
			<u-icon name="info-circle" color="#ff9900" size="28"></u-icon>
			<text class="notice-text">为了方便演示，表单中显示了默认内容</text>
		</view>
		<u--form :labelWidth='80' labelPosition="left" labelAlign="left" :model="formData" ref="formRef">
			<u-form-item label="名称：" prop="name" borderBottom>
				<u--input :disabled="pageType===3" border="none" v-model="formData.name" placeholder="请输入" :maxlength="20">
				</u--input>
			</u-form-item>
			<u-form-item label="对外租金：" prop="fakePrice" borderBottom>
				<u-input :disabled="pageType===3" v-model="formData.fakePrice" placeholder="请输入" type="digit" :maxlength="10">
					<u-tag slot="prefix" text="￥" size="mini" type="primary"></u-tag>
				</u-input>
			</u-form-item>
			<u-form-item label="实际租金：" prop="price" borderBottom>
				<u-input :disabled="pageType===3" v-model="formData.price" placeholder="请输入" type="digit" :maxlength="10">
					<u-tag slot="prefix" text="￥" size="mini" type="primary"></u-tag>
					<u--text slot="suffix" type="info" text="租客不可见"></u--text>
				</u-input>
			</u-form-item>

			<u-form-item label="图片：" prop="headImg" borderBottom>
				<u-upload :previewFullImage="true" :disabled="pageType===3" :fileList="formData.headImg"
					@afterRead="headImgAfterRead" @delete="headImgDeletePic" multiple :maxCount="9"></u-upload>
			</u-form-item>

			<u-form-item label="其他费用：" labelPosition="top" prop="waterFee" borderBottom>
				<view class="flex-item-view">
					<u-input :disabled="pageType===3" v-model="formData.waterFee" type="number" :maxlength="4">
						<u-tag slot="prefix" text="水" size="mini" type="primary"></u-tag>
						<u--text slot="suffix" type="info" text="元/吨"></u--text>
					</u-input>
					<u-input :disabled="pageType===3" v-model="formData.electricityFee" type="number" :maxlength="4">
						<u-tag slot="prefix" text="电" size="mini" type="success"></u-tag>
						<u--text slot="suffix" type="info" text="元/度"></u--text>
					</u-input>
				</view>
				<view class="flex-item-view">
					<u-input :disabled="pageType===3" v-model="formData.internetFee" type="number" :maxlength="4">
						<u-tag slot="prefix" text="网" size="mini" type="warning"></u-tag>
						<u--text slot="suffix" type="info" text="元/年"></u--text>
					</u-input>
					<u-input :disabled="pageType===3" v-model="formData.fuelFee" type="number" :maxlength="4">
						<u-tag slot="prefix" text="气" size="mini" type="error"></u-tag>
						<u--text slot="suffix" type="info" text="元/月"></u--text>
					</u-input>
				</view>
			</u-form-item>
			<u-form-item label="付款方式：" labelPosition="top" prop="depositNumber" borderBottom>
				<view class="flex-item-view">
					<u-input :disabled="pageType===3" inputAlign="right" v-model="formData.depositNumber" type="number"
						:maxlength="2">
						<u--text slot="prefix" type="info" text="押："></u--text>
						<u-tag slot="suffix" text="月" size="mini" type="primary"></u-tag>
					</u-input>
					<u-input :disabled="pageType===3" inputAlign="right" v-model="formData.priceNumber" type="number"
						:maxlength="2">
						<u--text slot="prefix" type="info" text="付："></u--text>
						<u-tag slot="suffix" text="月" size="mini" type="success"></u-tag>
					</u-input>
				</view>
			</u-form-item>
			<u-form-item label="实体信息：" labelPosition="top" borderBottom>
				<view class="flex-item-view">
					<u-input :disabled="pageType===3" inputAlign="right" v-model="formData.area" type="digit" :maxlength="10">
						<u--text slot="prefix" type="info" text="面积："></u--text>
						<u-tag slot="suffix" text="m²" size="mini" type="primary"></u-tag>
					</u-input>
					<u-input :disabled="pageType===3" inputAlign="right" v-model="formData.floor" type="digit" :maxlength="10">
						<u--text slot="prefix" type="info" text="楼层："></u--text>
						<u-tag slot="suffix" text="层" size="mini" type="success"></u-tag>
					</u-input>
				</view>
			</u-form-item>
			<u-form-item label="朝向：" prop="toward" borderBottom>
				<view v-if="pageType===3" class="df">
					<u-tag :show="formData.toward===1" text="东" type="success"></u-tag>
					<u-tag :show="formData.toward===2" text="西" type="success"></u-tag>
					<u-tag :show="formData.toward===3" text="南" type="primary"></u-tag>
					<u-tag :show="formData.toward===4" text="北" type="primary"></u-tag>
				</view>
				<u-radio-group v-if="pageType!==3" v-model="formData.toward" placement="row">
					<u-radio label="东" :name="1"></u-radio>
					<u-radio label="西" :name="2"></u-radio>
					<u-radio label="南" :name="3"></u-radio>
					<u-radio label="北" :name="4"></u-radio>
				</u-radio-group>
			</u-form-item>
			<u-form-item label="卫生间：" prop="toilet" borderBottom>
				<view v-if="pageType===3" class="df">
					<u-tag :show="formData.toilet===0" text="没有" type="error"></u-tag>
					<u-tag :show="formData.toilet===1" text="独立" type="success"></u-tag>
					<u-tag :show="formData.toilet===2" text="公用" type="primary"></u-tag>
				</view>
				<u-radio-group v-if="pageType!==3" v-model="formData.toilet" placement="row">
					<u-radio label="没有" :name="0"></u-radio>
					<u-radio label="独立" :name="1"></u-radio>
					<u-radio label="公用" :name="2"></u-radio>
				</u-radio-group>
			</u-form-item>
			<u-form-item label="厨房：" prop="kitchen" borderBottom>
				<view v-if="pageType===3" class="df">
					<u-tag :show="formData.toilet===0" text="没有" type="error"></u-tag>
					<u-tag :show="formData.kitchen===1" text="独立" type="success"></u-tag>
					<u-tag :show="formData.kitchen===2" text="公用" type="primary"></u-tag>
				</view>
				<u-radio-group v-if="pageType!==3" v-model="formData.kitchen" placement="row">
					<u-radio label="没有" :name="0"></u-radio>
					<u-radio label="独立" :name="1"></u-radio>
					<u-radio label="公用" :name="2"></u-radio>
				</u-radio-group>
			</u-form-item>
			<u-form-item label="阳台：" prop="balcony" borderBottom>
				<view v-if="pageType===3" class="df">
					<u-tag :show="formData.balcony===1" text="有" type="success"></u-tag>
					<u-tag :show="formData.balcony===0" text="无" type="error"></u-tag>
				</view>
				<u-radio-group v-if="pageType!==3" v-model="formData.balcony" placement="row">
					<u-radio label="有" :name="1"></u-radio>
					<u-radio label="无" :name="0"></u-radio>
				</u-radio-group>
			</u-form-item>
			<u-form-item label="地址：" prop="provinceName" borderBottom class="address-item">
				<u--input :disabled="pageType===3" placeholder="请输入地址" v-model="formData.provinceName" :maxlength="50">
				</u--input>
			</u-form-item>
			<u-form-item label="详情地址：" prop="addresInfo" borderBottom>
				<u--input :disabled="pageType===3" placeholder="请输入" v-model="formData.addresInfo" :maxlength="20">
				</u--input>
			</u-form-item>
			<u-form-item label="备注：" prop="note" borderBottom>
				<u--textarea :disabled="pageType===3" v-model="formData.note" :maxlength="200" placeholder="请输入内容" count>
				</u--textarea>
			</u-form-item>
		</u--form>
		<view class="btn-view">
			<u-button type="primary" :text="pageType===3?'返回':'确定'" @click="save"></u-button>
		</view>
	</view>
</template>

<script>
	import cityPicker from "@/components/cityPicker/cityPicker.vue"
	export default {
		data() {
			return {
				formData: {
					name: "阳光花园三室两厅",
					provinceId: "110000",
					provinceName: "广东省深圳市福田区沙嘴村",
					cityId: "440300",
					cityName: "深圳市",
					areaId: "440304",
					areaName: "福田区",
					addresInfo: "沙嘴村50栋102室",
					area: "120",
					price: "4500",
					fakePrice: "5000",
					longitude: "116.480717",
					latitude: "39.918429",
					depositNumber: 1,
					floor: 15,
					priceNumber: 3,
					toward: 3,
					toilet: 1,
					kitchen: 1,
					balcony: 1,
					waterFee: '5',
					electricityFee: '1.2',
					internetFee: '100',
					fuelFee: '0',
					headImg: [],
					note: "精装修，家具家电齐全，交通便利，周边生活设施完善",
					parentId: 0
				},
				pageType: 0,
				defaultCity: '',
			}
		},
		computed: {
			formRules() {
				return {
					name: [{
							required: true,
							message: '此项为必填',
							trigger: ['blur', 'change'],
						},
						{
							min: 0,
							max: 20,
							message: '文字长度在20个字符以内'
						},
					],
					fakePrice: [{
						required: true,
						type: 'float',
						message: '此项为必填',
						trigger: ['blur', 'change'],
					}],
					price: [{
						required: true,
						type: 'float',
						message: '此项为必填',
						trigger: ['blur', 'change'],
					}],
					// waterFee: [{
					// 		validator: (rule, value, callback) => {
					// 			return this.formData.waterFee !== '' && this.formData.waterFee !== null && this
					// 				.formData
					// 				.waterFee !== undefined
					// 		},
					// 		message: '请填写水费,免费请填0.'
					// 	},
					// 	{
					// 		validator: (rule, value, callback) => {
					// 			return this.formData.electricityFee !== '' && this.formData.electricityFee !==
					// 				null && this
					// 				.formData.electricityFee !==
					// 				undefined
					// 		},
					// 		message: '请填写电费,免费请填0.'
					// 	},
					// 	{
					// 		validator: (rule, value, callback) => {
					// 			return this.formData.internetFee !== '' && this.formData.internetFee !== null &&
					// 				this.formData
					// 				.internetFee !== undefined
					// 		},
					// 		message: '请填写网费,免费请填0.'
					// 	}
					// ],
					depositNumber: [{
							validator: (rule, value, callback) => {
								return this.formData.depositNumber !== '' && this.formData.depositNumber !==
									null && this
									.formData.depositNumber !== undefined
							},
							message: '请填写押金方式,无需押金请填0.'
						},
						{
							validator: (rule, value, callback) => {
								return this.formData.priceNumber !== '' && this.formData.priceNumber !== null &&
									this.formData
									.priceNumber !== undefined
							},
							message: '请填写一次付租月数.'
						}
					],
					provinceName: [{
						validator: (rule, value, callback) => {
							return this.formData.provinceName &&
								this.formData.cityName &&
								this.formData.areaName &&
								this.formData.longitude &&
								this.formData.latitude
						},
						message: '请选择地址'
					}],
					addresInfo: [{
						required: true,
						message: '请填写详细地址',
						trigger: ['blur', 'change'],
					}],
					headImg: [{
						validator: (rule, value, callback) => {
							return this.formData.headImg.every(item => item.status === 'success')
						},
						message: '请正确上传图片'
					}]
				}
			}
		},
		onReady() {
			//如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则。
			this.$refs.formRef.setRules(this.formRules)
		},
		onLoad(data) {
			// type  1新增  2编辑  3查看
			this.pageType = Number(data.type)
			if (this.pageType == 1) {
				this.formData.parentId = data.pid
				if (data.pid != 0) {
					// 设置默认地址
					this.getAddress(data.pid)
				}
				if (data.name) {
					this.formData.name = data.name + '-'
				}
			} else if (this.pageType == 2) {
				uni.setNavigationBarTitle({
					title: "编辑"
				})
				this.getDetail(data.id)
			} else if (this.pageType == 3) {
				uni.setNavigationBarTitle({
					title: "查看"
				})
				this.getDetail(data.id)
			}
		},
		components: {
			cityPicker
		},
		methods: {
			addresChange(data) {
				// if (
				// 	data &&
				// 	Array.isArray(data) &&
				// 	data.length === 3
				// ) {
				// 	this.formData.provinceId = data[0].id
				// 	this.formData.provinceName = data[0].name
				// 	this.formData.cityId = data[1].id
				// 	this.formData.cityName = data[1].name
				// 	this.formData.areaId = data[2].id
				// 	this.formData.areaName = data[2].name
				// }
				if (data) {
					this.formData.provinceName = data.provinceName
					this.formData.cityName = data.cityName
					this.formData.areaName = data.areaName
					this.formData.addresInfo = data.addresInfo
					this.formData.longitude = data.longitude
					this.formData.latitude = data.latitude
				}
			},
			save() {
				if (this.pageType === 3) {
					uni.navigateBack()
					return
				}
				this.$refs.formRef.validate().then(res => {
					this.formData.headImg = this.formData.headImg.filter(item => item.status === 'success')
					if (this.formData.id) {
						// 编辑
						this.editHouse()
					} else {
						// 新增
						this.insertHouse()
					}

				}).catch(errors => {
					console.log(errors);
					uni.showToast({
						icon: "error",
						title: '校验失败'
					})
				})
			},
			release() {
				if (this.formData.rentalMarket) {
					// 下架
					this.unreleaseHouse()
				} else {
					this.$refs.formRef.validate().then(res => {
						// 发布
						if (
							(this.formData.headImg &&
								Array.isArray(this.formData.headImg) &&
								this.formData.headImg.length === 0) ||
							!this.formData.headImg
						) {
							uni.showToast({
								icon: "none",
								title: "发布到房市必须上传图片"
							})
							return
						}
						if (this.formData.id) {
							if (this.formData.status === 2) {
								uni.showToast({
									icon: "none",
									title: "已经租赁的房屋无法发布"
								})
								return
							}

							// 先编辑再发布
							this.$http.request({
								url: "/api/house/update",
								method: "post",
								data: this.formData
							}).then(async ({
								status
							}) => {
								if (status === 1) {
									this.releaseHouse(this.formData.id)
								}
							})
						} else {
							// 先新增再发布
							this.$http.request({
								url: "/api/house/insert",
								method: "post",
								data: this.formData
							}).then(async ({
								status,
								data
							}) => {
								if (status === 1) {
									this.releaseHouse(data)
								}
							})
						}
					}).catch(errors => {
						uni.$u.toast('校验失败')
					})
				}


			},
			unreleaseHouse() {
				uni.showModal({
					title: "提示",
					content: "是否从租房市场下架？",
					success: ({
						confirm
					}) => {
						if (confirm) {
							this.$http.request({
								url: "/api/rentalMarket/updateStatus",
								method: "post",
								data: {
									id: this.formData.rentalMarket.id,
									status: 2
								}
							}).then(({
								status,
								data
							}) => {
								if (status === 1) {
									this.$goBack("已从房市下架！")
								}
							})
						}
					}
				})
			},
			releaseHouse(houseId) {
				uni.showModal({
					title: "提示",
					content: "是否发布到租房市场？",
					success: ({
						confirm
					}) => {
						if (confirm) {
							this.$http.request({
								url: "/api/rentalMarket/insert",
								method: "post",
								data: {
									houseId
								}
							}).then(({
								status,
								data
							}) => {
								if (status === 1) {
									this.$goBack("已成功发布到房市！")
								}
							})
						}
					}
				})
			},
			getAddress(id) {
				this.$http.request({
					url: "/api/house/selectById",
					method: "get",
					data: {
						id
					}
				}).then(({
					status,
					data
				}) => {
					if (status === 1) {
						// this.defaultCity = [{
						// 		id: data.provinceId
						// 	},
						// 	{
						// 		id: data.cityId
						// 	},
						// 	{
						// 		id: data.areaId
						// 	}
						// ]
						this.defaultCity = `${data.provinceName}${data.cityName==='直辖市'?'':data.cityName}${data.areaName}`
						this.formData.provinceId = data.provinceId
						this.formData.provinceName = data.provinceName
						this.formData.cityId = data.cityId
						this.formData.cityName = data.cityName
						this.formData.areaId = data.areaId
						this.formData.areaName = data.areaName
						this.formData.addresInfo = data.addresInfo
						this.formData.addresInfo = data.addresInfo
						this.formData.addresInfo = data.addresInfo
						this.formData.longitude = data.longitude
						this.formData.latitude = data.latitude
					}
				})
			},
			insertHouse() {
				this.$http.request({
					url: "/api/house/insert",
					method: "post",
					data: this.formData
				}).then(async ({
					status
				}) => {
					if (status === 1) {
						this.$goBack("添加成功！")
					}
				})
			},
			editHouse() {
				this.$http.request({
					url: "/api/house/update",
					method: "post",
					data: this.formData
				}).then(async ({
					status
				}) => {
					if (status === 1) {
						this.$goBack("修改成功！")
					}
				})
			},
			getDetail(id) {
				this.$http.request({
					url: "/api/house/selectById",
					method: "get",
					data: {
						id
					}
				}).then(({
					status,
					data
				}) => {
					if (status === 1) {
						for (let key in this.formData) {
							this.formData[key] = data[key]
						}
						if (data.headImg) {
							this.formData.headImg = JSON.parse(data.headImg).map(item => {
								item.status = 'success'
								return item
							})
						} else {
							this.formData.headImg = []
						}
						this.formData.id = data.id
						this.formData.status = data.status
						this.formData.rentalMarket = data.rentalMarket
						this.defaultCity = `${data.provinceName}${data.cityName==='直辖市'?'':data.cityName}${data.areaName}`
					}
				})
			},
			headImgAfterRead(event) {
				let fileList = event.file
				fileList.forEach((item) => {
					let currentIndex = this.formData.headImg.length
					this.formData.headImg.push({
						...item,
						status: 'uploading',
						message: '上传中'
					})
					this.uploadImg(item.url, currentIndex)
				})
			},
			headImgDeletePic(event) {
				this.formData.headImg.splice(event.index, 1)
			},
			uploadImg(filePath, index) {
				//上传
				let token = uni.getStorageSync('token')
				uni.uploadFile({
					url: `${this.$baseUrl}/api/file/upload`,
					header: {
						'Authorization': token,
						'content-type': 'application/x-www-form-urlencggoded;charset=UTF-8'
					},
					filePath,
					name: "file",
					success: ({
						statusCode,
						data
					}) => {
						data = JSON.parse(data)
						if (data.status === 1 && statusCode === 200) {
							this.formData.headImg = this.formData.headImg.map((item, ind) => {
								if (ind === index) {
									item = data.data
									item.status = 'success'
								}
								return item
							})
						} else {
							this.formData.headImg = this.formData.headImg.map((item, ind) => {
								if (ind === index) {
									item.status = 'failed'
									item.message = '上传失败'
								}
								return item
							})
						}
					},
					fail: (err) => {
						this.formData.headImg = this.formData.headImg.map((item, ind) => {
							if (ind === index) {
								item.status = 'failed'
								item.message = '上传失败'
							}
							return item
						})
					},
					complete: (e) => {}
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.page-view {
		padding: 20rpx 30rpx 60rpx;
		background-color: #f8f9fa;
		min-height: 100vh;

		.demo-notice {
			display: flex;
			align-items: center;
			background-color: #fff7e6;
			border: 2rpx solid #ffd591;
			border-radius: 12rpx;
			padding: 20rpx 24rpx;
			margin-bottom: 24rpx;
			box-shadow: 0 2rpx 8rpx rgba(255, 152, 0, 0.1);

			.notice-text {
				margin-left: 12rpx;
				font-size: 26rpx;
				color: #ff9900;
				font-weight: 500;
			}
		}

		.flex-item-view {
			margin-top: 20rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 20rpx;
		}

		::v-deep .u-form-item {
			margin-bottom: 24rpx;
			padding: 24rpx 20rpx;
			background-color: #ffffff;
			border-radius: 12rpx;
			box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
			transition: box-shadow 0.3s ease;

			&:first-child {
				margin-top: 0;
			}

			&__body {
				padding: 0;
			}

			&__body__left {
				margin-right: 24rpx;
			}

			&__body__right {
				flex: 1;
			}

			&__body__left__content {
				min-width: 140rpx;
				color: #303133;
				font-size: 28rpx;
				font-weight: 500;
				text-align: left !important;
				justify-content: flex-start !important;
			}

			&__message {
				margin-top: 8rpx;
				font-size: 24rpx;
			}
		}

		::v-deep .u-radio {
			margin-right: 30rpx;

			&__label {
				font-size: 28rpx;
				color: #303133;
			}

			&__icon {
				font-size: 32rpx;
			}

			&--disabled {
				opacity: 0.5;
			}
		}

		::v-deep .u-input {
			background-color: #f8f9fa;
			border-radius: 8rpx;
			padding: 16rpx 20rpx;
			border: 2rpx solid transparent;
			transition: all 0.3s ease;

			&--disabled {
				background-color: #f5f5f5;
				opacity: 0.7;
			}

			&:focus {
				border-color: #3c9cff;
				background-color: #ffffff;
			}

			&__input {
				font-size: 28rpx;
				color: #303133;
			}

			&__placeholder {
				font-size: 28rpx;
				color: #909193;
			}
		}

		::v-deep .u-textarea {
			background-color: #f8f9fa;
			border-radius: 8rpx;
			padding: 16rpx 20rpx;
			border: 2rpx solid transparent;
			transition: all 0.3s ease;

			&--disabled {
				background-color: #f5f5f5;
				opacity: 0.7;
			}

			&:focus {
				border-color: #3c9cff;
				background-color: #ffffff;
			}

			&__count {
				font-size: 24rpx;
				color: #909193;
			}
		}
	}

	.btn-view {
		margin-top: 40rpx;
		display: flex;
		gap: 20rpx;
		padding: 20rpx;
		background-color: #ffffff;
		border-radius: 12rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);

		::v-deep .u-button {
			flex: 1;
			height: 88rpx;
			border-radius: 44rpx;
			font-size: 32rpx;
			font-weight: 500;
			border: none;
			transition: all 0.3s ease;

			&:active {
				transform: scale(0.98);
			}

			&--primary {
				background: linear-gradient(135deg, #3c9cff 0%, #398ade 100%);
				box-shadow: 0 4rpx 12rpx rgba(60, 156, 255, 0.3);
			}

			&--success {
				background: linear-gradient(135deg, #5ac725 0%, #53c21d 100%);
				box-shadow: 0 4rpx 12rpx rgba(90, 199, 37, 0.3);
			}

			&--error {
				background: linear-gradient(135deg, #f56c6c 0%, #e45656 100%);
				box-shadow: 0 4rpx 12rpx rgba(245, 108, 108, 0.3);
			}

			&--warning {
				background: linear-gradient(135deg, #f9ae3d 0%, #f1a532 100%);
				box-shadow: 0 4rpx 12rpx rgba(249, 174, 61, 0.3);
			}
		}
	}

	.df {
		display: flex;
		gap: 16rpx;
		flex-wrap: wrap;
		align-items: center;

		::v-deep .u-tag {
			margin: 0;
			padding: 8rpx 16rpx;
			border-radius: 6rpx;
			font-size: 26rpx;
			font-weight: 500;
		}
	}

	// 优化上传组件样式
	::v-deep .u-upload {
		&__wrap {
			display: flex;
			flex-wrap: wrap;
			gap: 16rpx;
		}

		&__preview {
			border-radius: 8rpx;
			overflow: hidden;
			box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
		}

		&__button {
			background-color: #f8f9fa;
			border: 2rpx dashed #dadbde;
			border-radius: 8rpx;
			transition: all 0.3s ease;

			&:hover {
				background-color: #f0f2f5;
				border-color: #3c9cff;
			}
		}
	}

	// 优化文本组件样式
	::v-deep .u-text {
		font-size: 24rpx;
		color: #909193;
	}

	// 修复地址字段高度问题
	::v-deep .u-form-item.address-item {
		.u-form-item__body {
			min-height: 60rpx;
			height: 60rpx;
			align-items: center;
		}
	}

	// 城市选择器组件样式优化
	::v-deep .cityPicker {
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		display: flex;
		align-items: center;
		background-color: #f8f9fa;
		border-radius: 8rpx;
		padding: 0 20rpx;
		border: 2rpx solid transparent;
		transition: all 0.3s ease;

		&:focus {
			border-color: #3c9cff;
			background-color: #ffffff;
		}

		&--disabled {
			background-color: #f5f5f5;
			opacity: 0.7;
		}
	}

	// 响应式设计优化
	@media screen and (max-width: 750rpx) {
		.page-view {
			padding: 16rpx 20rpx 40rpx;
		}

		::v-deep .u-form-item {
			padding: 20rpx 16rpx;
		}

		.btn-view {
			padding: 16rpx;
			gap: 16rpx;

			::v-deep .u-button {
				height: 80rpx;
				font-size: 30rpx;
			}
		}

		.flex-item-view {
			gap: 16rpx;
		}
	}

	// 平板端适配
	@media screen and (min-width: 751rpx) and (max-width: 1024rpx) {
		.page-view {
			max-width: 900rpx;
			margin: 0 auto;
		}
	}

	// 优化滚动体验
	.page-view {
		scroll-behavior: smooth;
	}

	// 添加页面加载动画
	.page-view {
		animation: fadeIn 0.3s ease-in-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(20rpx);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>