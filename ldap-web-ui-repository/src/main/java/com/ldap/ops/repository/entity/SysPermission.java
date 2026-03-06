package com.ldap.ops.repository.entity;

import lombok.Data;

import javax.persistence.*;

/**
 * 权限实体（阶段二建表，阶段五完善使用）
 */
@Data
@Entity
@Table(name = "sys_permission")
public class SysPermission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "parent_id")
    private Long parentId = 0L;

    @Column(name = "permission_code", nullable = false, unique = true, length = 100)
    private String permissionCode;

    @Column(name = "permission_name", nullable = false, length = 100)
    private String permissionName;

    @Column(name = "resource_type", nullable = false, length = 20)
    private String resourceType;

    @Column(name = "resource_path", length = 255)
    private String resourcePath;

    @Column(name = "http_method", length = 10)
    private String httpMethod;

    @Column(length = 50)
    private String icon;

    @Column(name = "sort_order")
    private Integer sortOrder = 0;
}
