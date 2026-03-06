package com.ldap.ops.repository.entity;

import lombok.Data;

import javax.persistence.*;

/**
 * 用户角色关联（阶段二建表，阶段五完善使用）
 */
@Data
@Entity
@Table(name = "sys_user_role", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "role_id"}))
public class SysUserRole {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "role_id", nullable = false)
    private Long roleId;
}
