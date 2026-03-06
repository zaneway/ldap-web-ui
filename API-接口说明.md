# LDAP 运维管理系统 - 前后端接口说明

本文档基于 `DESIGN.md` 设计，约定前后端 RESTful 接口的路径、方法及 **JSON 请求/响应报文** 格式。除登录等少数接口外，请求需携带 JWT。

---

## 1. 通用约定

### 1.1 基础信息

| 项目 | 说明 |
|------|------|
| 基础路径 | `/api/v1` |
| 内容类型 | `Content-Type: application/json` |
| 认证方式 | 请求头 `Authorization: Bearer <accessToken>`（登录、刷新接口除外） |

### 1.2 统一响应结构

**成功响应：**

```json
{
  "code": 200,
  "message": "success",
  "data": { },
  "timestamp": "2025-03-06T10:00:00.000+08:00"
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| code | number | 业务状态码，200 表示成功 |
| message | string | 提示信息 |
| data | object / array / null | 业务数据，无数据时可为 null |
| timestamp | string | 服务器时间，ISO 8601 |

**错误响应：**

```json
{
  "code": 400,
  "message": "参数校验失败",
  "data": null,
  "timestamp": "2025-03-06T10:00:00.000+08:00",
  "errors": [
    { "field": "username", "message": "用户名不能为空" }
  ]
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| errors | array | 可选，校验错误明细，每项含 field、message |

### 1.3 常用状态码

| code | 说明 |
|------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未登录或 Token 无效/过期 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

### 1.4 分页结构

列表类接口返回分页时，`data` 为如下结构：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [ ],
    "total": 100,
    "page": 1,
    "limit": 20,
    "pages": 5
  },
  "timestamp": "2025-03-06T10:00:00.000+08:00"
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| list | array | 当前页数据 |
| total | number | 总条数 |
| page | number | 当前页码，从 1 开始 |
| limit | number | 每页条数 |
| pages | number | 总页数 |

---

## 2. 认证接口

### 2.1 用户登录

**POST** `/api/v1/auth/login`

**请求体：**

```json
{
  "username": "admin",
  "password": "your_password"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 用户名 |
| password | string | 是 | 密码 |

**成功响应（200）：**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 7200,
    "user": {
      "id": 1,
      "username": "admin",
      "realName": "管理员",
      "email": "admin@example.com",
      "ldapDn": "cn=admin,dc=example,dc=com",
      "roles": ["ROLE_ADMIN"],
      "permissions": ["user:view", "user:create", "group:view"]
    }
  },
  "timestamp": "2025-03-06T10:00:00.000+08:00"
}
```

**失败响应（401）：**

```json
{
  "code": 401,
  "message": "用户名或密码错误",
  "data": null,
  "timestamp": "2025-03-06T10:00:00.000+08:00"
}
```

---

### 2.2 刷新 Token

**POST** `/api/v1/auth/refresh`

**请求体：**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**成功响应（200）：** 与登录成功时 `data` 结构一致（新 accessToken、refreshToken、expiresIn、user）。

---

### 2.3 登出

**POST** `/api/v1/auth/logout`

**请求头：** `Authorization: Bearer <accessToken>`

**请求体：** 空或 `{}`

**成功响应（200）：**

```json
{
  "code": 200,
  "message": "success",
  "data": null,
  "timestamp": "2025-03-06T10:00:00.000+08:00"
}
```

---

### 2.4 修改密码

**POST** `/api/v1/auth/change-password`

**请求体：**

```json
{
  "oldPassword": "old_pass",
  "newPassword": "new_pass"
}
```

**成功响应（200）：** `data` 为 null。

---

### 2.5 获取当前用户信息

**GET** `/api/v1/auth/current`

