-- 阶段二：初始管理员（仅当 sys_user 无数据时插入，密码: admin）
INSERT INTO sys_user (username, password, real_name, email, status, created_at, updated_at)
SELECT 'admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '管理员', 'admin@example.com', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM sys_user WHERE username = 'admin');
