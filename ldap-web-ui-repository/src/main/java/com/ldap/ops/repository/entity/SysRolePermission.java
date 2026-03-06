package com.ldap.ops.repository.entity;

import lombok.Data;

import javax.persistence.*;

/**
 * 角色权限关联（阶段二建表，阶段五完善使用）
 */
@Data
@Entity
@Table(name = "sys_role_permission", uniqueConstraints = @UniqueConstraint(columnNames = {"role_id", "permission_id"}))
public class SysRolePermission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "role_id", nullable = false)
    private Long roleId;

    @Column(name = "permission_id", nullable = false)
    private Long permissionId;
}