**成功响应（200）：**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "username": "admin",
    "realName": "管理员",
    "email": "admin@example.com",
    "ldapDn": "cn=admin,dc=example,dc=com",
    "roles": ["ROLE_ADMIN"],
    "permissions": ["user:view", "user:create", "group:view"]
  },
  "timestamp": "2025-03-06T10:00:00.000+08:00"
}
```

---

## 3. 用户管理接口

### 3.1 用户列表（分页）

**GET** `/api/v1/users?page=1&limit=20&baseDn=ou=users,dc=example,dc=com&keyword=zhang&sort=cn,asc`

| 查询参数 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| page | number | 否 | 页码，默认 1 |
| limit | number | 否 | 每页条数，默认 20 |
| baseDn | string | 否 | 搜索基准 DN |
| keyword | string | 否 | 关键词（cn、uid 等） |
| sort | string | 否 | 排序，如 `cn,asc`、`createTimestamp,desc` |

**成功响应（200）：**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "dn": "uid=zhangsan,ou=users,dc=example,dc=com",
        "uid": "zhangsan",
        "cn": "张三",
        "sn": "张",
        "mail": "zhangsan@example.com",
        "objectClass": ["inetOrgPerson", "organizationalPerson", "person", "top"],
        "createTimestamp": "2025-01-01T08:00:00.000Z",
        "modifyTimestamp": "2025-03-01T09:00:00.000Z"
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 20,
    "pages": 1
  },
  "timestamp": "2025-03-06T10:00:00.000+08:00"
}
```

---

### 3.2 用户详情

**GET** `/api/v1/users/{dn}`

路径参数：`dn` 需 URL 编码，如 `uid%3Dzhangsan%2Cou%3Dusers%2Cdc%3Dexample%2Cdc%3Dcom`。

**成功响应（200）：**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "dn": "uid=zhangsan,ou=users,dc=example,dc=com",
    "uid": "zhangsan",
    "cn": "张三",
    "sn": "张",
    "givenName": "三",
    "mail": "zhangsan@example.com",
    "mobile": "13800138000",
    "description": "研发部",
    "objectClass": ["inetOrgPerson", "organizationalPerson", "person", "top"],
    "attributes": {
      "employeeNumber": ["E001"],
      "title": ["工程师"]
    },
    "createTimestamp": "2025-01-01T08:00:00.000Z",
    "modifyTimestamp": "2025-03-01T09:00:00.000Z"
  },
  "timestamp": "2025-03-06T10:00:00.000+08:00"
}
```

---

### 3.3 创建用户

**POST** `/api/v1/users`

**请求体：**

```json
{
  "parentDn": "ou=users,dc=example,dc=com",
  "uid": "lisi",
  "cn": "李四",
  "sn": "李",
  "givenName": "四",
  "mail": "lisi@example.com",
  "mobile": "13900139000",
  "userPassword": "initialPassword",
  "description": "产品部",
  "attributes": {
    "employeeNumber": "E002",
    "title": "产品经理"
  }
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| parentDn | string | 是 | 父 DN（OU） |
| uid | string | 是 | 用户 ID |
| cn | string | 是 | 通用名称 |
| sn | string | 是 | 姓 |
| givenName | string | 否 | 名 |
| mail | string | 否 | 邮箱 |
| mobile | string | 否 | 手机 |
| userPassword | string | 否 | 初始密码（后端可要求必填） |
| description | string | 否 | 描述 |
| attributes | object | 否 | 其他属性键值 |

**成功响应（201）：**

```json
{
  "code": 201,
  "message": "success",
  "data": {
    "dn": "uid=lisi,ou=users,dc=example,dc=com",
    "uid": "lisi",
    "cn": "李四",
    "sn": "李",
    "mail": "lisi@example.com",
    "createTimestamp": "2025-03-06T10:00:00.000Z"
  },
  "timestamp": "2025-03-06T10:00:00.000+08:00"
}
```

---

### 3.4 更新用户

**PUT** `/api/v1/users/{dn}`

**请求体：**

```json
{
  "cn": "李四",
  "sn": "李",
  "givenName": "四",
  "mail": "lisi@example.com",
  "mobile": "13900139000",
  "description": "产品部",
  "attributes": {
    "title": "高级产品经理"
  }
}
```

（不传的字段表示不修改；不可通过此接口改 uid/parentDn，需删后重建或单独接口。）

**成功响应（200）：** `data` 为更新后的用户对象，结构同 3.2。

---

### 3.5 删除用户

**DELETE** `/api/v1/users/{dn}`

**成功响应（200）：** `data` 为 null。

---

### 3.6 重置密码

**POST** `/api/v1/users/{dn}/password/reset`

**请求体：**

```json
{
  "newPassword": "newSecurePassword"
}
```

**成功响应（200）：** `data` 为 null。

---

### 3.7 导入用户

**POST** `/api/v1/users/import`

**请求体：** 数组，每项与创建用户字段类似。

```json
{
  "parentDn": "ou=users,dc=example,dc=com",
  "users": [
    {
      "uid": "u1",
      "cn": "用户1",
      "sn": "用",
      "mail": "u1@example.com",
      "userPassword": "pass1"
    },
    {
      "uid": "u2",
      "cn": "用户2",
      "sn": "用",
      "mail": "u2@example.com",
      "userPassword": "pass2"
    }
  ]
}
```

**成功响应（200）：**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 2,
    "successCount": 2,
    "failedCount": 0,
    "failures": []
  },
  "timestamp": "2025-03-06T10:00:00.000+08:00"
}
```

---

### 3.8 导出用户

**GET** `/api/v1/users/export?dns=dn1&dns=dn2`  
或 **POST** `/api/v1/users/export`，请求体为 DN 列表。

**POST 请求体示例：**

```json
{
  "dns": [
    "uid=zhangsan,ou=users,dc=example,dc=com",
    "uid=lisi,ou=users,dc=example,dc=com"
  ]
}
```

若为 GET，则通过查询参数传 `dns`；导出全量时可不传或传 baseDn。  
响应为文件流（如 `Content-Disposition: attachment; filename=users.ldif`），或包装为 base64 的 JSON（由前端约定）。

---

## 4. 组管理接口

### 4.1 组列表（分页）

**GET** `/api/v1/groups?page=1&limit=20&baseDn=ou=groups,dc=example,dc=com&keyword=admin`

**成功响应（200）：** `data` 为分页结构，`list` 中每项示例：

```json
{
  "dn": "cn=admins,ou=groups,dc=example,dc=com",
  "cn": "admins",
  "description": "管理员组",
  "member": ["uid=admin,ou=users,dc=example,dc=com"],
  "memberCount": 1,
  "objectClass": ["groupOfNames", "top"],
  "createTimestamp": "2025-01-01T08:00:00.000Z"
}
```

---

### 4.2 组详情

**GET** `/api/v1/groups/{dn}`

**成功响应（200）：**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "dn": "cn=admins,ou=groups,dc=example,dc=com",
    "cn": "admins",
    "description": "管理员组",
    "member": ["uid=admin,ou=users,dc=example,dc=com", "uid=zhangsan,ou=users,dc=example,dc=com"],
    "memberCount": 2,
    "objectClass": ["groupOfNames", "top"],
    "createTimestamp": "2025-01-01T08:00:00.000Z",
    "modifyTimestamp": "2025-03-01T09:00:00.000Z"
  },
  "timestamp": "2025-03-06T10:00:00.000+08:00"
}
```

