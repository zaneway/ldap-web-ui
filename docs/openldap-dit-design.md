# OpenLDAP DIT 设计说明

本文档描述本系统所管理的 OpenLDAP 目录信息树（DIT）建议结构，与 DESIGN.md 5.2 一致。阶段三实现 LDAP 连接与 CRUD 时，将以此为基础。

## 1. 基准 DN

- 建议基准：`dc=example,dc=com`（实际部署可改为企业域名，如 `dc=company,dc=com`）。

## 2. DIT 结构

```
dc=example,dc=com
├── ou=users                    # 用户组织单元
│   ├── ou=active              # 活跃用户
│   ├── ou=inactive            # 非活跃用户
│   └── ou=disabled            # 禁用用户
│
├── ou=groups                   # 组组织单元
│   ├── cn=admins,ou=groups,dc=example,dc=com
│   ├── cn=developers,ou=groups,dc=example,dc=com
│   └── cn=users,ou=groups,dc=example,dc=com
│
├── ou=ou                       # 组织单元容器（业务 OU）
│   ├── ou=engineering,ou=ou,dc=example,dc=com
│   ├── ou=marketing,ou=ou,dc=example,dc=com
│   └── ou=sales,ou=ou,dc=example,dc=com
│
├── ou=services                 # 服务账号
│   └── ou=policies            # 策略配置
│
└── ou=audit                    # 审计相关 (可选)
```

## 3. 配置与连接

- 应用配置中的 LDAP 连接参数（`application.yml`）：
  - `spring.ldap.base`: 基准 DN，如 `dc=example,dc=com`
  - `spring.ldap.urls`: 服务器地址，如 `ldap://localhost:389`
  - `spring.ldap.username` / `spring.ldap.password`: 管理账号，用于系统对目录的增删改查

- 阶段三将使用 UnboundID LDAP SDK 连接上述 base，对 `ou=users`、`ou=groups`、`ou=ou` 等执行 CRUD。

## 4. 与 MySQL 的关系

- 本系统**管理元数据**（用户、角色、权限、审计、审批、备份记录等）存 **MySQL**。
- **业务目录数据**（用户条目、组、OU）以 **OpenLDAP** 为准；管理系统通过 LDAP 连接对其进行运维，不把目录数据镜像到 MySQL。
