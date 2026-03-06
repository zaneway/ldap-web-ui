# LDAP 运维管理系统

基于 OpenLDAP 的运维管理系统，支持 LDAP 权限配置、数据增删改查、主从同步配置等。设计见 [DESIGN.md](./DESIGN.md)，接口见 [API-接口说明.md](./API-接口说明.md)。

## 阶段一：项目初始化（已完成）

- **后端**：Maven 多模块父项目 + 12 个子模块，父 POM 统一依赖管理（Spring Boot 2.7.x、Java 8、UnboundID LDAP SDK、JWT、Knife4j 等）
- **前端**：Vue 3 + TypeScript + Vite + Element Plus + Pinia + Vue Router 4 初始化

### 后端模块结构

```
ldap-web-ui/
├── pom.xml                     # 父 POM
├── ldap-web-ui-common/         # 公共
├── ldap-web-ui-repository/      # 数据访问
├── ldap-web-ui-ldap/            # LDAP 操作
├── ldap-web-ui-security/        # 安全
├── ldap-web-ui-service/         # 服务
├── ldap-web-ui-acl/             # ACI/ACL
├── ldap-web-ui-sync/            # 主从同步
├── ldap-web-ui-approval/        # 审批
├── ldap-web-ui-scheduler/       # 定时任务
├── ldap-web-ui-notification/    # 通知
├── ldap-web-ui-api/             # Controller
└── ldap-web-ui-app/             # 启动模块（含主类与 application.yml）
```

### 后端构建与运行

需安装 **Java 8+**、**Maven 3.6+**：

```bash
mvn clean install -DskipTests
cd ldap-web-ui-app && mvn spring-boot:run
```

### 前端

见 [frontend/README.md](./frontend/README.md)。

```bash
cd frontend
npm install
npm run dev
```

开发时前端代理 `/api` 到 `http://localhost:8080`。

## 阶段二：基础框架搭建（已完成）

- **Spring Boot 应用配置**：`application.yml` 配置 MySQL 数据源、JPA（ddl-auto=update）、JWT、LDAP 连接占位、Knife4j
- **Spring Security + JWT**：`JwtTokenProvider`、`JwtAuthenticationFilter`、`SecurityConfig`（放行登录/刷新/文档，其余需 JWT）
- **MySQL**：`sys_user`、`sys_role`、`sys_permission`、`sys_user_role`、`sys_role_permission` 实体与 Repository；启动时执行 `data.sql` 插入默认管理员
- **认证接口**：`POST /api/v1/auth/login`、`POST /api/v1/auth/refresh`、`GET /api/v1/auth/current`、`POST /api/v1/auth/logout`
- **OpenLDAP DIT**：见 [docs/openldap-dit-design.md](./docs/openldap-dit-design.md)；建表脚本见 [docs/schema-mysql.sql](./docs/schema-mysql.sql)

### 运行前准备

1. 创建数据库：`CREATE DATABASE ldap_ops DEFAULT CHARACTER SET utf8mb4;`
2. 可选：修改 `application.yml` 或环境变量 `MYSQL_PASSWORD`、`JWT_SECRET`、`LDAP_PASSWORD`
3. 默认管理员：用户名 `admin`，密码 `admin`（首次启动由 data.sql 插入）

### API 文档

启动后访问：http://localhost:8080/doc.html

## 后续阶段

- **阶段三**：LDAP 核心（连接管理、模板、用户/组/OU、ACI、同步）
- 其余见 DESIGN.md 实施计划。