---

### 4.3 创建组

**POST** `/api/v1/groups`

**请求体：**

```json
{
  "parentDn": "ou=groups,dc=example,dc=com",
  "cn": "developers",
  "description": "开发组",
  "member": ["uid=zhangsan,ou=users,dc=example,dc=com"]
}
```

`member` 至少需一个（groupOfNames 要求）。**成功响应（201）：** `data` 为新建组对象。

---

### 4.4 更新组

**PUT** `/api/v1/groups/{dn}`

**请求体：**

```json
{
  "description": "开发组（更新）",
  "member": ["uid=zhangsan,ou=users,dc=example,dc=com", "uid=lisi,ou=users,dc=example,dc=com"]
}
```

**成功响应（200）：** `data` 为更新后组对象。

---

### 4.5 删除组

**DELETE** `/api/v1/groups/{dn}`

**成功响应（200）：** `data` 为 null。

---

### 4.6 添加成员

**POST** `/api/v1/groups/{dn}/members`

**请求体：**

```json
{
  "memberDns": [
    "uid=wangwu,ou=users,dc=example,dc=com"
  ]
}
```

**成功响应（200）：** `data` 为 null。

---

### 4.7 移除成员

**DELETE** `/api/v1/groups/{dn}/members`

**请求体：**

```json
{
  "memberDns": [
    "uid=wangwu,ou=users,dc=example,dc=com"
  ]
}
```

**成功响应（200）：** `data` 为 null。

---

## 5. OU 管理接口

### 5.1 获取 OU 树

**GET** `/api/v1/ous/tree?baseDn=dc=example,dc=com`

