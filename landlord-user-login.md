# 房东用户账号密码登录接口文档

## 接口详情

### 登录接口

- **URL**: `/api/landlordUser/login`
- **Method**: `POST`
- **Content-Type**: `application/json`
- **是否需要认证**: 否

### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| phone | string | 是 | 手机号 | "13800138000" |
| password | string | 是 | 密码 | "123456" |

### 请求示例
```json
POST /api/landlordUser/login

{
  "phone": "13800138000",
  "password": "123456"
}
```

### 响应结果

#### 登录成功
```json
{
  "status": 1,
  "data": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "登录成功"
}
```

#### 登录失败
```json
{
  "status": -1,
  "data": "",
  "message": "密码错误！"
}
```

### 响应参数说明

| 字段 | 类型 | 说明 |
|------|------|------|
| status | number | 状态码：1表示成功，-1表示失败 |
| data | string | 登录成功时返回的JWT token |
| message | string | 响应消息或错误信息 |

### 错误消息说明

- `密码错误！` - 输入的密码与数据库中存储的密码不匹配
- `用户已停用！` - 用户账号状态为停用状态
- `未查询到用户！` - 输入的手机号在系统中不存在

### Token使用

登录成功后，后续所有需要认证的接口请求都需要在Header中携带token：

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 注意事项

1. 密码明文传输，请确保使用HTTPS
2. Token有效期为配置的JWT过期时间
3. Token过期后会收到401状态码，需要重新登录
4. 该登录方式与微信小程序登录并存，用户可选择任一方式