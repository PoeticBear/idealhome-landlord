{
	"data": {
		"error": "Unexpected token '/', " / images / house1.jpg " is not valid JSON"
	},
	"statusCode": 500,
	"header": {
		"content-length": "74",
		"content-type": "application/json; charset=utf-8"
	},
	"errMsg": "request:ok",
	"config": {
		"baseURL": "http://127.0.0.1:7001",
		"method": "get",
		"url": "/api/house/select",
		"params": {},
		"custom": {},
		"header": {
			"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoxfSwiaWF0IjoxNzU5MTMzNjE4LCJleHAiOjE3NTk3Mzg0MTh9.FpMVCjcrK9LQycrtY5y7t1-O8zYUgyatLyHQ0jtYiXQ",
			"requestType": 2,
			"userType": 6,
			"method": "GET"
		},
		"validateStatus": function validateStatus(status) {
			return status >= 200 && status < 300;
		},
		"data": {
			"parentId": 0
		},
		"dataType": "json",
		"responseType": "text",
		"withCredentials": false
	}
}