**成功响应（200）：**

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": "ou=users,dc=example,dc=com",
      "dn": "ou=users,dc=example,dc=com",
      "label": "users",
      "type": "ou",
      "objectClass": ["organizationalUnit", "top"],
      "hasChildren": true,
      "isLeaf": false,
      "children": [
        {
          "id": "ou=active,ou=users,dc=example,dc=com",
          "dn": "ou=active,ou=users,dc=example,dc=com",
          "label": "active",
          "type": "ou",
          "hasChildren": false,
          "isLeaf": true
        }
      ]
    }
  ],
  "timestamp": "2025-03-06T10:00:00.000+08:00"
}
```

---

### 5.2 OU 列表（分页）

**GET** `/api/v1/ous?page=1&limit=20&parentDn=ou=users,dc=example,dc=com`

**成功响应（200）：** `data` 为分页结构，`list` 为 OU 条目数组。

---

### 5.3 OU 详情

**GET** `/api/v1/ous/{dn}`

**成功响应（200）：** `data` 为单条 OU 对象（dn、ou、description、objectClass 等）。

---

### 5.4 创建 OU

**POST** `/api/v1/ous`

**请求体：**

```json
{
  "parentDn": "ou=users,dc=example,dc=com",
  "ou": "contractors",
  "description": "外包人员"
}
```

**成功响应（201）：** `data` 为新建 OU 对象。

---

### 5.5 更新 OU

**PUT** `/api/v1/ous/{dn}`

**请求体：**

```json
{
  "description": "外包人员（更新）"
}
```

**成功响应（200）：** `data` 为更新后 OU 对象。

---

### 5.6 删除 OU

**DELETE** `/api/v1/ous/{dn}?recursive=false`

| 查询参数 | 类型 | 说明 |
|----------|------|------|
| recursive | boolean | 是否递归删除子节点，默认 false |

**成功响应（200）：** `data` 为 null。

---

## 6. 树形接口（通用）

### 6.1 获取根节点

**GET** `/api/v1/tree/roots?baseDn=dc=example,dc=com`

**成功响应（200）：** `data` 为根节点数组，结构同 5.1 树节点。

---

### 6.2 获取子节点（懒加载）

**GET** `/api/v1/tree/children?parentDn=ou=users,dc=example,dc=com&page=1&limit=100`

**成功响应（200）：**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "children": [
      {
        "id": "ou=active,ou=users,dc=example,dc=com",
        "dn": "ou=active,ou=users,dc=example,dc=com",
        "label": "active",
        "type": "ou",
        "hasChildren": true,
        "isLeaf": false
      }
    ],
    "total": 1
  },
  "timestamp": "2025-03-06T10:00:00.000+08:00"
}
```

---

### 6.3 搜索树节点

**GET** `/api/v1/tree/search?keyword=zhang&type=user`

| 查询参数 | 说明 |
|----------|------|
| keyword | 关键词 |
| type | 可选，ou / user / group |

**成功响应（200）：** `data` 为匹配节点数组（可含路径信息）。

---

### 6.4 获取节点路径

**GET** `/api/v1/tree/path?dn=uid=zhangsan,ou=users,dc=example,dc=com`

**成功响应（200）：**

```json
{
  "code": 200,
  "message": "success",
  "data": [
    { "dn": "dc=example,dc=com", "label": "example" },
    { "dn": "ou=users,dc=example,dc=com", "label": "users" },
    { "dn": "uid=zhangsan,ou=users,dc=example,dc=com", "label": "zhangsan" }
  ],
  "timestamp": "2025-03-06T10:00:00.000+08:00"
}
```

---

## 7. 审计日志接口

### 7.1 审计日志列表

**GET** `/api/v1/audit/logs?page=1&limit=20&operationType=CREATE&resourceType=user&startTime=2025-03-01&endTime=2025-03-06&operatorId=1`

**成功响应（200）：** `data` 为分页结构，`list` 示例：

```json
{
  "id": 1001,
  "operationType": "CREATE",
  "resourceType": "user",
  "resourceDn": "uid=zhangsan,ou=users,dc=example,dc=com",
  "operatorId": 1,
  "operatorName": "admin",
  "operationTime": "2025-03-06T10:00:00.000+08:00",
  "ipAddress": "192.168.1.100",
  "oldValue": null,
  "newValue": "{\"cn\":\"张三\",\"uid\":\"zhangsan\"}",
  "status": "SUCCESS"
}
```

---

### 7.2 审计日志详情

**GET** `/api/v1/audit/logs/{id}`

**成功响应（200）：** `data` 为单条审计记录完整对象。

---

### 7.3 操作统计

**GET** `/api/v1/audit/statistics?startTime=2025-03-01&endTime=2025-03-06`

