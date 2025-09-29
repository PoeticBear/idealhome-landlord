import Request from "@/utils/luch-request/index.js";
import store from "@/store";
const env = require("../../config");
const loginUrlArr = [
	"api/landlordUser/getPhoneNumber",
	"api/landlordUser/loginByWx",
	"api/landlordUser/refreshLogin",
]; // 接口无需设置token请求头
const http = new Request();
http.setConfig((config) => {
	/* 设置全局配置 */
	config.baseURL = env.baseUrl;
	config.header = {
		...config.header,
	};
	return config;
});

http.interceptors.request.use(
	(config) => {
		/* 请求之前拦截器。可以使用async await 做异步操作 */
		// 获取token，适配浏览器环境
		let token = "";
		try {
			// #ifdef H5
			token = localStorage.getItem("token") || "";
			// #endif
			// #ifndef H5
			token = uni.getStorageSync("token");
			// #endif
		} catch (e) {
			console.log("获取token失败", e);
		}

		config.header = {
			...config.header,
			"Authorization": token,
			requestType: 2,
			userType: 6,
			method: config.method.toUpperCase(),
		};

		if (loginUrlArr.includes(config.url)) {
			delete config.header["Authorization"];
		}

		// 显示加载状态（仅在非H5环境或uni对象存在时）
		if (typeof uni !== 'undefined' && uni.showLoading) {
			uni.showLoading({
				title: "加载中...",
				mask: true,
			});
		}
		return config;
	},
	(config) => {}
);

http.interceptors.response.use(
	async (response) => {
			// 隐藏加载状态
			if (typeof uni !== 'undefined' && uni.hideLoading) {
				uni.hideLoading();
			}

			/* 请求之后拦截器。可以使用async await 做异步操作  */
			let parsedData;
			try {
				// 如果response.data是字符串，尝试解析为JSON
				if (typeof response.data === 'string') {
					parsedData = JSON.parse(response.data);
				} else {
					parsedData = response.data;
				}
			} catch (e) {
				console.error("JSON解析失败:", e, "原始数据:", response.data);
				if (typeof uni !== 'undefined' && uni.showToast) {
					await uni.showToast({
						title: '数据格式错误',
						icon: "none",
						duration: 2000,
					});
				} else {
					alert('数据格式错误');
				}
				return { status: -1, message: '数据格式错误', data: null };
			}

			const {
				status,
				message
			} = parsedData;

			if (status !== 1) {
				// 适配浏览器环境的提示
				if (typeof uni !== 'undefined' && uni.showToast) {
					await uni.showToast({
						title: message || '请求异常',
						icon: "none",
						duration: 2000,
					});
				} else {
					alert(message || '请求异常');
				}
			}
			return parsedData;
		},
		async (response) => {
			// 请求错误做点什么。可以使用async await 做异步操作
			if (typeof uni !== 'undefined' && uni.hideLoading) {
				uni.hideLoading();
			}

			console.error("请求失败:", response);

			// 处理JSON解析错误
			if (response.data && typeof response.data === 'string' && response.data.includes('is not valid JSON')) {
				if (typeof uni !== 'undefined' && uni.showToast) {
					await uni.showToast({
						title: '服务器数据格式错误',
						icon: "none",
						duration: 3000,
					});
				} else {
					alert('服务器数据格式错误');
				}
				return Promise.reject(response);
			}

			if (response.statusCode === 401) {
				// token过期
				const refreshLogin = store.state.refreshLogin;
				// 如果正在重新登录则不执行操作
				if (refreshLogin) {
					return;
				}

				// 清除token，适配浏览器环境
				try {
					// #ifdef H5
					localStorage.removeItem("token");
					// #endif
					// #ifndef H5
					await uni.removeStorage({
						key: "token",
					});
					// #endif
				} catch (e) {
					console.log("清除token失败", e);
				}

				// 跳转到登录页
				if (typeof uni !== 'undefined') {
					await uni.navigateTo({
						url: "/pages/login/login",
					});
					await uni.showToast({
						icon: "none",
						title: "您的登录已过期，请重新登录！",
					});
				} else {
					// 浏览器环境跳转
					window.location.href = "/pages/login/login";
				}
			} else {
				// 适配浏览器环境的提示
				if (typeof uni !== 'undefined' && uni.showToast) {
					await uni.showToast({
						title: "请求异常！",
						icon: "none",
					});
				} else {
					alert("请求异常！");
				}
			}

			console.log(response);
		}
);

export {
	http
};