**成功响应（200）：**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "byOperationType": { "CREATE": 10, "UPDATE": 5, "DELETE": 1 },
    "byResourceType": { "user": 8, "group": 4, "ou": 4 }
  },
  "timestamp": "2025-03-06T10:00:00.000+08:00"
}
```

---

## 8. 审批接口

### 8.1 待审批列表

**GET** `/api/v1/approvals/pending?page=1&limit=20`

**成功响应（200）：** `data` 为分页结构，`list` 为审批记录（approvalNo、title、approvalType、applicantId、targetDn、status、createdAt 等）。

---

### 8.2 审批历史

**GET** `/api/v1/approvals/history?page=1&limit=20&status=APPROVED`

**成功响应（200）：** `data` 为分页结构。

---

### 8.3 创建审批

**POST** `/api/v1/approvals`

**请求体：**

```json
{
  "approvalType": "USER_DELETE",
  "title": "申请删除用户 zhangsan",
  "targetDn": "uid=zhangsan,ou=users,dc=example,dc=com",
  "targetResource": "{\"cn\":\"张三\"}"
}
```

**成功响应（201）：** `data` 为审批记录（id、approvalNo、status 等）。

---

### 8.4 审批通过

**POST** `/api/v1/approvals/{id}/approve`

**请求体：**

```json
{
  "comment": "同意删除"
}
```

**成功响应（200）：** `data` 为更新后审批记录。

---

### 8.5 审批拒绝

**POST** `/api/v1/approvals/{id}/reject`

**请求体：**

```json
{
  "reason": "该用户仍在使用中"
}
```

**成功响应（200）：** `data` 为更新后审批记录。

---

## 9. 备份与恢复接口

### 9.1 备份列表

**GET** `/api/v1/backups?page=1&limit=20&status=SUCCESS`

**成功响应（200）：** `data` 为分页结构，`list` 示例：

```json
{
  "id": 1,
  "backupName": "full_20250306",
  "backupType": "FULL",
  "backupScope": "FULL",
  "baseDn": "dc=example,dc=com",
  "filePath": "/backup/ldap_20250306.ldif",
  "fileSize": 1048576,
  "backupTime": "2025-03-06T02:00:00.000+08:00",
  "operatorId": 1,
  "status": "SUCCESS"
}
```

---

### 9.2 创建备份

**POST** `/api/v1/backups`

**请求体：**

```json
{
  "backupName": "manual_20250306",
  "backupType": "FULL",
  "backupScope": "FULL",
  "baseDn": "dc=example,dc=com"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| backupName | string | 是 | 备份名称 |
| backupType | string | 是 | FULL / INCREMENTAL 等 |
| backupScope | string | 是 | FULL / SUBTREE |
| baseDn | string | 否 | 子树备份时指定 |

**成功响应（201）：** `data` 为备份记录（含 id、status、backupTime 等）。

---

### 9.3 删除备份

**DELETE** `/api/v1/backups/{id}`

**成功响应（200）：** `data` 为 null。

---

### 9.4 恢复备份

**POST** `/api/v1/backups/{id}/restore`

**请求体：** 空或 `{}`，可选扩展确认参数：

```json
{
  "confirm": true
}
```

**成功响应（200）：** `data` 为 null 或恢复任务标识。

---

### 9.5 备份计划列表

**GET** `/api/v1/backup-schedules?page=1&limit=20`

**成功响应（200）：** `data` 为分页结构，`list` 含 scheduleName、cronExpression、nextRunTime、status 等。

---

### 9.6 创建备份计划

**POST** `/api/v1/backup-schedules`

**请求体：**

```json
{
  "scheduleName": "每日全量备份",
  "backupType": "FULL",
  "backupScope": "FULL",
  "baseDn": "dc=example,dc=com",
  "cronExpression": "0 0 2 * * ?",
  "retentionDays": 30
}
```

**成功响应（201）：** `data` 为计划记录。

---

## 10. 系统权限（RBAC）接口

### 10.1 角色列表

**GET** `/api/v1/roles?page=1&limit=20`

**成功响应（200）：** `data` 为分页结构，`list` 含 id、roleCode、roleName、description、status。

---

### 10.2 创建角色

**POST** `/api/v1/roles`

**请求体：**

```json
{
  "roleCode": "DEPT_MANAGER",
  "roleName": "部门经理",
  "description": "可审批本部门用户变更"
}
```

**成功响应（201）：** `data` 为角色对象。

---

### 10.3 为角色分配权限

**PUT** `/api/v1/roles/{id}/permissions`

**请求体：**

```json
{
  "permissionIds": [1, 2, 3, 5, 8]
}
```

**成功响应（200）：** `data` 为 null。

---

### 10.4 权限列表

**GET** `/api/v1/permissions`

**成功响应（200）：** `data` 为权限数组，每项含 id、permissionCode、permissionName、resourceType、resourcePath、parentId 等。

---

### 10.5 权限树

**GET** `/api/v1/permissions/tree`

**成功响应（200）：** `data` 为树形权限结构（children 嵌套）。

---

## 11. LDAP 权限（ACI）接口

### 11.1 列出 ACI

**GET** `/api/v1/acl?baseDn=ou=users,dc=example,dc=com`

**成功响应（200）：**

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "entryDn": "ou=users,dc=example,dc=com",
      "aciName": "allow read",
      "aciValue": "(target=\"ldap:///ou=users,dc=example,dc=com\")(version 3.0; acl \"allow read\"; allow (read,search) userdn=\"ldap:///cn=admin,dc=example,dc=com\";)"
    }
  ],
  "timestamp": "2025-03-06T10:00:00.000+08:00"
}
```

---

### 11.2 预览 ACI

**GET** `/api/v1/acl/preview?aciString=(target=...)(version 3.0; acl ...)`  
或 **POST** `/api/v1/acl/preview`

**POST 请求体：**

```json
{
  "aciString": "(target=\"ldap:///ou=users,dc=example,dc=com\")(version 3.0; acl \"allow read\"; allow (read,search) userdn=\"ldap:///cn=admin,dc=example,dc=com\";)"
}
```

**成功响应（200）：**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "target": "ou=users,dc=example,dc=com",
    "permissions": ["read", "search"],
    "bindRule": "userdn=\"ldap:///cn=admin,dc=example,dc=com\"",
    "valid": true
  },
  "timestamp": "2025-03-06T10:00:00.000+08:00"
}
```

---

### 11.3 创建/添加 ACI

**POST** `/api/v1/acl`

**请求体：**

```json
{
  "entryDn": "ou=users,dc=example,dc=com",
  "aciName": "allow read",
  "aciValue": "(target=\"ldap:///ou=users,dc=example,dc=com\")(version 3.0; acl \"allow read\"; allow (read,search) userdn=\"ldap:///cn=admin,dc=example,dc=com\";)"
}
```

**成功响应（201）：** `data` 为 ACI 条目（entryDn、aciName、aciValue）。

---

### 11.4 更新 ACI

**PUT** `/api/v1/acl/{entryDn}`

路径中的 `entryDn` 需 URL 编码。**请求体：**

```json
{
  "aciName": "allow read",
  "aciValue": "(target=\"ldap:///ou=users,dc=example,dc=com\")(version 3.0; acl \"allow read\"; allow (read,search,compare) userdn=\"ldap:///cn=admin,dc=example,dc=com\";)"
}
```

**成功响应（200）：** `data` 为更新后 ACI 条目。

---

### 11.5 删除 ACI

**DELETE** `/api/v1/acl/{entryDn}?aciName=allow%20read`

**成功响应（200）：** `data` 为 null。

---

### 11.6 将 ACI 应用到子树

**POST** `/api/v1/acl/apply-subtree`

**请求体：**

```json
{
  "baseDn": "ou=users,dc=example,dc=com",
  "aciName": "allow read",
  "aciValue": "(target=\"ldap:///ou=users,dc=example,dc=com\")(version 3.0; acl \"allow read\"; allow (read,search) userdn=\"ldap:///cn=admin,dc=example,dc=com\";)"
}
```

**成功响应（200）：** `data` 可为应用结果摘要，如 `{ "appliedCount": 5 }`。

---

## 12. 主从同步（Syncrepl）接口

### 12.1 消费者配置列表

**GET** `/api/v1/sync/consumers`

**成功响应（200）：**

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "consumerName": "replica-01",
      "consumerDn": "cn=replica-01,cn=config",
      "providerUri": "ldap://master.example.com:389",
      "searchBase": "dc=example,dc=com",
      "scope": "sub",
      "enabled": true,
      "lastSyncTime": "2025-03-06T09:55:00.000+08:00",
      "lastSyncStatus": "SUCCESS"
    }
  ],
  "timestamp": "2025-03-06T10:00:00.000+08:00"
}
```

---

### 12.2 消费者配置详情

**GET** `/api/v1/sync/consumers/{dn}`

**成功响应（200）：** `data` 含 consumerName、consumerDn、providerUri、bindDn、searchBase、scope、filter、attrs、syncreplSpec、enabled、lastSyncTime、lastSyncStatus 等。

---

### 12.3 创建从节点配置

**POST** `/api/v1/sync/consumers`

**请求体：**

```json
{
  "consumerName": "replica-02",
  "providerUri": "ldap://master.example.com:389",
  "bindDn": "cn=admin,dc=example,dc=com",
  "bindMethod": "SIMPLE",
  "credentials": "secret",
  "searchBase": "dc=example,dc=com",
  "scope": "sub",
  "filter": "(objectClass=*)",
  "attrs": ["*", "+"],
  "syncreplType": "refreshOnly"
}
```

**成功响应（201）：** `data` 为新建消费者配置（不含明文 credentials）。

---

### 12.4 更新从节点配置

**PUT** `/api/v1/sync/consumers/{dn}`

**请求体：** 与 12.3 字段一致，均为可选更新。

**成功响应（200）：** `data` 为更新后配置。

---

### 12.5 删除从节点配置

**DELETE** `/api/v1/sync/consumers/{dn}`

**成功响应（200）：** `data` 为 null。

---

### 12.6 获取同步状态

**GET** `/api/v1/sync/consumers/{dn}/status`

**成功响应（200）：**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "consumerDn": "cn=replica-01,cn=config",
    "enabled": true,
    "lastSyncTime": "2025-03-06T09:55:00.000+08:00",
    "lastSyncStatus": "SUCCESS",
    "contextCSN": "20250306015500.000000Z#000000#000#000000"
  },
  "timestamp": "2025-03-06T10:00:00.000+08:00"
}
```

---

### 12.7 触发立即刷新

**POST** `/api/v1/sync/consumers/{dn}/refresh`

**请求体：** 空或 `{}`

**成功响应（200）：** `data` 为 null 或任务标识。

---

## 13. 接口索引

| 分类 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 认证 | POST | /api/v1/auth/login | 登录 |
| 认证 | POST | /api/v1/auth/refresh | 刷新 Token |
| 认证 | POST | /api/v1/auth/logout | 登出 |
| 认证 | POST | /api/v1/auth/change-password | 修改密码 |
| 认证 | GET | /api/v1/auth/current | 当前用户 |
| 用户 | GET | /api/v1/users | 用户列表 |
| 用户 | GET | /api/v1/users/{dn} | 用户详情 |
| 用户 | POST | /api/v1/users | 创建用户 |
| 用户 | PUT | /api/v1/users/{dn} | 更新用户 |
| 用户 | DELETE | /api/v1/users/{dn} | 删除用户 |
| 用户 | POST | /api/v1/users/{dn}/password/reset | 重置密码 |
| 用户 | POST | /api/v1/users/import | 导入用户 |
| 用户 | GET/POST | /api/v1/users/export | 导出用户 |
| 组 | GET | /api/v1/groups | 组列表 |
| 组 | GET | /api/v1/groups/{dn} | 组详情 |
| 组 | POST | /api/v1/groups | 创建组 |
| 组 | PUT | /api/v1/groups/{dn} | 更新组 |
| 组 | DELETE | /api/v1/groups/{dn} | 删除组 |
| 组 | POST | /api/v1/groups/{dn}/members | 添加成员 |
| 组 | DELETE | /api/v1/groups/{dn}/members | 移除成员 |
| OU | GET | /api/v1/ous/tree | OU 树 |
| OU | GET | /api/v1/ous | OU 列表 |
| OU | GET | /api/v1/ous/{dn} | OU 详情 |
| OU | POST | /api/v1/ous | 创建 OU |
| OU | PUT | /api/v1/ous/{dn} | 更新 OU |
| OU | DELETE | /api/v1/ous/{dn} | 删除 OU |
| 树 | GET | /api/v1/tree/roots | 根节点 |
| 树 | GET | /api/v1/tree/children | 子节点 |
| 树 | GET | /api/v1/tree/search | 搜索节点 |
| 树 | GET | /api/v1/tree/path | 节点路径 |
| 审计 | GET | /api/v1/audit/logs | 审计列表 |
| 审计 | GET | /api/v1/audit/logs/{id} | 审计详情 |
| 审计 | GET | /api/v1/audit/statistics | 操作统计 |
| 审批 | GET | /api/v1/approvals/pending | 待审批 |
| 审批 | GET | /api/v1/approvals/history | 审批历史 |
| 审批 | POST | /api/v1/approvals | 创建审批 |
| 审批 | POST | /api/v1/approvals/{id}/approve | 通过 |
| 审批 | POST | /api/v1/approvals/{id}/reject | 拒绝 |
| 备份 | GET | /api/v1/backups | 备份列表 |
| 备份 | POST | /api/v1/backups | 创建备份 |
| 备份 | DELETE | /api/v1/backups/{id} | 删除备份 |
| 备份 | POST | /api/v1/backups/{id}/restore | 恢复 |
| 备份 | GET | /api/v1/backup-schedules | 计划列表 |
| 备份 | POST | /api/v1/backup-schedules | 创建计划 |
| 权限 | GET | /api/v1/roles | 角色列表 |
| 权限 | POST | /api/v1/roles | 创建角色 |
| 权限 | PUT | /api/v1/roles/{id}/permissions | 分配权限 |
| 权限 | GET | /api/v1/permissions | 权限列表 |
| 权限 | GET | /api/v1/permissions/tree | 权限树 |
| ACI | GET | /api/v1/acl | 列出 ACI |
| ACI | GET/POST | /api/v1/acl/preview | 预览 ACI |
| ACI | POST | /api/v1/acl | 创建 ACI |
| ACI | PUT | /api/v1/acl/{entryDn} | 更新 ACI |
| ACI | DELETE | /api/v1/acl/{entryDn} | 删除 ACI |
| ACI | POST | /api/v1/acl/apply-subtree | 应用到子树 |
| 同步 | GET | /api/v1/sync/consumers | 消费者列表 |
| 同步 | GET | /api/v1/sync/consumers/{dn} | 消费者详情 |
| 同步 | POST | /api/v1/sync/consumers | 创建消费者 |
| 同步 | PUT | /api/v1/sync/consumers/{dn} | 更新消费者 |
| 同步 | DELETE | /api/v1/sync/consumers/{dn} | 删除消费者 |
| 同步 | GET | /api/v1/sync/consumers/{dn}/status | 同步状态 |
| 同步 | POST | /api/v1/sync/consumers/{dn}/refresh | 触发刷新 |

---

## 13. 树形接口（通用）

### 13.1 获取根节点

**GET** `/api/v1/tree/roots?baseDn=dc=example,dc=com`

**成功响应（200）：** `data` 为根节点数组，结构同 5.1 树节点。

---

### 13.2 获取子节点（懒加载）

**GET** `/api/v1/tree/children?parentDn=ou=users,dc=example,dc=com&page=1&limit=100`

| 查询参数 | 类型 | 说明 |
|----------|------|------|
| parentDn | string | 是 | 父节点 DN |
| page | number | 否 | 页码，默认 1 |
| limit | number | 否 | 每页条数，默认 100 |

**成功响应（200）：**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "children": [
      {
        "id": "ou=active,ou=users,dc=example,dc=com",
        "dn": "ou=active,ou=users,dc=example,dc=com",
        "label": "active",
        "type": "ou",
        "hasChildren": true,
        "isLeaf": false
      }
    ],
    "total": 1
  },
  "timestamp": "2025-03-06T10:00:00.000+08:00"
}
```

---

### 13.3 搜索树节点

**GET** `/api/v1/tree/search?keyword=zhang&type=user`

| 查询参数 | 说明 |
|----------|------|
| keyword | 关键词 |
| type | 可选，ou / user / group |

**成功响应（200）：** `data` 为匹配节点数组（可含路径信息）。

---

### 13.4 获取节点路径

**GET** `/api/v1/tree/path?dn=uid=zhangsan,ou=users,dc=example,dc=com`

**成功响应（200）：**

```json
{
  "code": 200,
  "message": "success",
  "data": [
    { "dn": "dc=example,dc=com", "label": "example" },
    { "dn": "ou=users,dc=example,dc=com", "label": "users" },
    { "dn": "uid=zhangsan,ou=users,dc=example,dc=com", "label": "zhangsan" }
  ],
  "timestamp": "2025-03-06T10:00:00.000+08:00"
}
```

---

*文档版本：1.0，与 DESIGN.md 设计保持一致。*
